import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import { useHistorialCompras } from "./useHistorialCompras";
import { APP_MESSAGES } from "../../constants/messages";

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
  const M = APP_MESSAGES.PAGES.HISTORIAL_COMPRAS;
  const { usuario } = useAuth();
  const { compras, cargando, error } = useHistorialCompras();

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

  const comprasValidas = (compras || []).filter((c) => c?.libro);

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">{M.TITULO}</h2>
          <p className="text-muted mb-0">
            {M.DESCRIPCION}
          </p>
        </div>
        <span className="badge bg-dark">
          {M.TOTAL} {comprasValidas.length}
        </span>
      </div>

      {comprasValidas.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4 className="mb-2">{M.VACIO_TITULO}</h4>
          <p className="mb-0">{M.VACIO_DESCRIPCION}</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {comprasValidas.map((compra, idx) => (
            <div className="col" key={compra.libro?._id || idx}>
              <div className="h-100">
                <TarjetaLibro libro={compra.libro} />
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-info text-white text-capitalize">
                    {compra.tipo_compra || M.TIPO_DEFAULT}
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

