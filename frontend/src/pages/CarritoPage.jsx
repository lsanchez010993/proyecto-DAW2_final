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
      <div className="container mt-5 text-center">
        <h3>{M.VACIO_TITULO}</h3>
        <Link to="/" className="btn btn-primary mt-3">{M.VACIO_BOTON}</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{M.TITULO}</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>{M.COLUMNA_PRODUCTO}</th>
              <th>{M.COLUMNA_TIPO}</th>
              <th>{M.COLUMNA_PRECIO}</th>
              <th>{M.COLUMNA_CANTIDAD}</th>
              <th>{M.COLUMNA_SUBTOTAL}</th>
              <th>{M.COLUMNA_ACCIONES}</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const tipo = item.tipo_compra || M.TIPO_FISICO;
              const precioUnitario = obtenerPrecioUnitario(item);
              return (
              <tr key={`${item._id}-${tipo}`}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.portada_url}
                      alt={item.titulo}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    {item.titulo}
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
                    <span className="fw-semibold">{item.cantidad}</span>
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
                <td>{(precioUnitario * item.cantidad).toFixed(2)} €</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarDelCarrito(item._id, tipo)}
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

      <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-2">
        <button type="button" className="btn btn-outline-danger" onClick={vaciarCarrito}>
          {M.VACIAR}
        </button>

        <div className="d-flex align-items-center gap-3">
          <h3 className="mb-0">
            {M.TOTAL} <span className="text-primary">{precioTotal} €</span>
          </h3>
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate("/checkout")}
          >
            {M.FINALIZAR}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;