import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useHistorialDescargas } from "./useHistorialDescargas";

function formatearFechaHora(fecha) {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function HistorialDescargasPage() {
  const { usuario } = useAuth();
  const { descargas, cargando, error } = useHistorialDescargas();

  if (!usuario) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">Historial de descargas</h2>
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
        <h2 className="mb-3 fw-bold">Historial de descargas</h2>
        <div className="alert alert-danger">
          No se pudo cargar tu historial. Inténtalo de nuevo más tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Historial de descargas</h2>
          <p className="text-muted mb-0">
            Registro de libros descargados gratuitamente.
          </p>
        </div>
        <span className="badge bg-dark">Total: {descargas.length}</span>
      </div>

      {descargas.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4 className="mb-2">Aún no hay descargas registradas.</h4>
          <p className="mb-0">
            Cuando descargues un libro gratuito, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th className="text-nowrap">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {descargas.map((d, idx) => (
                <tr key={d._id || idx}>
                  <td className="fw-semibold">
                    {d.titulo_guardado || "Título no disponible"}
                  </td>
                  <td className="text-muted text-nowrap">
                    {formatearFechaHora(d.fecha_descarga)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialDescargasPage;

