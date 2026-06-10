import { APP_MESSAGES } from "../../constants/messages";

export default function RecuperarPassword({ 
  isRecoveryOpen, 
  setIsRecoveryOpen, 
  RecuperarPassOlvidado, 
  RecuperarEmail, 
  setRecuperarEmail 
}) {
  if (!isRecoveryOpen) return null;
  const M = APP_MESSAGES.PAGES.RECUPERAR_PASSWORD;

  const modalTitleId = "recuperar-password-title";
  const emailInputId = "recuperar-password-email";
  const emailHelpId = "recuperar-password-help";

  return (
    <>
      <div 
        className="modal fade show" 
        style={{ display: "block" }} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby={modalTitleId}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            
            
            <header className="modal-header">
              <h2 id={modalTitleId} className="modal-title h5">
                {M.TITULO}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label={M.CERRAR_ARIA || "Cerrar ventana emergente"}
                onClick={() => setIsRecoveryOpen(false)}
              />
            </header>

            <form
              onSubmit={async (e) => {
                await RecuperarPassOlvidado(e);
                setIsRecoveryOpen(false);
              }}
              noValidate
            >
              <div className="modal-body">
                <label htmlFor={emailInputId} className="form-label fw-semibold">
                  {M.LABEL_EMAIL}
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  className="form-control"
                  placeholder={M.EMAIL_PLACEHOLDER}
                  value={RecuperarEmail}
                  onChange={(e) => setRecuperarEmail(e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby={emailHelpId} 
                  autoFocus
                />
                
                <small id={emailHelpId} className="text-muted d-block mt-2">
                  {M.AYUDA}
                </small>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsRecoveryOpen(false)}>
                  {M.CANCELAR}
                </button>
                <button type="submit" className="btn btn-primary">
                  {M.ENVIAR}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  );
}