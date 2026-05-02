import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import { useHistorialCompras } from "./useHistorialCompras";

function formatearFecha(fecha) {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

function HistorialComprasPage() {
  const { usuario } = useAuth();
  const { compras, cargando, error } = useHistorialCompras();

  if (!usuario) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">Historial de compras</h2>
        <div className="alert alert-warning">
          Necesitas iniciar sesión para ver tu historial.{" "}
          <Link to="/login" className="alert-link">
            Ir a iniciar sesión
          </Link>
          .
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">Historial de compras</h2>
        <div className="alert alert-danger">
          No se pudo cargar tu historial. Inténtalo de nuevo más tarde.
        </div>
      </div>
    );
  }

  const comprasValidas = (compras || []).filter((c) => c?.libro);

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Historial de compras</h2>
          <p className="text-muted mb-0">
            Aquí tienes los libros asociados a tu cuenta.
          </p>
        </div>
        <span className="badge bg-dark">
          Total: {comprasValidas.length}
        </span>
      </div>

      {comprasValidas.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4 className="mb-2">Aún no hay compras registradas.</h4>
          <p className="mb-0">Cuando compres un libro, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {comprasValidas.map((compra, idx) => (
            <div className="col" key={compra.libro?._id || idx}>
              <div className="h-100">
                <TarjetaLibro libro={compra.libro} />
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-info text-white text-capitalize">
                    {compra.tipo_compra || "digital"}
                    {compra.cantidad > 1 ? ` · x${compra.cantidad}` : ""}
                  </span>
                  <small className="text-muted">
                    {formatearFecha(compra.fecha_compra)}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialComprasPage;

