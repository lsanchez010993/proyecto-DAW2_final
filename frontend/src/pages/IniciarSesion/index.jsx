import { Link } from "react-router-dom";
import useIniciarSesion from "./useIniciarSesion";
import { useState } from "react";
import RecuperarPassword from "./RecuperarPassword";
import { APP_MESSAGES } from "../../constants/messages";

import BotonIniciarSesiónGoogle from "../../components/BotonInicioSesionGoogle.jsx";

function IniciarSesionPage() {
  const M = APP_MESSAGES.PAGES.INICIAR_SESION;
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
          <h3 className="text-center mb-4 fw-bold">{M.TITULO}</h3>

          <form onSubmit={handleSubmit}>
            {/* INPUT EMAIL */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control py-2"
                placeholder={M.EMAIL_PLACEHOLDER}
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
                placeholder={M.PASSWORD_PLACEHOLDER}
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
                  {M.RECORDAR_SESION}
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
                {M.OLVIDE_PASSWORD}
              </button>
            </div>

            {/* BOTÓN AZUL GRANDE */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
              {M.BOTON_LOGIN}
            </button>
          </form>

          {/* SEPARADOR */}
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">{M.SEPARADOR}</span>
            <hr className="flex-grow-1" />
          </div>

          <BotonIniciarSesiónGoogle text="signin_with" onCredential={loginWithGoogle} />

          {/* ENLACE A REGISTRO */}
          <div className="text-center mt-4">
            <span className="text-muted">{`${M.NO_TIENE_CUENTA} `}</span>
            <Link to="/registro" className="text-primary text-decoration-none fw-bold">
              {M.REGISTRATE}
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
