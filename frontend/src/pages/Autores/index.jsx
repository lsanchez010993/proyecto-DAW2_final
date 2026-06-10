import { Link } from "react-router-dom";
import styles from "../Autores/Autores.module.css";
import { useAutores } from "./useAutores";
import { APP_MESSAGES } from "../../constants/messages";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
function AutoresPage() {
  const M = APP_MESSAGES.PAGES.AUTORES;

  const {
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    buscando,
    letraSeleccionada,
    setLetraSeleccionada,
    cargandoLetra,
    cargandoTodos,
    autorSeleccionado,
    setAutorSeleccionado,
    libros,
    cargandoLibros,
    autoresVisibles,
    listaActiva,
  } = useAutores();

  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (

    <div className="container-fluid px-4 mt-4">
      <div className="row">
        {/* =========================================================
            COLUMNA IZQUIERDA: <aside> 
            ========================================================= */}
        <aside className="col-md-3 mb-4 h-100" aria-labelledby="titulo-panel-busqueda">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
             
              <h2 id="titulo-panel-busqueda" className="h5 fw-bold m-0">
                {M.TITULO_PANEL}
              </h2>
            </div>

            <form role="search" className="mb-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="buscador-categorias" className="visually-hidden">
                {M.BUSCAR_PLACEHOLDER}
              </label>
              <input
                id="buscador-categorias"
                type="search"
                className="form-control rounded-pill bg-white"
                placeholder={M.BUSCAR_PLACEHOLDER}
                aria-label={M.BUSCAR_PLACEHOLDER}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </form>

            <div className={styles.listaAutores}>
              {buscando ? (
                <p className="text-center text-muted small mt-4">{M.BUSCANDO}</p>
              ) : busqueda === "" ? (
                <p className="text-center text-muted small mt-4">{M.AYUDA_BUSQUEDA}</p>
              ) : resultadosBusqueda.length === 0 ? (
                <p className="text-center text-muted small mt-4">
                  {`${M.SIN_COINCIDENCIAS_PREFIJO}${busqueda}${M.SIN_COINCIDENCIAS_SUFIX}`}
                </p>
              ) : (
                resultadosBusqueda.map((autor, index) => (
                  <div
                    key={index}
                    onClick={() => setAutorSeleccionado(autor)}
                    className={`${styles.itemAutor} ${autorSeleccionado === autor ? styles.itemAutorActivo : ""}`}
                  >
                    {autor}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* =========================================================
            COLUMNA DERECHA: Contenido Principal de la ruta
            ========================================================= */}
        <div className="col-md-9">
          {/* Secció 1: Filtrado por Abecedario */}
          <section
            className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube}`}
            aria-label="Filtrar autores por letra inicial"
          >
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button
                onClick={() => {
                  setLetraSeleccionada(null);
                  setAutorSeleccionado(null);
                }}
                className={`btn rounded-circle shadow-sm fw-bold ${
                  !letraSeleccionada && !autorSeleccionado ? "btn-primary text-white" : "btn-light"
                }`}
                style={{ width: "38px", height: "38px", padding: 0 }}
                title={M.VER_TODOS_TITLE}
              >
                ∞
              </button>

              {abecedario.map((letra) => (
                <button
                  key={letra}
                  onClick={() => {
                    setLetraSeleccionada(letra);
                    setAutorSeleccionado(null);
                  }}
                  style={{ width: "38px", height: "38px", padding: 0 }}
                  className={`btn rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold ${
                    letraSeleccionada === letra && !autorSeleccionado
                      ? "btn-dark text-white"
                      : "btn-outline-dark bg-white"
                  }`}
                >
                  {letra}
                </button>
              ))}
            </div>
          </section>

       
          <section aria-live="polite">
            {/* VISTA 1: Libros de un autor seleccionado */}
            {autorSeleccionado ? (
              <>
                <h3 className="mb-4 border-bottom pb-2">
                  {`${M.OBRAS_DE} `}
                  <span className="fw-bold">{autorSeleccionado}</span>
                </h3>

                <div className="row g-4">
                  {cargandoLibros ? (
                    <p className="text-center w-100">{M.CARGANDO_ESTANTERIA}</p>
                  ) : libros.length === 0 ? (
                    <p className="text-center w-100 text-muted">{M.SIN_LIBROS_AUTOR}</p>
                  ) : (
                    libros.map((libro) => (
                      <div key={libro._id} className="col-md-4 col-lg-3">
                        <TarjetaLibro libro={libro} />
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* VISTA 2: Lista de autores (Todos o Filtrados por letra) */
              <>
                <h3 className="mb-4 border-bottom pb-2">
                  {letraSeleccionada
                    ? `${M.AUTORES_POR_LETRA_PREFIJO}${letraSeleccionada}${M.AUTORES_POR_LETRA_SUFIX}`
                    : M.DIRECTORIO_AUTORES}
                </h3>

                <div className="row g-4">
                  {(letraSeleccionada ? cargandoLetra : cargandoTodos) ? (
                    <p className="text-center w-100 mt-5">{M.CARGANDO_DIRECTORIO}</p>
                  ) : listaActiva.length === 0 ? (
                    <p className="text-center w-100 text-muted mt-5">{M.SIN_AUTORES}</p>
                  ) : (
                    <>
                      {autoresVisibles.map((autor, index) => (
                        <div key={index} className="col-md-4 col-sm-6 animate__animated animate__fadeIn">
                          <div
                            role="button"
                            tabIndex={0}
                            className="card border-0 shadow-sm p-3 text-center h-100 d-flex justify-content-center"
                            style={{ cursor: "pointer", transition: "transform 0.2s" }}
                            onClick={() => setAutorSeleccionado(autor)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") setAutorSeleccionado(autor);
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          >
                            <h4 className="m-0 h6 fw-bold">{autor}</h4>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AutoresPage;
