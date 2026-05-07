import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useHistorialDescargas } from "./useHistorialDescargas";
import { APP_MESSAGES } from "../../constants/messages";

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
  const M = APP_MESSAGES.PAGES.HISTORIAL_DESCARGAS;
  const { usuario } = useAuth();
  const { descargas, cargando, error } = useHistorialDescargas();

  if (!usuario) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">{M.TITULO}</h2>
        <div className="alert alert-warning">
          {`${M.LOGIN_REQUERIDO} `}
          <Link to="/login" className="alert-link">
            {M.LINK_LOGIN}
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
          <span className="visually-hidden">{M.CARGANDO}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3 fw-bold">{M.TITULO}</h2>
        <div className="alert alert-danger">
          {M.ERROR_CARGA}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">{M.TITULO}</h2>
          <p className="text-muted mb-0">
            {M.DESCRIPCION}
          </p>
        </div>
        <span className="badge bg-dark">{M.TOTAL} {descargas.length}</span>
      </div>

      {descargas.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4 className="mb-2">{M.VACIO_TITULO}</h4>
          <p className="mb-0">
            {M.VACIO_DESCRIPCION}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>{M.COLUMNA_TITULO}</th>
                <th className="text-nowrap">{M.COLUMNA_FECHA}</th>
              </tr>
            </thead>
            <tbody>
              {descargas.map((d, idx) => (
                <tr key={d._id || idx}>
                  <td className="fw-semibold">
                    {d.titulo_guardado || M.TITULO_NO_DISPONIBLE}
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

