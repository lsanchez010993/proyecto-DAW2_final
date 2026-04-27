import { Link } from "react-router-dom";
import styles from "./Categorias.module.css";
import { useCategorias } from "./useCategorias";
import CarruselLibros from "../../components/CarruselLibros";
import TarjetaLibro from "../../components/TarjetaLibro";

function CategoriasPage() {
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
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador
            ========================================= */}
        <div className="col-md-3 mb-4 h-100">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <h5 className="fw-bold mb-3">Buscar Libro</h5>

            <div className="mb-3">
              <input
                type="text"
                className="form-control rounded-pill bg-white"
                placeholder="🔍 Título del libro..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className={styles.listaResultados}>
              {buscando ? (
                <p className="text-center text-muted small mt-4">Buscando...</p>
              ) : busqueda === "" ? (
                <p className="text-center text-muted small mt-4">Encuentra un libro específico por su título.</p>
              ) : resultadosBusqueda.length === 0 ? (
                <p className="text-center text-muted small mt-4">No hay libros que coincidan con "{busqueda}".</p>
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
        </div>

        {/* =========================================
            COLUMNA DERECHA: Escaparate estilo netflix
            ========================================= */}
        <div className="col-md-9">
          <div className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube} animate__animated animate__fadeIn`}>
            <p className="text-muted text-center mb-4">Filtra por tus géneros favoritos</p>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              {listaCategoriasGlobal.map((cat) => (
                <button
                  key={cat}
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
          </div>

          <div>
            <h4 className="mb-4 border-bottom pb-2">
              {seleccionadas.length === 0 ? `Catálogo General:` : `Resultados Encontrados:`}
            </h4>

            {/* DIBUJAR ESTANTERÍAS DESCARGADAS */}
            {Object.entries(librosPorCategoria).length === 0 && !cargandoFilas ? (
              <div className={`text-center text-muted w-100 mt-5`}>
                <h1 style={{ fontSize: "4rem" }}>🧭</h1>
                <p className="mt-3">Aún no hay libros en estas categorías.</p>
              </div>
            ) : (
              Object.entries(librosPorCategoria).map(([nombreCategoria, librosDeCategoria]) => {
                const estaExpandida = categoriasExpandidas[nombreCategoria];
                const mostrarVerMas = librosDeCategoria.length > 5;
                const librosAMostrar = estaExpandida ? librosDeCategoria : librosDeCategoria.slice(0, 5);

                return (
                  <div key={nombreCategoria} className="mb-5 animate__animated animate__fadeInUp">
                    <h5 className="mb-3 d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                        {nombreCategoria}
                      </span>
                      {mostrarVerMas && (
                        <button
                          className="btn btn-sm btn-outline-dark rounded-pill px-3"
                          onClick={() => toggleExpandir(nombreCategoria)}
                        >
                          {estaExpandida ? "Ocultar" : "Ver todo"}
                        </button>
                      )}
                    </h5>

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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriasPage;
