import { Link } from "react-router-dom";
import styles from "./Categorias.module.css";
import { useCategorias } from "./useCategorias";
import CarruselLibros from "../../features/libros/components/CarruselLibros";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import { APP_MESSAGES } from "../../constants/messages";

function CategoriasPage() {
  const M = APP_MESSAGES.PAGES.CATEGORIAS;
  const {
    listaCategoriasGlobal,
    seleccionadas,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    buscando,
    categoriasExpandidas,
    librosPorCategoria,
    cargandoFilas,
    toggleCategoria,
    toggleExpandir,
  } = useCategorias();

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row">
        
        {/* =========================================================
            COLUMNA IZQUIERDA: <aside> (Semántica de panel lateral)
            ========================================================= */}
        <aside className="col-md-3 mb-4 h-100" aria-labelledby="titulo-panel-busqueda">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            {/* Mantener jerarquía inicial de la barra lateral */}
            <h2 id="titulo-panel-busqueda" className="h5 fw-bold mb-3">
              {M.BUSCAR_TITULO}
            </h2>
            
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

            <div className={styles.listaResultados}>
              {buscando ? (
                <p className="text-center text-muted small mt-4">{M.BUSCANDO}</p>
              ) : busqueda === "" ? (
                <p className="text-center text-muted small mt-4">{M.AYUDA_BUSQUEDA}</p>
              ) : resultadosBusqueda.length === 0 ? (
                <p className="text-center text-muted small mt-4">
                  {`${M.SIN_COINCIDENCIAS_PREFIJO}${busqueda}${M.SIN_COINCIDENCIAS_SUFIX}`}
                </p>
              ) : (
                resultadosBusqueda.map((libro) => (
                  <Link key={libro._id} to={`/libro/${libro._id}`} className={styles.itemResultado}>
                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                      {libro.titulo}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {libro.autor}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* =========================================================
            COLUMNA DERECHA: Contenido y secciones de escaparate
            ========================================================= */}
        <div className="col-md-9">
          
          {/* Bloque superior: Filtros por píldora */}
          <section 
            className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube} animate__animated animate__fadeIn`}
            aria-label="Filtros de categorías disponibles"
          >
            <p className="text-muted text-center mb-4">{M.FILTRO_HINT}</p>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              {listaCategoriasGlobal.map((cat) => (
                <button
                  key={cat}
                  aria-label={`Filtrar por ${cat}`}
                  onClick={() => toggleCategoria(cat)}
                  className={`btn rounded-pill px-4 py-2 shadow-sm ${styles.botonPildora} ${
                    seleccionadas.includes(cat)
                      ? "btn-dark fw-bold animate__animated animate__pulse"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  {seleccionadas.includes(cat) && "✓ "} {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Bloque inferior: Listado de resultados principales */}
          <section aria-live="polite" aria-labelledby="titulo-seccion-catalogo">
            <h2 id="titulo-seccion-catalogo" className="h4 mb-4 border-bottom pb-2">
              {seleccionadas.length === 0 ? M.CATALOGO_GENERAL : M.RESULTADOS_ENCONTRADOS}
            </h2>

            {/* DIBUJAR LIBROS POR CATEGORÍA */}
            {Object.entries(librosPorCategoria).length === 0 && !cargandoFilas ? (
              <div className="text-center text-muted w-100 mt-5">
                {/* CORRECCIÓN: Uso de span semántico para elementos gráficos inconexos */}
                <span aria-hidden="true" className="display-1 d-block">🧭</span>
                <p className="mt-3">{M.VACIO}</p>
              </div>
            ) : (
              Object.entries(librosPorCategoria).map(([nombreCategoria, librosDeCategoria]) => {
                const estaExpandida = categoriasExpandidas[nombreCategoria];
                const mostrarVerMas = librosDeCategoria.length > 5;
                const librosAMostrar = estaExpandida ? librosDeCategoria : librosDeCategoria.slice(0, 5);
                
                // Generamos un ID único seguro para vincular el título con su sección
                const idSeccionCat = `cat-${nombreCategoria.toLowerCase().replace(/\s+/g, "-")}`;

                return (
                  // CORRECCIÓN: Cada bloque de categoría con libros es una subsección con identidad propia
                  <section key={nombreCategoria} className="mb-5 animate__animated animate__fadeInUp" aria-labelledby={idSeccionCat}>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      
                      {/* CORRECCIÓN: Ajustamos a h3 para respetar la jerarquía de títulos del documento, 
                          aplicando clase .h5 de Bootstrap para conservar el tamaño visual exacto que tenías */}
                      <h3 id={idSeccionCat} className="h5 fw-bold text-uppercase m-0" style={{ letterSpacing: "1px" }}>
                        {nombreCategoria}
                      </h3>
                      
                      {mostrarVerMas && (
                        <button
                          className="btn btn-sm btn-outline-dark rounded-pill px-3"
                          onClick={() => toggleExpandir(nombreCategoria)}
                          aria-expanded={estaExpandida}
                        >
                          {estaExpandida ? M.OCULTAR : M.VER_TODO}
                        </button>
                      )}
                    </div>

                    {estaExpandida ? (
                      <div className="row g-4 animate__animated animate__fadeIn">
                        {librosAMostrar.map((libro) => (
                          <div key={libro._id} className="col-md-4 col-lg-3">
                            <TarjetaLibro libro={libro} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <CarruselLibros libros={librosAMostrar} />
                    )}
                  </section>
                );
              })
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CategoriasPage;