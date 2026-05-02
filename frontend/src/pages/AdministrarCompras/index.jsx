import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdministrarCompras } from "./useAdministrarCompras";

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

function AdministrarCompras() {
  const { usuario } = useAuth();
  const { usuarios, cargando, error } = useAdministrarCompras();

  if (!usuario) {
    return (
      <div className="container mt-5">
        <h2 className="mb-3">Administrar compras</h2>
        <div className="alert alert-warning">
          Necesitas iniciar sesión.{" "}
          <Link to="/login" className="alert-link">
            Ir a iniciar sesión
          </Link>
          .
        </div>
      </div>
    );
  }

  if (usuario.rol !== "admin") {
    return (
      <div className="container mt-5">
        <h2 className="mb-3">Administrar compras</h2>
        <div className="alert alert-danger">
          No tienes permisos para acceder a esta sección.
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
      <div className="container mt-5">
        <h2 className="mb-3">Administrar compras</h2>
        <div className="alert alert-danger">
          No se pudo cargar el historial. Revisa la conexión o tus permisos.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="mb-1">Administrar compras</h2>
          <p className="text-muted mb-0">
            Listado completo.
          </p>
        </div>
        <span className="badge bg-dark">Usuarios: {usuarios.length}</span>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Compras</th>
              <th>Descargas</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const compras = u.biblioteca_digital || [];
              const descargas = u.historial_descargas_gratuitas || [];

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
                          Rol: <span className="text-capitalize">{u.rol}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-nowrap">{u.email}</td>

                  <td style={{ minWidth: "320px" }}>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className="badge bg-info text-white">
                        {compras.length}
                      </span>
                      <details className="flex-grow-1">
                        <summary className="text-primary">
                          Ver compras
                        </summary>
                        <ul className="mt-2 mb-0 ps-3 small">
                          {compras.length === 0 ? (
                            <li className="text-muted">Sin compras</li>
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
                                    {c.libro?.titulo || "Libro eliminado"}
                                  </span>{" "}
                                  <span className="text-muted">
                                    · {c.tipo_compra || "digital"}
                                    {c.cantidad > 1 ? ` · x${c.cantidad}` : ""}
                                    {c.fecha_compra
                                      ? ` · ${formatearFecha(c.fecha_compra)}`
                                      : ""}
                                  </span>
                                </li>
                              ))
                          )}
                        </ul>
                      </details>
                    </div>
                  </td>

                  <td style={{ minWidth: "320px" }}>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className="badge bg-secondary">
                        {descargas.length}
                      </span>
                      <details className="flex-grow-1">
                        <summary className="text-primary">
                          Ver descargas
                        </summary>
                        <ul className="mt-2 mb-0 ps-3 small">
                          {descargas.length === 0 ? (
                            <li className="text-muted">Sin descargas</li>
                          ) : (
                            descargas
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.fecha_descarga) -
                                  new Date(a.fecha_descarga),
                              )
                              .map((d, idx) => (
                                <li key={d._id || idx}>
                                  <span className="fw-semibold">
                                    {d.titulo_guardado || "Título no disponible"}
                                  </span>{" "}
                                  <span className="text-muted">
                                    {d.fecha_descarga
                                      ? `· ${formatearFecha(d.fecha_descarga)}`
                                      : ""}
                                  </span>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdministrarCompras;

