import { Link } from "react-router-dom";

function Pagina_404() {
  return (
    <div className="container text-center" style={{ marginTop: "100px" }}>
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Página no encontrada</h2>
      <p className="lead mb-5">
       La ruta a la que intentas acceder no existe .
      </p>
      {/* Este es el botón que redirige al inicio */}
      <Link to="/" className="btn btn-primary btn-lg">
        Volver a inicio
      </Link>
    </div>
  );
}

export default Pagina_404;