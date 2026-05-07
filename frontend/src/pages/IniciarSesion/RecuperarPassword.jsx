
import { APP_MESSAGES } from "../../constants/messages";

export default function RecuperarPassword({ isRecoveryOpen, setIsRecoveryOpen, RecuperarPassOlvidado, RecuperarEmail, setRecuperarEmail }) {
  if (!isRecoveryOpen) return null;
  const M = APP_MESSAGES.PAGES.RECUPERAR_PASSWORD;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{M.TITULO}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label={M.CERRAR_ARIA}
                onClick={() => setIsRecoveryOpen(false)}
              />
            </div>
            <form
              onSubmit={async (e) => {
                await RecuperarPassOlvidado(e);
                setIsRecoveryOpen(false);
              }}
            >
              <div className="modal-body">
                <label className="form-label">{M.LABEL_EMAIL}</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder={M.EMAIL_PLACEHOLDER}
                  value={RecuperarEmail}
                  onChange={(e) => setRecuperarEmail(e.target.value)}
                  required
                  autoFocus
                />
                <small className="text-muted d-block mt-2">
                  {M.AYUDA}
                </small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsRecoveryOpen(false)}>
                  {M.CANCELAR}
                </button>
                <button type="submit" className="btn btn-primary">
                  {M.ENVIAR}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}