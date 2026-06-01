import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdministrarCompras } from "./useAdministrarCompras";
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

function AdministrarCompras() {
  const M = APP_MESSAGES.PAGES.ADMIN_COMPRAS;
  const { usuario } = useAuth();
  const { usuarios, cargando, error, actualizarEstadoCompra } =
    useAdministrarCompras();

  if (!usuario) {
    return (
      <div className="container mt-5">
        <h2 className="mb-3">{M.TITULO}</h2>
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

  if (usuario.rol !== "admin" && usuario.rol !== "editorial") {
    return (
      <div className="container mt-5">
        <h2 className="mb-3">{M.TITULO}</h2>
        <div className="alert alert-danger">{M.SIN_PERMISOS}</div>
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
      <div className="container mt-5">
        <h2 className="mb-3">{M.TITULO}</h2>
        <div className="alert alert-danger">{M.ERROR_CARGA}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1">{M.TITULO}</h2>
          <p className="text-muted mb-0">{M.SUBTITULO}</p>
        </div>
        <span className="badge bg-dark">
          {M.USUARIOS} {usuarios.length}
        </span>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>{M.COLUMNA_USUARIO}</th>
              <th>{M.COLUMNA_EMAIL}</th>
              <th>{M.COLUMNA_COMPRAS}</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const compras = u.biblioteca_digital || [];

              return (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "1.2rem",
                        }}
                      >
                        {(u.nombre || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="fw-bold mb-1">{u.nombre}</p>
                        <p className="text-muted mb-0 small">
                          {M.ROL_LABEL}{" "}
                          <span className="text-capitalize">{u.rol}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-nowrap">{u.email}</td>

                  <td style={{ minWidth: "520px" }}>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className="badge bg-info text-white">
                        {compras.length}
                      </span>
                      <details className="flex-grow-1">
                        <summary className="text-primary">{M.VER_COMPRAS}</summary>
                        <ul className="mt-2 mb-0 ps-3 small">
                          {compras.length === 0 ? (
                            <li className="text-muted">{M.SIN_COMPRAS}</li>
                          ) : (
                            compras
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.fecha_compra) -
                                  new Date(a.fecha_compra),
                              )
                              .map((c, idx) => (
                                <li key={c._id || idx}>
                                  <span className="fw-semibold">
                                    {c.libro?.titulo || M.LIBRO_ELIMINADO}
                                  </span>{" "}
                                  <span className="text-muted">
                                    · {c.tipo_compra || M.TIPO_DEFAULT}
                                    {c.cantidad > 1 ? ` · x${c.cantidad}` : ""}
                                    {c.fecha_compra
                                      ? ` · ${formatearFecha(c.fecha_compra)}`
                                      : ""}
                                  </span>
                                  <div className="mt-2 d-flex flex-wrap align-items-center gap-2">
                                    {c.tipo_compra === "fisico" && (
                                      <>
                                        <span
                                          className={`${obtenerEstiloEstado(c.estado_pedido).className} text-uppercase`}
                                          style={obtenerEstiloEstado(c.estado_pedido).style}
                                        >
                                          {formatearEstado(c.estado_pedido, M)}
                                        </span>
                                        <select
                                          className="form-select form-select-sm"
                                          style={{ width: "190px" }}
                                          value={c.estado_pedido || "en_preparacion"}
                                          onChange={(e) =>
                                            actualizarEstadoCompra(
                                              u._id,
                                              c._id,
                                              e.target.value,
                                            )
                                          }
                                        >
                                          <option value="en_preparacion">
                                            {M.ESTADO_PREPARACION}
                                          </option>
                                          <option value="en_envio">
                                            {M.ESTADO_ENVIO}
                                          </option>
                                          <option value="entregado">
                                            {M.ESTADO_ENTREGADO}
                                          </option>
                                        </select>
                                      </>
                                    )}
                                  </div>
                                </li>
                              ))
                          )}
                        </ul>
                      </details>
                    </div>
                  </td>
                </tr>
              );
            })}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  {M.SIN_COMPRAS}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdministrarCompras;
