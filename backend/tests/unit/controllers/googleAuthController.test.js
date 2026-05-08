// Esta vista comprueba el inicio de sesión con Google. Muestra 400 si no hay credential, 401 si el email no está verificado y 409 si el email ya está en uso.
const mockVerify=jest.fn();
jest.mock("google-auth-library",()=>({OAuth2Client:jest.fn(()=>({verifyIdToken:mockVerify}))}));
jest.mock("../../../models/Usuario",()=>{const M=jest.fn(); M.findOne=jest.fn(); return M;});
const Usuario=require("../../../models/Usuario"),M=require("../../../constants/messages");
const {googleAuth}=require("../../../controllers/googleAuthController");
const res=()=>({status:jest.fn().mockReturnThis(),json:jest.fn()});

// Suite básica de googleAuth
describe("googleAuth basico",()=>{
  const old=process.env.GOOGLE_CLIENT_ID;
  beforeEach(()=>{jest.clearAllMocks(); process.env.GOOGLE_CLIENT_ID="client-id";});
  afterAll(()=>{process.env.GOOGLE_CLIENT_ID=old;});
  // Limpia mocks antes de cada test
  test("sin credential => 400",async()=>{
    const r=res(); await googleAuth({body:{}},r);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({mensaje:M.USUARIOS.GOOGLE_TOKEN_REQUIRED});
  });

  // Valida rechazo por email no verificado
  test("email no verificado => 401",async()=>{
    mockVerify.mockResolvedValue({getPayload:()=>({email_verified:false})});
    const r=res(); await googleAuth({body:{credential:"tok"}},r);
    expect(r.status).toHaveBeenCalledWith(401);
    expect(r.json).toHaveBeenCalledWith({mensaje:M.USUARIOS.GOOGLE_EMAIL_UNVERIFIED});
  });
  
  // Valida conflicto por email
  test("conflicto por email => 409",async()=>{
    mockVerify.mockResolvedValue({getPayload:()=>({email_verified:true,email:"a@a.com",sub:"sub-1",name:"A"})});
    Usuario.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({googleId:"sub-2"});
    const r=res(); await googleAuth({body:{credential:"tok"}},r);
    expect(r.status).toHaveBeenCalledWith(409);
    expect(r.json).toHaveBeenCalledWith({mensaje:M.USUARIOS.GOOGLE_ACCOUNT_CONFLICT});
  });
});
