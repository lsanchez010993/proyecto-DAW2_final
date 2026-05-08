jest.mock("../../../models/Usuario", () => ({
  findById: jest.fn(),
}));

jest.mock("../../../models/ResenaLibro", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

const Usuario = require("../../../models/Usuario");
const ResenaLibro = require("../../../models/ResenaLibro");
const {
  listarResenasPorLibro,
  upsertResena,
} = require("../../../controllers/resenasController");

const LIBRO_ID = "507f1f77bcf86cd799439011";
const USUARIO_ID = "507f1f77bcf86cd799439012";

const resMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

function mockUsuarioConCompra() {
  Usuario.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: USUARIO_ID,
      biblioteca_digital: [{ libro: LIBRO_ID }],
    }),
  });
}

function mockUsuarioSinCompra() {
  Usuario.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: USUARIO_ID,
      biblioteca_digital: [],
    }),
  });
}

function mockFindResenas(resultado) {
  const query = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(resultado),
  };
  ResenaLibro.find.mockReturnValue(query);
}

describe("resenasController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listar reseñas públicas devuelve data y resumen", async () => {
    ResenaLibro.countDocuments.mockResolvedValue(2);
    mockFindResenas([
      { _id: "r1", puntuacion: 5, resena: "Muy bueno" },
      { _id: "r2", puntuacion: 4, resena: "Recomendado" },
    ]);
    ResenaLibro.aggregate.mockResolvedValue([{ mediaPuntuacion: 4.5, total: 2 }]);

    const res = resMock();
    await listarResenasPorLibro({ params: { libroId: LIBRO_ID }, query: {} }, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),
        resumen: expect.objectContaining({
          mediaPuntuacion: 4.5,
          totalResenas: 2,
        }),
      }),
    );
  });

  test("upsert devuelve 403 si el usuario no ha comprado el libro", async () => {
    mockUsuarioSinCompra();
    const res = resMock();

    await upsertResena(
      {
        params: { libroId: LIBRO_ID },
        body: { puntuacion: 4, resena: "Bien" },
        usuario: { id: USUARIO_ID },
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(ResenaLibro.findOne).not.toHaveBeenCalled();
  });

  test("upsert crea reseña cuando no existe previa", async () => {
    mockUsuarioConCompra();
    ResenaLibro.findOne.mockResolvedValue(null);
    ResenaLibro.create.mockResolvedValue({
      _id: "r-new",
      usuario: USUARIO_ID,
      libro: LIBRO_ID,
      puntuacion: 5,
      resena: "Excelente",
    });

    const res = resMock();
    await upsertResena(
      {
        params: { libroId: LIBRO_ID },
        body: { puntuacion: 5, resena: "Excelente" },
        usuario: { id: USUARIO_ID },
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(ResenaLibro.create).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario: USUARIO_ID,
        libro: LIBRO_ID,
        puntuacion: 5,
      }),
    );
  });

  test("upsert actualiza reseña existente", async () => {
    mockUsuarioConCompra();
    const save = jest.fn().mockResolvedValue({
      _id: "r1",
      puntuacion: 3,
      resena: "Actualizada",
    });
    ResenaLibro.findOne.mockResolvedValue({
      puntuacion: 2,
      resena: "Vieja",
      save,
    });

    const res = resMock();
    await upsertResena(
      {
        params: { libroId: LIBRO_ID },
        body: { puntuacion: 3, resena: "Actualizada" },
        usuario: { id: USUARIO_ID },
      },
      res,
    );

    expect(save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("upsert valida que la puntuación esté entre 1 y 5", async () => {
    const res = resMock();
    await upsertResena(
      {
        params: { libroId: LIBRO_ID },
        body: { puntuacion: 6, resena: "Fuera de rango" },
        usuario: { id: USUARIO_ID },
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findById).not.toHaveBeenCalled();
  });
});
