import { Link } from "react-router-dom";
import { useState } from "react";

import { useProcesamientoPago } from "./useProcesamientoPago";
import ModalConfirmacion from "../../components/ModalConfirmacion";

function CheckoutSimulacionPage() {
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
        <h2 className="mb-3 fw-bold">Simulación de compra</h2>
        <div className="alert alert-warning">
          Necesitas iniciar sesión para comprar.{" "}
          <Link to="/login" className="alert-link">
            Ir a iniciar sesión
          </Link>
          .
        </div>
      </div>
    );
  }

  if (carritoVacio) {
    return (
      <div className="container mt-4 text-center">
        <h2 className="mb-3 fw-bold">Simulación de compra</h2>
        <div className="text-muted mb-3">No hay productos en el carrito.</div>
        <Link to="/" className="btn btn-primary">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Simulación de compra</h2>
          <p className="text-muted mb-0">
            Al confirmar, se registra la compra.
          </p>
        </div>
        <Link to="/carrito" className="btn btn-outline-dark">
          Volver al carrito
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Datos de pago </h5>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!enviando) setModalAbierto(true);
                }}
              >
                <div className="mb-3">
                  <label className="form-label">Tarjeta de crédito</label>
                  <input
                    className="form-control"
                    value={tarjeta}
                    onChange={(e) => setTarjeta(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="off"
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Fecha de vencimiento</label>
                    <input
                      className="form-control"
                      value={vencimiento}
                      onChange={(e) => setVencimiento(e.target.value)}
                      placeholder="MM/AA"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Número secreto</label>
                    <input
                      className="form-control"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="CVV"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Titular</label>
                  <input
                    className="form-control"
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                    placeholder="Nombre y apellidos"
                    autoComplete="off"
                  />
                </div>

                <button
                  className="btn btn-success btn-lg w-100"
                  type="submit"
                  disabled={enviando}
                >
                  {enviando ? "Registrando compra..." : "Realizar compra"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Resumen</h5>
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
                <span className="fw-bold">Total</span>
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
        titulo="Finalizar compra"
        mensaje="¿Deseas finalizar la compra?"
        textoConfirmar="Finalizar"
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
