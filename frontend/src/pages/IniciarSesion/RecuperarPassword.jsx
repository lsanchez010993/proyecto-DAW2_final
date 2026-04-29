

export default function RecuperarPassword({ isRecoveryOpen, setIsRecoveryOpen, RecuperarPassOlvidado, RecuperarEmail, setRecuperarEmail }) {
  if (!isRecoveryOpen) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Recuperar contraseña</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
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
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tuemail@ejemplo.com"
                  value={RecuperarEmail}
                  onChange={(e) => setRecuperarEmail(e.target.value)}
                  required
                  autoFocus
                />
                <small className="text-muted d-block mt-2">
                  Te enviaremos un enlace para restablecer la contraseña (caduca en 1 hora).
                </small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsRecoveryOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Recuperar contraseña
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