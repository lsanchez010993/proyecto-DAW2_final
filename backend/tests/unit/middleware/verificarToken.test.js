// Esta vista comprueba el token de autenticación. Muestra 401 si no hay token, 401 si el token es inválido y next y req.usuario si el token es válido.
jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));
const jwt = require("jsonwebtoken"),
  verificarToken = require("../../../middleware/auth");
const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe("middleware auth basico", () => {
  beforeEach(() => jest.clearAllMocks());
  // Limpia mocks antes de cada test
  test("sin token => 401", () => {
    const r = res(),
      next = jest.fn();
    verificarToken({ header: () => undefined }, r, next);
    expect(r.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Valida rechazo por token invalido
  test("token invalido => 401", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad");
    });
    const r = res(),
      next = jest.fn();
    verificarToken({ header: () => "Bearer bad" }, r, next);
    expect(r.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  
  // Valida token valido
  test("token valido => next y req.usuario", () => {
    jwt.verify.mockReturnValue({ id: "u1", rol: "admin" });
    const req = { header: () => "Bearer ok" },
      r = res(),
      next = jest.fn();
    verificarToken(req, r, next);
    expect(req.usuario).toEqual({ id: "u1", rol: "admin" });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
