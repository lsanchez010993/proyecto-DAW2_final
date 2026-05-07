
import { Link } from 'react-router-dom';
import useRegistroUser from "./useRegistroUser";
import { APP_MESSAGES } from "../../constants/messages";

import BotonIniciarSesiónGoogle from "../../components/BotonInicioSesionGoogle.jsx";
function RegistroUserPage() {
    const M = APP_MESSAGES.PAGES.REGISTRO;

    const { nombre, setNombre, email, setEmail, password, setPassword, alerta, handleSubmit, loginWithGoogle } = useRegistroUser();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
          
          <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
            
            <h3 className="text-center mb-4 fw-bold">{M.TITULO}</h3>
    
            {/* ALERTA VISUAL */}
            {alerta && (
                <div className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} text-center`}>
                    {alerta.msg}
                </div>
            )}
    
            <form onSubmit={handleSubmit}>
              {/* 1. CAMPO NOMBRE DE USUARIO (NICK) */}
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control py-2" 
                  placeholder={M.NOMBRE_PLACEHOLDER}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
    
              {/* 2. CAMPO EMAIL */}
              <div className="mb-3">
                <input 
                  type="email" 
                  className="form-control py-2" 
                  placeholder={M.EMAIL_PLACEHOLDER}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
    
              {/* 3. CAMPO PASSWORD */}
              <div className="mb-3">
                <input 
                  type="password" 
                  className="form-control py-2" 
                  placeholder={M.PASSWORD_PLACEHOLDER}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
    
              {/* BOTÓN REGISTRARSE */}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                {M.BOTON_REGISTRO}
              </button>
            </form>

              {/* SEPARADOR */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="mx-3 text-muted small">{M.SEPARADOR}</span>
                <hr className="flex-grow-1" />
              </div>
    
              <BotonIniciarSesiónGoogle text="signup_with" onCredential={loginWithGoogle} />
    
            <div className="mt-4 text-center">
                <Link to="/login" className="text-decoration-none text-muted small">
                    {M.YA_TIENES_CUENTA}
                </Link>
            </div>
    
          </div>
        </div>
  );
}

export default RegistroUserPage;
