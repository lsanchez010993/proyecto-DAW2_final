import styles from "./EditarPerfil.module.css";

export default function PasswordModal({
  showModal,
  setShowModal,
  submitPassword,
  passData,
  handlePassChange
}) {
  if (!showModal) return null;

  return (
    <div className={`modal fade show d-block ${styles.modalOverlay}`}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Actualizar Contraseña</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <form onSubmit={submitPassword}>
            <div className="modal-body py-4">
              <div className="mb-3">
                <label className="small text-muted mb-1">Contraseña Actual</label>
                <input 
                  type="password" 
                  name="actual" 
                  className="form-control rounded-pill" 
                  required 
                  value={passData.actual} 
                  onChange={handlePassChange} 
                />
              </div>
              <div className="mb-3">
                <label className="small text-muted mb-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="nueva" 
                  className="form-control rounded-pill" 
                  required 
                  value={passData.nueva} 
                  onChange={handlePassChange} 
                />
              </div>
              <div className="mb-0">
                <label className="small text-muted mb-1">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="confirmar" 
                  className="form-control rounded-pill" 
                  required 
                  value={passData.confirmar} 
                  onChange={handlePassChange} 
                />
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-light rounded-pill px-4" 
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-dark rounded-pill px-4 shadow-sm"
              >
                Guardar Nueva Clave
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
