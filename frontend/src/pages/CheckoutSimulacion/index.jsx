import { Link } from "react-router-dom";
import { useState } from "react";

import { useProcesamientoPago } from "./useProcesamientoPago";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import { APP_MESSAGES } from "../../constants/messages";

function CheckoutSimulacionPage() {
  const M = APP_MESSAGES.PAGES.CHECKOUT;
  const {
    requiereLogin,
    carritoVacio,
    finalizarCompra,
    resumen,
    enviando,
    tarjeta,
    setTarjeta,
    vencimiento,
    setVencimiento,
    titular,
    setTitular,
    cvv,
    setCvv,
  } = useProcesamientoPago();

  const [modalAbierto, setModalAbierto] = useState(false);

  if (requiereLogin) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">{M.TITULO}</h2>
        <div className="alert alert-warning">
          {`${M.LOGIN_REQUERIDO} `}
          <Link to="/login" className="alert-link">
            {M.LINK_LOGIN}
          </Link>
          .
        </div>
      </div>
    );
  }

  if (carritoVacio) {
    return (
      <div className="container mt-4 text-center">
        <h2 className="mb-3 fw-bold">{M.TITULO}</h2>
        <div className="text-muted mb-3">{M.CARRITO_VACIO}</div>
        <Link to="/" className="btn btn-primary">
          {M.VOLVER_TIENDA}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">{M.TITULO}</h2>
          <p className="text-muted mb-0">
            {M.SUBTITULO}
          </p>
        </div>
        <Link to="/carrito" className="btn btn-outline-dark">
          {M.VOLVER_CARRITO}
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{M.DATOS_PAGO}</h5>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!enviando) setModalAbierto(true);
                }}
              >
                <div className="mb-3">
                  <label className="form-label">{M.TARJETA_LABEL}</label>
                  <input
                    className="form-control"
                    value={tarjeta}
                    onChange={(e) => setTarjeta(e.target.value)}
                    placeholder={M.TARJETA_PLACEHOLDER}
                    autoComplete="off"
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">{M.VENCIMIENTO_LABEL}</label>
                    <input
                      className="form-control"
                      value={vencimiento}
                      onChange={(e) => setVencimiento(e.target.value)}
                      placeholder={M.VENCIMIENTO_PLACEHOLDER}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">{M.CVV_LABEL}</label>
                    <input
                      className="form-control"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder={M.CVV_PLACEHOLDER}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">{M.TITULAR_LABEL}</label>
                  <input
                    className="form-control"
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                    placeholder={M.TITULAR_PLACEHOLDER}
                    autoComplete="off"
                  />
                </div>

                <button
                  className="btn btn-success btn-lg w-100"
                  type="submit"
                  disabled={enviando}
                >
                  {enviando ? M.REGISTRANDO : M.REALIZAR_COMPRA}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{M.RESUMEN}</h5>
              <ul className="list-group list-group-flush">
                {resumen.lineas.map((l, idx) => (
                  <li
                    key={`${l._id}-${l.tipo}-${idx}`}
                    className="list-group-item px-0 d-flex justify-content-between align-items-start"
                  >
                    <div className="me-3">
                      <div className="fw-semibold">{l.titulo}</div>
                      <div className="text-muted small text-capitalize">
                        {l.tipo} · x{l.cantidad}
                      </div>
                    </div>
                    <div className="text-nowrap">
                      {l.subtotal.toFixed(2)} €
                    </div>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{M.TOTAL}</span>
                <span className="fw-bold text-primary">{resumen.total} €</span>
              </div>
              <div className="text-muted small mt-2">
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalConfirmacion
        isOpen={modalAbierto}
        titulo={M.MODAL_TITULO}
        mensaje={M.MODAL_MENSAJE}
        textoConfirmar={M.MODAL_CONFIRMAR}
        isDanger={false}
        onCancel={() => setModalAbierto(false)}
        onConfirm={async () => {
          setModalAbierto(false);
          await finalizarCompra();
        }}
      />
    </div>
  );
}

export default CheckoutSimulacionPage;
