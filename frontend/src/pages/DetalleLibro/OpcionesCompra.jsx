import { useCarrito } from "../../context/CarritoContext";
import { APP_MESSAGES } from "../../constants/messages";

function OpcionesCompra({ libro, enDeseos, onToggleDeseos, onInteraccion }) {
  const M = APP_MESSAGES.PAGES.DETALLE_LIBRO;
  const { agregarAlCarrito } = useCarrito();

  return (
    <div className="card bg-light p-3 mt-4">
      <h5>{M.OPCIONES_COMPRA}</h5>
      <div className="d-flex gap-3 mt-2 align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => {
            agregarAlCarrito(libro, "fisico");
            onInteraccion("carrito");
          }}
        >
          {`${M.COMPRAR_FISICO} (${libro.precio?.fisico} €)`}
        </button>

        <button
          className="btn btn-info text-white"
          onClick={() => {
            agregarAlCarrito(libro, "digital");
            onInteraccion("carrito");
          }}
        >
          {`${M.COMPRAR_EBOOK} (${libro.precio?.digital} €)`}
        </button>

        <button
          className={`btn ${enDeseos ? "btn-danger" : "btn-outline-danger"}`}
          onClick={onToggleDeseos}
          title={M.DESEOS_TITLE}
        >
          {enDeseos ? M.DESEOS_GUARDADO : M.DESEOS_GUARDAR}
        </button>
      </div>
    </div>
  );
}

export default OpcionesCompra;