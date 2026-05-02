import { Link } from "react-router-dom";
import useIniciarSesion from "./useIniciarSesion";
import { useState } from "react";
import RecuperarPassword from "./RecuperarPassword";

import BotonIniciarSesiónGoogle from "../../components/BotonInicioSesionGoogle.jsx";

function IniciarSesionPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    recordar,
    setRecordar,
    handleSubmit,
    RecuperarEmail,
    setRecuperarEmail,
    RecuperarPassOlvidado,
    loginWithGoogle,
  } = useIniciarSesion();

  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  return (
    <>
      {/* CONTENEDOR PRINCIPAL */}
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f0f2f5" }}>
        {/* TARJETA BLANCA CENTRADA */}
        <div className="card border-0 shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
          <h3 className="text-center mb-4 fw-bold">Inicia sesión</h3>

          <form onSubmit={handleSubmit}>
            {/* INPUT EMAIL */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control py-2"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* INPUT PASSWORD */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control py-2"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 form-check d-flex justify-content-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="recordarCheck"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                />
                <label className="form-check-label text-muted small" htmlFor="recordarCheck">
                  Recordar sesión
                </label>
              </div>

              <button
                type="button"
                className="btn btn-link p-0 text-primary text-decoration-none small"
                onClick={() => {
                  setRecuperarEmail(email);
                  setIsRecoveryOpen(true);
                }}
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>

            {/* BOTÓN AZUL GRANDE */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
              Iniciar Sesión
            </button>
          </form>

          {/* SEPARADOR */}
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">O continua con</span>
            <hr className="flex-grow-1" />
          </div>

          <BotonIniciarSesiónGoogle text="signin_with" onCredential={loginWithGoogle} />

          {/* ENLACE A REGISTRO */}
          <div className="text-center mt-4">
            <span className="text-muted">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-primary text-decoration-none fw-bold">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>

      {isRecoveryOpen && (
        <RecuperarPassword
          isRecoveryOpen={isRecoveryOpen}
          setIsRecoveryOpen={setIsRecoveryOpen}
          RecuperarPassOlvidado={RecuperarPassOlvidado}
          RecuperarEmail={RecuperarEmail}
          setRecuperarEmail={setRecuperarEmail}
        />
      )}
    </>
  );
}
export default IniciarSesionPage;
