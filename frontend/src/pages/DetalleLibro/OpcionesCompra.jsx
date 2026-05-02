import { useCarrito } from "../../context/CarritoContext";

function OpcionesCompra({ libro, enDeseos, onToggleDeseos, onInteraccion }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <div className="card bg-light p-3 mt-4">
      <h5>Opciones de Compra:</h5>
      <div className="d-flex gap-3 mt-2 align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => {
            agregarAlCarrito(libro, "fisico");
            onInteraccion("carrito");
          }}
        >
          Comprar Físico ({libro.precio?.fisico} €)
        </button>

        <button
          className="btn btn-info text-white"
          onClick={() => {
            agregarAlCarrito(libro, "digital");
            onInteraccion("carrito");
          }}
        >
          Comprar Ebook ({libro.precio?.digital} €)
        </button>

        <button
          className={`btn ${enDeseos ? "btn-danger" : "btn-outline-danger"}`}
          onClick={onToggleDeseos}
          title="Añadir a lista de deseos"
        >
          {enDeseos ? "❤️ Guardado" : "🤍 Guardar"}
        </button>
      </div>
    </div>
  );
}

export default OpcionesCompra;