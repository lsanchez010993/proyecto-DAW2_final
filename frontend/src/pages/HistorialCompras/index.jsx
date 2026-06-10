import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
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

function formatearEstado(estado, M) {
  if (estado === "entregado") return M.ESTADO_ENTREGADO;
  if (estado === "en_envio") return M.ESTADO_ENVIO;
  return M.ESTADO_PREPARACION;
}

function obtenerEstiloEstado(estado) {
  if (estado === "entregado") {
    return { className: "badge bg-success text-white" };
  }
  if (estado === "en_envio") {
    return { className: "badge text-dark", style: { backgroundColor: "#fd7e14" } };
  }
  return { className: "badge bg-warning-subtle text-dark" };
}

function HistorialComprasPage() {
  const M = APP_MESSAGES.PAGES.HISTORIAL_COMPRAS;
  const { usuario } = useAuth();
  const { compras, cargando, error } = useHistorialCompras();
  const [pestanaActiva, setPestanaActiva] = useState("digitales");
  
  const comprasValidas = useMemo(
    () => (compras || []).filter((c) => c?.libro),
    [compras],
  );
  const comprasDigitales = useMemo(
    () => comprasValidas.filter((c) => c.tipo_compra === "digital"),
    [comprasValidas],
  );
  const comprasFisicas = useMemo(
    () => comprasValidas.filter((c) => c.tipo_compra === "fisico"),
    [comprasValidas],
  );
  const comprasMostradas =
    pestanaActiva === "digitales" ? comprasDigitales : comprasFisicas;

  if (!usuario) {
    return (
      <div className="container mt-4">
        <h1 className="h2 mb-3 fw-bold">{M.TITULO}</h1>
        <div className="alert alert-warning" role="alert">
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
        <h1 className="h2 mb-3 fw-bold">{M.TITULO}</h1>
        <div className="alert alert-danger" role="alert">
          {M.ERROR_CARGA}
        </div>
      </div>
    );
  }

  return (

    <section className="container mt-4" aria-labelledby="titulo-historial">
      
      {/* Cabecera semántica de la página */}
      <header className="mb-4">
        <h1 id="titulo-historial" className="h2 fw-bold mb-1">{M.TITULO}</h1>
        <p className="text-muted mb-0">{M.DESCRIPCION}</p>
      </header>


      <nav aria-label="Tipos de formato de compra" className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item me-2">
            <button
              type="button"
              className={`btn ${pestanaActiva === "digitales" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setPestanaActiva("digitales")}
              aria-current={pestanaActiva === "digitales" ? "page" : undefined}
            >
              {M.TAB_DIGITALES}
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`btn ${pestanaActiva === "fisicos" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setPestanaActiva("fisicos")}
              aria-current={pestanaActiva === "fisicos" ? "page" : undefined}
            >
              {M.TAB_FISICOS}
            </button>
          </li>
        </ul>
      </nav>

      {comprasMostradas.length === 0 ? (
        // Estado vacío corregido secuencialmente a h2
        <div className="text-center mt-5 text-muted py-5">
          <h2 className="h4 mb-2">
            {pestanaActiva === "digitales"
              ? M.VACIO_DIGITALES_TITULO
              : M.VACIO_FISICOS_TITULO}
          </h2>
          <p className="mb-0">
            {pestanaActiva === "digitales"
              ? M.VACIO_DIGITALES_DESCRIPCION
              : M.VACIO_FISICOS_DESCRIPCION}
          </p>
        </div>
      ) : (
        // Cuadrícula de resultados principales
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-4 gy-5" aria-live="polite">
          {comprasMostradas.map((compra, idx) => (
            <div
              className="col"
              key={compra._id || `${compra.libro?._id}-${idx}`}
            >
   
              <div className="card border-0 bg-transparent h-100">
                
                <TarjetaLibro libro={compra.libro} />
                
     
                <footer className="mt-auto pt-3">
                  {pestanaActiva === "digitales" ? (
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => toast.success(M.DESCARGA_SIMULADA)}
                        aria-label={`${M.DESCARGAR_LIBRO}: ${compra.libro?.titulo || ""}`}
                      >
                        {M.DESCARGAR_LIBRO}
                      </button>
                      <small className="text-muted text-nowrap">
                        {formatearFecha(compra.fecha_compra)}
                      </small>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <span
                        className={obtenerEstiloEstado(compra.estado_pedido).className}
                        style={obtenerEstiloEstado(compra.estado_pedido).style}
                      >
                        {M.ESTADO_LABEL}: {formatearEstado(compra.estado_pedido, M)}
                      </span>
                      <small className="text-muted text-nowrap">
                        {formatearFecha(compra.fecha_compra)}
                      </small>
                    </div>
                  )}
                  
                  {pestanaActiva !== "digitales" && compra.cantidad > 1 && (
                    <div className="mt-2 d-flex justify-content-start align-items-center">
                      <span className="badge bg-info text-white">
                        {M.CANTIDAD_LABEL || "Cantidad:"} x{compra.cantidad}
                      </span>
                    </div>
                  )}
                </footer>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistorialComprasPage;