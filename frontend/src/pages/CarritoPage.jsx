import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function CarritoPage() {
  const { carrito, cantidadTotal } = useCarrito();

  // calcular el precio total sumando (Precio x Cantidad)
  const precioTotal = carrito.reduce((acc, item) => {
    // Si es físico usa precio.fisico
    const precio = item.precio?.fisico || 0; 
    return acc + (precio * item.cantidad);
  }, 0).toFixed(2); 

  if (carrito.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Tu carrito está vacío 😢</h3>
        <Link to="/" className="btn btn-primary mt-3">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🛒 Tu Pedido</h2>
      
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
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
                <td>{item.precio.fisico} €</td>
                <td>{item.cantidad}</td>
                <td>{(item.precio.fisico * item.cantidad).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end align-items-center mt-4">
        <h3 className="me-4">Total: <span className="text-primary">{precioTotal} €</span></h3>
        <button className="btn btn-success btn-lg" onClick={() => alert("¡Compra realizada con éxito! (Simulación)")}>
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}

export default CarritoPage;