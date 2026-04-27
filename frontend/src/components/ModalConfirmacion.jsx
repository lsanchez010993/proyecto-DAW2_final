function ModalConfirmacion({ isOpen, titulo, mensaje, textoConfirmar, onConfirm, onCancel, isDanger }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className={`modal-title fw-bold ${isDanger ? 'text-danger' : 'text-primary'}`}>
              {titulo}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <span className="fs-1">{isDanger ? '🚨' : '⚠️'}</span>
            </div>
            <div className="fs-5 mb-1">
              {mensaje}
            </div>
          </div>
          <div className="modal-footer border-0 pt-0 justify-content-center gap-2 pb-4">
            <button type="button" className="btn btn-light px-4" onClick={onCancel}>
              Cancelar
            </button>
            <button 
              type="button" 
              className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} px-4`} 
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