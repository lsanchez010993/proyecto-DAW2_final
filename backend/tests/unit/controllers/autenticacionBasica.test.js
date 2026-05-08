// Este test valida casos básicos de error en autenticación: login con password incorrecta, forgot sin email y reset sin token.
jest.mock("../../../models/Usuario", () => ({ findOne: jest.fn() }));
// Mock del modelo Usuario
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));
// Mock de bcrypt.compare
const Usuario = require("../../../models/Usuario"),
  bcrypt = require("bcryptjs"),
  M = require("../../../constants/messages");
// Dependencias mockeadas y mensajes
const { loginUsuario, forgotPassword, resetPassword } = require("../../../controllers/authController"); 


const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

// Métodos autenticacion basica
describe("auth basico", () => {
  // Suite básica de auth
  beforeEach(() => jest.clearAllMocks());
  // Limpia mocks antes de cada test

  test("login con password incorrecta => 401", async () => {
    // Valida rechazo por contraseña inválida
    Usuario.findOne.mockResolvedValue({ password: "1234" });
    bcrypt.compare.mockResolvedValue(false);
    // Usuario existe pero contraseña no coincide
    const r = res();
    await loginUsuario({ body: { email: "prueba1@mail.com", password: "x" } }, r); // Ejecuta login
    expect(r.status).toHaveBeenCalledWith(401);
    // Espera estado 401
  });

  test("forgot sin email => 400", async () => {
    // Valida email obligatorio en recuperación
    const r = res();
    await forgotPassword({ body: {} }, r);
    // Ejecuta sin email
    expect(r.json).toHaveBeenCalledWith({ mensaje: M.PASSWORD_RESET.EMAIL_REQUIRED });
  });

  test("reset sin token => 400", async () => {
    // Valida token obligatorio en reset
    const r = res();
    await resetPassword({ body: { password: "Valida123" } }, r); // Ejecuta sin token
    expect(r.json).toHaveBeenCalledWith({ mensaje: M.PASSWORD_RESET.TOKEN_REQUIRED });
  });
});
