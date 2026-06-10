import { Link } from 'react-router-dom';
import useRegistroUser from "./useRegistroUser";
import { APP_MESSAGES } from "../../constants/messages";
import BotonIniciarSesiónGoogle from "../../components/BotonInicioSesionGoogle.jsx";

function RegistroUserPage() {
    const M = APP_MESSAGES.PAGES.REGISTRO;
    const { 
      nombre, setNombre, 
      email, setEmail, 
      password, setPassword, 
      alerta, handleSubmit, 
      loginWithGoogle 
    } = useRegistroUser();

    return (
        <main className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
          <section 
            className="card border-0 shadow-sm p-4" 
            style={{ width: '100%', maxWidth: '400px' }}
            aria-labelledby="titulo-registro"
          >
            <h1 id="titulo-registro" className="h3 text-center mb-4 fw-bold">{M.TITULO}</h1>
            {alerta && (
                <div 
                  className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} text-center`}
                  role="alert"
                  aria-live="assertive"
                >
                    {alerta.msg}
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              
              {/* INPUT NOMBRE */}
              <div className="mb-3">
                <label htmlFor="reg-nombre" className="visually-hidden">
                  {M.NOMBRE_PLACEHOLDER || "Nombre de usuario"}
                </label>
                <input 
                  id="reg-nombre"
                  type="text" 
                  className="form-control py-2" 
                  placeholder={M.NOMBRE_PLACEHOLDER}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
    
              {/* INPUT EMAIL */}
              <div className="mb-3">
                <label htmlFor="reg-email" className="visually-hidden">
                  {M.EMAIL_PLACEHOLDER || "Correo electrónico"}
                </label>
                <input 
                  id="reg-email"
                  type="email" 
                  className="form-control py-2" 
                  placeholder={M.EMAIL_PLACEHOLDER}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
    
              {/* INPUT PASSWORD */}
              <div className="mb-3">
                <label htmlFor="reg-password" className="visually-hidden">
                  {M.PASSWORD_PLACEHOLDER || "Contraseña"}
                </label>
                <input 
                  id="reg-password"
                  type="password" 
                  className="form-control py-2" 
                  placeholder={M.PASSWORD_PLACEHOLDER}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
    
              {/* BOTÓN REGISTRARSE */}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                {M.BOTON_REGISTRO}
              </button>
            </form>

            {/* SEPARADOR DECORATIVO OCULTO A LECTORES */}
            <div className="d-flex align-items-center my-4" aria-hidden="true">
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
    
          </section>
        </main>
  );
}

export default RegistroUserPage;