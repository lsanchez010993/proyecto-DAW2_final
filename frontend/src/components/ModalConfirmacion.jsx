import styles from "./css/ModalConfirmacion.module.css";

function ModalConfirmacion({ isOpen, titulo, mensaje, textoConfirmar, onConfirm, onCancel, isDanger }) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal show d-block ${styles.overlay}`}
      data-danger={isDanger ? "true" : "false"}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-0 shadow-lg ${styles.content}`}>
          <div className={`px-4 pt-4 pb-3 ${styles.header}`}>
            <div className="d-flex align-items-start justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className={styles.iconWrap}>
                  <svg
                    className={styles.iconSvg}
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    {isDanger ? (
                      <>
                        <path
                          d="M12 9v5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 17h.01"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M12 8v4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 16h.01"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </svg>
                </div>
                <div>
                  <h5 className={`modal-title fw-bold mb-1 ${styles.title}`}>{titulo}</h5>
                  <div className="small text-muted">Confirma tu acción para continuar</div>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={onCancel} aria-label="Cerrar"></button>
            </div>
          </div>

          <div className="modal-body px-4 pt-4 pb-0">
            <div className={`fs-6 ${styles.message}`}>{mensaje}</div>
          </div>

          <div className={`modal-footer border-0 px-4 pt-4 pb-4 d-flex justify-content-end gap-2 ${styles.footer}`}>
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>
              Cancelar
            </button>
            <button
              type="button"
              className={`btn ${isDanger ? "btn-danger" : "btn-primary"} px-4`}
              onClick={onConfirm}
            >
              {textoConfirmar || "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;
