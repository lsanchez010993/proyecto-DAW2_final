import { useState } from "react";
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
  const { usuarios, cargando, error, actualizarEstadoCompra } = useAdministrarCompras();

  // Estado para controlar qué usuarios tienen su historial de compras expandido
  const [expandidos, setExpandidos] = useState({});

  const toggleExpandir = (usuarioId) => {
    setExpandidos((prev) => ({
      ...prev,
      [usuarioId]: !prev[usuarioId],
    }));
  };

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

  // Mangengo la lógica intacta para admin y editorial
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
        <table className="table table-hover align-top mb-0 bg-white">
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
              
             
              const comprasOrdenadas = compras.slice().sort(
                (a, b) => new Date(b.fecha_compra) - new Date(a.fecha_compra)
              );

              // Lógica de colapsado (mostrar solo 3)
              const estaExpandido = expandidos[u._id];
              const comprasVisibles = estaExpandido ? comprasOrdenadas : comprasOrdenadas.slice(0, 3);
              const hayMasCompras = compras.length > 3;

              return (
                <tr key={u._id}>
                  <td className="pt-3">
                    <div className="d-flex align-items-start">
                      <div
                        className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3 mt-1"
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
                  <td className="text-nowrap pt-3">{u.email}</td>

                  <td style={{ minWidth: "520px" }} className="pt-3">
                    <div className="d-flex align-items-start gap-2">
                      <span className="badge bg-info text-white mt-1">
                        {compras.length}
                      </span>
                      <div className="flex-grow-1">
                    
                        <ul className="mb-0 ps-0 small list-unstyled">
                          {compras.length === 0 ? (
                            <li className="text-muted">{M.SIN_COMPRAS}</li>
                          ) : (
                            comprasVisibles.map((c, idx) => (
                              <li key={c._id || idx} className="mb-3 border-bottom pb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <span className="fw-semibold d-block mb-1">
                                      {c.libro?.titulo || M.LIBRO_ELIMINADO}
                                    </span>
                                    <span className="text-muted">
                                      {c.tipo_compra || M.TIPO_DEFAULT}
                                      {c.cantidad > 1 ? ` · x${c.cantidad}` : ""}
                                      {c.fecha_compra ? ` · ${formatearFecha(c.fecha_compra)}` : ""}
                                    </span>
                                  </div>

                                  {c.tipo_compra === "fisico" && (
                                    <div className="d-flex flex-column align-items-end gap-1">
                                      <span
                                        className={`${obtenerEstiloEstado(c.estado_pedido).className} text-uppercase`}
                                        style={obtenerEstiloEstado(c.estado_pedido).style}
                                      >
                                        {formatearEstado(c.estado_pedido, M)}
                                      </span>
                                      <select
                                        className="form-select form-select-sm mt-1"
                                        style={{ width: "160px" }}
                                        value={c.estado_pedido || "en_preparacion"}
                                        onChange={(e) =>
                                          actualizarEstadoCompra(u._id, c._id, e.target.value)
                                        }
                                      >
                                        <option value="en_preparacion">{M.ESTADO_PREPARACION}</option>
                                        <option value="en_envio">{M.ESTADO_ENVIO}</option>
                                        <option value="entregado">{M.ESTADO_ENTREGADO}</option>
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))
                          )}
                        </ul>

                        {/* Botón Ver más interactivo */}
                        {hayMasCompras && (
                          <button
                            className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                            onClick={() => toggleExpandir(u._id)}
                          >
                            {estaExpandido ? (
                              <>Mostrar menos <i className="bi bi-chevron-up ms-1"></i></>
                            ) : (
                              <>Ver {compras.length - 3} compras más <i className="bi bi-chevron-down ms-1"></i></>
                            )}
                          </button>
                        )}
                      </div>
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