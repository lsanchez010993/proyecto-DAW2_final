
import { Link } from 'react-router-dom';
import useRegistroUser from "./useRegistroUser";

import BotonIniciarSesiónGoogle from "../../components/BotonInicioSesionGoogle.jsx";
function RegistroUserPage() {

    const { nombre, setNombre, email, setEmail, password, setPassword, alerta, handleSubmit, loginWithGoogle } = useRegistroUser();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
          
          <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
            
            <h3 className="text-center mb-4 fw-bold">Crear Cuenta</h3>
    
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
                  placeholder="Nombre de usuario"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
    
              {/* 2. CAMPO EMAIL */}
              <div className="mb-3">
                <input 
                  type="email" 
                  className="form-control py-2" 
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
    
              {/* 3. CAMPO PASSWORD */}
              <div className="mb-3">
                <input 
                  type="password" 
                  className="form-control py-2" 
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
    
              {/* BOTÓN REGISTRARSE */}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                Registrarse
              </button>
            </form>

              {/* SEPARADOR */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="mx-3 text-muted small">O continua con:</span>
                <hr className="flex-grow-1" />
              </div>
    
              <BotonIniciarSesiónGoogle text="signup_with" onCredential={loginWithGoogle} />
    
            <div className="mt-4 text-center">
                <Link to="/login" className="text-decoration-none text-muted small">
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </div>
    
          </div>
        </div>
  );
}

export default RegistroUserPage;
