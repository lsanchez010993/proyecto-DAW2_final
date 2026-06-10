import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { APP_MESSAGES } from "../constants/messages";

function CarritoPage() {
  const M = APP_MESSAGES.PAGES.CARRITO;
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const obtenerPrecioUnitario = (item) => {
    const tipo = item.tipo_compra || M.TIPO_FISICO;
    const precio = Number(item.precio?.[tipo] ?? 0);
    return Number.isFinite(precio) ? precio : 0;
  };

  // Calcular el precio total sumando (precio x cantidad)
  const precioTotal = carrito.reduce((acc, item) => {
    const precio = obtenerPrecioUnitario(item);
    return acc + precio * item.cantidad;
  }, 0).toFixed(2);

  if (carrito.length === 0) {
    return (
      <main className="container mt-5 text-center py-5" aria-labelledby="titulo-carrito-vacio">
        <h1 id="titulo-carrito-vacio" className="h3 mb-4 fw-bold">{M.VACIO_TITULO}</h1>
        <Link to="/" className="btn btn-primary mt-3 px-4">{M.VACIO_BOTON}</Link>
      </main>
    );
  }

  return (
    <main className="container mt-5" aria-labelledby="titulo-carrito">
      <header>
        <h1 id="titulo-carrito" className="h2 mb-4 fw-bold">{M.TITULO}</h1>
      </header>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle" aria-label="Productos en tu carrito">
          <thead className="table-light">
            <tr>
              <th scope="col">{M.COLUMNA_PRODUCTO}</th>
              <th scope="col">{M.COLUMNA_TIPO}</th>
              <th scope="col">{M.COLUMNA_PRECIO}</th>
              <th scope="col" className="text-center">{M.COLUMNA_CANTIDAD}</th>
              <th scope="col">{M.COLUMNA_SUBTOTAL}</th>
              <th scope="col" className="text-center">{M.COLUMNA_ACCIONES}</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            {carrito.map((item) => {
              const tipo = item.tipo_compra || M.TIPO_FISICO;
              const precioUnitario = obtenerPrecioUnitario(item);
              return (
                <tr key={`${item._id}-${tipo}`}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.portada_url}
                        alt={`Portada de ${item.titulo}`}
                        style={{ width: "50px", marginRight: "10px" }}
                        className="rounded shadow-sm"
                      />
                      <span className="fw-semibold">{item.titulo}</span>
                    </div>
                  </td>
                  <td className="text-capitalize">{tipo}</td>
                  <td>{precioUnitario.toFixed(2)} €</td>
                  <td className="text-center">
                    <div className="d-inline-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => cambiarCantidad(item._id, tipo, -1)}
                        aria-label={`${M.RESTAR_UNIDAD} ${item.titulo}`}
                      >
                        -
                      </button>
                      <span className="fw-bold" aria-live="polite">{item.cantidad}</span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => cambiarCantidad(item._id, tipo, 1)}
                        aria-label={`${M.SUMAR_UNIDAD} ${item.titulo}`}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="fw-semibold">{(precioUnitario * item.cantidad).toFixed(2)} €</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminarDelCarrito(item._id, tipo)}
                      aria-label={`${M.ELIMINAR} ${item.titulo} en formato ${tipo}`}
                      title={`${M.ELIMINAR} ${item.titulo}`}
                    >
                      {M.ELIMINAR}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-3 border-top pt-4 mb-5">
        <button 
          type="button" 
          className="btn btn-outline-danger" 
          onClick={vaciarCarrito}
          aria-label="Vaciar todo el carrito de compras"
        >
          {M.VACIAR}
        </button>

        <div className="d-flex align-items-center gap-4">
          <h2 className="h4 mb-0 fw-bold">
            {M.TOTAL} <span className="text-primary">{precioTotal} €</span>
          </h2>
          <button
            type="button"
            className="btn btn-success btn-lg px-4 fw-bold shadow-sm"
            onClick={() => navigate("/checkout")}
          >
            {M.FINALIZAR}
          </button>
        </div>
      </footer>
    </main>
  );
}

export default CarritoPage;