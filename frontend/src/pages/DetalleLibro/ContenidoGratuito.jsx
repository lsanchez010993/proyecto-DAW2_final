import { useState, useEffect } from "react";
import axios from "axios";
import { APP_MESSAGES } from "../../constants/messages";

function ContenidoGratuito({ categoria, onClose, onDescarga }) {
  const [idiomaModal, setIdiomaModal] = useState("es");
  const [librosGutendexES, setLibrosGutendexES] = useState([]);
  const [librosGutendexEN, setLibrosGutendexEN] = useState([]);
  const [cargandoGutendex, setCargandoGutendex] = useState(false);

  useEffect(() => {
    cargarLibrosGutendex("es");
  
  }, []);

  async function cargarLibrosGutendex(idiomaDeseado) {
    setIdiomaModal(idiomaDeseado);

    // Caché local
    if (idiomaDeseado === "es" && librosGutendexES.length > 0) return;
    if (idiomaDeseado === "en" && librosGutendexEN.length > 0) return;

    setCargandoGutendex(true);

    const categoriaBuscar = categoria || "Literatura";

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      const res = await axios.get(
        `${URL}/api/gutendex/libros-gratuitos?categoria=${encodeURIComponent(categoriaBuscar)}&idioma=${idiomaDeseado}`
      );

      if (idiomaDeseado === "es") {
        setLibrosGutendexES(Array.isArray(res.data) ? res.data : []);
      } else {
        setLibrosGutendexEN(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.LOAD_DB_BOOKS, error);
    } finally {
      setCargandoGutendex(false);
    }
  }

  const librosAMostrar = idiomaModal === "es" ? librosGutendexES : librosGutendexEN;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow">
          <div className="modal-header bg-light d-flex align-items-center justify-content-between">
            <h5 className="modal-title fw-bold mb-0">
              Obras gratuitas: {categoria || "Literatura"}
            </h5>

            <div className="d-flex align-items-center gap-3">
              <div className="btn-group shadow-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${idiomaModal === "es" ? "btn-primary" : "btn-outline-secondary bg-white"}`}
                  onClick={() => cargarLibrosGutendex("es")}
                >
                  🇪🇸 Español
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${idiomaModal === "en" ? "btn-primary" : "btn-outline-secondary bg-white"}`}
                  onClick={() => cargarLibrosGutendex("en")}
                >
                  🇬🇧 Inglés
                </button>
              </div>

              <button
                type="button"
                className="btn-close m-0"
                onClick={onClose}
              ></button>
            </div>
          </div>

          <div className="modal-body p-4" style={{ minHeight: "300px" }}>
            {cargandoGutendex ? (
              <div className="text-center text-muted my-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                ></div>
                <p className="lead">
                  Explorando estanterías en {idiomaModal === "es" ? "español" : "inglés"}...
                </p>
              </div>
            ) : librosAMostrar.length > 0 ? (
              <div className="row g-4">
                {librosAMostrar.map((libroGuten) => (
                  <div key={libroGuten._id} className="col-md-3">
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={libroGuten.portada_url || "https://via.placeholder.com/150"}
                        className="card-img-top"
                        alt={libroGuten.titulo}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6
                          className="fw-bold mb-1 text-truncate"
                          title={libroGuten.titulo}
                        >
                          {libroGuten.titulo}
                        </h6>
                        <p className="small text-muted mb-3">
                          {libroGuten.autor}
                        </p>

                        <div className="mt-auto">
                          <a
                            href={libroGuten.enlace_descarga}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary w-100 rounded-pill fw-bold"
                            onClick={() => onDescarga?.(libroGuten)}
                          >
                            ⬇️ Descargar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted my-5">
                <p className="lead">
                  No hay clásicos de {categoria || "Literatura"} disponibles en{" "}
                  {idiomaModal === "es" ? "español" : "inglés"}.
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContenidoGratuito;