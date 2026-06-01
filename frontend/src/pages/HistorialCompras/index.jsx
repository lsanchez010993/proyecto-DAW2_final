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
      </div>

      <ul className="nav nav-pills mb-4">
        <li className="nav-item me-2">
          <button
            type="button"
            className={`btn ${pestanaActiva === "digitales" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setPestanaActiva("digitales")}
          >
            {M.TAB_DIGITALES}
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`btn ${pestanaActiva === "fisicos" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setPestanaActiva("fisicos")}
          >
            {M.TAB_FISICOS}
          </button>
        </li>
      </ul>

      {comprasMostradas.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4 className="mb-2">
            {pestanaActiva === "digitales"
              ? M.VACIO_DIGITALES_TITULO
              : M.VACIO_FISICOS_TITULO}
          </h4>
          <p className="mb-0">
            {pestanaActiva === "digitales"
              ? M.VACIO_DIGITALES_DESCRIPCION
              : M.VACIO_FISICOS_DESCRIPCION}
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-4 gy-5">
          {comprasMostradas.map((compra, idx) => (
            <div
              className="col mb-2"
              key={compra._id || `${compra.libro?._id}-${idx}`}
            >
              <div className="h-100">
                <TarjetaLibro libro={compra.libro} />
                {pestanaActiva === "digitales" ? (
                  <div className="mt-3 d-flex justify-content-between align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toast.success(M.DESCARGA_SIMULADA)}
                    >
                      {M.DESCARGAR_LIBRO}
                    </button>
                    <small className="text-muted text-nowrap">
                      {formatearFecha(compra.fecha_compra)}
                    </small>
                  </div>
                ) : (
                  <div className="mt-3 d-flex justify-content-between align-items-center gap-2">
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
                  <div className="mt-1 d-flex justify-content-start align-items-center gap-2">
                    <span className="badge bg-info text-white text-capitalize">
                      x{compra.cantidad}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialComprasPage;

