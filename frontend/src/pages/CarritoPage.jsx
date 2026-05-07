import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { APP_MESSAGES } from "../constants/messages";

function CarritoPage() {
  const M = APP_MESSAGES.PAGES.CARRITO;
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  // calcular el precio total sumando (Precio x Cantidad)
  const precioTotal = carrito.reduce((acc, item) => {
    const tipo = item.tipo_compra || M.TIPO_FISICO;
    const precio = item.precio?.[tipo] || 0;
    return acc + (precio * item.cantidad);
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
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => (
              <tr key={index}>
                <td>
                    <div className="d-flex align-items-center">
                        <img src={item.portada_url} alt={item.titulo} style={{width: '50px', marginRight: '10px'}} />
                        {item.titulo}
                    </div>
                </td>
                <td className="text-capitalize">{item.tipo_compra || M.TIPO_FISICO}</td>
                <td>{(item.precio?.[item.tipo_compra || M.TIPO_FISICO] || 0).toFixed(2)} €</td>
                <td>{item.cantidad}</td>
                <td>
                  {(
                    (item.precio?.[item.tipo_compra || M.TIPO_FISICO] || 0) *
                    item.cantidad
                  ).toFixed(2)}{" "}
                  €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end align-items-center mt-4">
        <h3 className="me-4">{M.TOTAL} <span className="text-primary">{precioTotal} €</span></h3>
        <button
          className="btn btn-success btn-lg"
          onClick={() => navigate("/checkout")}
        >
          {M.FINALIZAR}
        </button>
      </div>
    </div>
  );
}

export default CarritoPage;