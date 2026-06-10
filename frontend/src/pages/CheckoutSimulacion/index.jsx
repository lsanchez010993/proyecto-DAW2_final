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
      <div className="container mt-4 text-center">
        <h1 className="h2 mb-3 fw-bold">{M.TITULO}</h1>
        <div className="alert alert-warning" role="alert">
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
        <h1 className="h2 mb-3 fw-bold">{M.TITULO}</h1>
        <div className="text-muted mb-3">{M.CARRITO_VACIO}</div>
        <Link to="/" className="btn btn-primary">
          {M.VOLVER_TIENDA}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4" aria-labelledby="titulo-checkout">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h1 id="titulo-checkout" className="h2 mb-1 fw-bold">{M.TITULO}</h1>
          <p className="text-muted mb-0">
            {M.SUBTITULO}
          </p>
        </div>
        <Link to="/carrito" className="btn btn-outline-dark">
          {M.VOLVER_CARRITO}
        </Link>
      </header>

      <div className="row g-4">
        {/* Formulario principal de pago */}
        <section className="col-12 col-lg-7" aria-labelledby="titulo-datos-pago">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 id="titulo-datos-pago" className="h5 fw-bold mb-3">{M.DATOS_PAGO}</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!enviando) setModalAbierto(true);
                }}
                noValidate
              >
                <div className="mb-3">
                  <label htmlFor="pago-tarjeta" className="form-label">{M.TARJETA_LABEL}</label>
                  <input
                    id="pago-tarjeta"
                    className="form-control"
                    value={tarjeta}
                    onChange={(e) => setTarjeta(e.target.value)}
                    placeholder={M.TARJETA_PLACEHOLDER}
                    autoComplete="cc-number"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="pago-vencimiento" className="form-label">{M.VENCIMIENTO_LABEL}</label>
                    <input
                      id="pago-vencimiento"
                      className="form-control"
                      value={vencimiento}
                      onChange={(e) => setVencimiento(e.target.value)}
                      placeholder={M.VENCIMIENTO_PLACEHOLDER}
                      autoComplete="cc-exp"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="pago-cvv" className="form-label">{M.CVV_LABEL}</label>
                    <input
                      id="pago-cvv"
                      className="form-control"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder={M.CVV_PLACEHOLDER}
                      autoComplete="cc-csc"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="pago-titular" className="form-label">{M.TITULAR_LABEL}</label>
                  <input
                    id="pago-titular"
                    className="form-control"
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                    placeholder={M.TITULAR_PLACEHOLDER}
                    autoComplete="cc-name"
                    required
                    aria-required="true"
                  />
                </div>

                <button
                  className="btn btn-success btn-lg w-100"
                  type="submit"
                  disabled={enviando}
                  aria-busy={enviando}
                >
                  {enviando ? M.REGISTRANDO : M.REALIZAR_COMPRA}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Resumen de compra lateral */}
        <aside className="col-12 col-lg-5" aria-labelledby="titulo-resumen">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 id="titulo-resumen" className="h5 fw-bold mb-3">{M.RESUMEN}</h2>
              
              <ul className="list-group list-group-flush" aria-label="Lista de artículos en el pedido">
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
              
              <hr aria-hidden="true" />
              
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{M.TOTAL}</span>
                <span className="fw-bold text-primary" aria-live="polite">{resumen.total} €</span>
              </div>
            </div>
          </div>
        </aside>
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