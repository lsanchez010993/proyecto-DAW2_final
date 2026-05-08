// Mock del modelo Usuario 
jest.mock("../../../models/Usuario", () => {
  const U = jest.fn();
  U.findOne = jest.fn();
  return U;
});

// Mock de bcrypt 
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

const Usuario = require("../../../models/Usuario");
const bcrypt = require("bcryptjs");
const M = require("../../../constants/messages");
const { registrarUsuario } = require("../../../controllers/authController");

// Simula el objeto res de Express con encadenamiento status().json().
const res = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("registro basico", () => {
  
  beforeEach(() => jest.clearAllMocks());

  test("registra usuario correctamente", async () => {
    const save = jest.fn().mockResolvedValue(undefined);

    // Flujo correcto: no hay duplicados, se hashea password y se guarda.
    Usuario.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    Usuario.mockImplementation((b) => ({ ...b, save }));

    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hash123");

    const r = res();

    await registrarUsuario(
      { body: { email: "nuevo@mail.com", password: "Clave123", nombre: "Juanito" } },
      r
    );

    expect(save).toHaveBeenCalledTimes(1);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.CREATE_SUCCESS,
    });
  });

  test("falta email/password/nombre => 400", async () => {
    // Validación temprana de campos obligatorios.
    const r = res();

    await registrarUsuario(
      { body: { email: "", password: "Clave123", nombre: "Juanito" } },
      r
    );

    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.CAMPOS_OBLIGATORIOS,
    });
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test("email invalido => 400", async () => {
    // Debe frenar antes de consultar la base de datos.
    const r = res();

    await registrarUsuario(
      { body: { email: "correo-invalido", password: "Clave123", nombre: "Luis" } },
      r
    );

    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.EMAIL_FORMATO,
    });
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test("password con longitud < 6 => 400", async () => {
    // Regla mínima de seguridad de longitud.
    const r = res();

    await registrarUsuario(
      { body: { email: "ok@mail.com", password: "C1a", nombre: "Luis" } },
      r
    );

    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.PASSWORD_LONGITUD,
    });
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test("password sin mayuscula o sin numero => 400", async () => {
    // Regla de complejidad: al menos una mayúscula y un número.
    const r = res();

    await registrarUsuario(
      { body: { email: "ok@mail.com", password: "claveaaa", nombre: "Luis" } },
      r
    );

    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.PASSWORD_MAYUSCULA_NUMERO,
    });
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test("email ya en uso => 400", async () => {
    // Si existe email, corta el proceso sin intentar guardar.
    const r = res();

    Usuario.findOne.mockResolvedValueOnce({ _id: "u1" }); // email existe

    await registrarUsuario(
      { body: { email: "existente@mail.com", password: "Clave123", nombre: "Luis" } },
      r
    );

    expect(Usuario.findOne).toHaveBeenCalledWith({ email: "existente@mail.com" });
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.EMAIL_IN_USE,
    });
  });

  test("nombre ya en uso => 400", async () => {
    const r = res();

    // Primera búsqueda por email; segunda por nombre.
    Usuario.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: "u2" });

    await registrarUsuario(
      { body: { email: "nuevo@mail.com", password: "Clave123", nombre: "Luis" } },
      r
    );

    expect(Usuario.findOne).toHaveBeenNthCalledWith(1, { email: "nuevo@mail.com" });
    expect(Usuario.findOne).toHaveBeenNthCalledWith(2, { nombre: "Luis" });
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.NOMBRE_USUARIO_EN_USO,
    });
  });

  test("error interno (findOne falla) => 500", async () => {
    // Cubre el catch general del controlador.
    const r = res();

    Usuario.findOne.mockRejectedValueOnce(new Error("DB down"));

    await registrarUsuario(
      { body: { email: "nuevo@mail.com", password: "Clave123", nombre: "Luis" } },
      r
    );

    expect(r.status).toHaveBeenCalledWith(500);
    expect(r.json).toHaveBeenCalledWith({
      mensaje: M.ERRORS_REGISTRO_USER.SAVE_ERROR,
    });
  });

  test("si no llega rol, asigna 'usuario' por defecto", async () => {
    // Comprueba la asignación del rol por defecto en creación.
    const save = jest.fn().mockResolvedValue(undefined);
    let instanciaCreada;

    Usuario.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    Usuario.mockImplementation((b) => {
      instanciaCreada = { ...b, save };
      return instanciaCreada;
    });

    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hash123");

    const r = res();

    await registrarUsuario(
      { body: { email: "nuevo@mail.com", password: "Clave123", nombre: "Luis" } },
      r
    );

    expect(instanciaCreada.rol).toBe("usuario");
  });
});