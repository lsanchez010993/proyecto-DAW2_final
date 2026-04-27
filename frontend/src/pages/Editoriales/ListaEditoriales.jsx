import styles from "./Editoriales.module.css";
import TarjetaLibro from "../../components/TarjetaLibro";
import CarruselLibros from "../../components/CarruselLibros";

export default function ListaEditoriales({
  listaEditoriales,
  seleccionadas,
  toggleEditorial,
  librosPorEditorial,
  cargandoFilas,
  editorialesExpandidas,
  toggleExpandir
}) {
  return (
    <>
      <div className={`shadow-sm p-4 mb-5 ${styles.tarjetaNube} animate__animated animate__fadeIn`}>
        <p className="text-muted text-center mb-4">
          Selecciona una o varias editoriales para explorar su catálogo de libros.
        </p>
        
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {listaEditoriales.map((ed) => (
            <button
              key={ed}
              onClick={() => toggleEditorial(ed)}
              className={`btn rounded-pill px-4 py-2 shadow-sm ${styles.botonPildora} ${
                seleccionadas.includes(ed)
                  ? "btn-dark fw-bold animate__animated animate__pulse"
                  : "btn-outline-secondary bg-white"
              }`}
            >
              {seleccionadas.includes(ed) && "✓ "} {ed}
            </button>
          ))}
          {listaEditoriales.length === 0 && (
            <p className="text-muted m-0">No hay editoriales registradas todavía.</p>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="mb-4 border-bottom pb-2">
          {seleccionadas.length === 0 ? `Catálogo General:` : `Catálogo Seleccionado:`}
        </h4>

        {/* DIBUJAR ESTANTERÍAS DESCARGADAS */}
        {Object.entries(librosPorEditorial).length === 0 && !cargandoFilas ? (
          <div className={`text-center text-muted w-100 mt-5`}>
            <h1 style={{ fontSize: "4rem" }}>📚</h1>
            <p className="mt-3">No hay libros disponibles para esta selección actualmente.</p>
          </div>
        ) : (
          Object.entries(librosPorEditorial).map(([nombreEditorial, librosDeEditorial]) => {
            const estaExpandida = editorialesExpandidas[nombreEditorial];
            const mostrarVerMas = librosDeEditorial.length > 5;
            const librosAMostrar = estaExpandida ? librosDeEditorial : librosDeEditorial.slice(0, 5);

            return (
              <div key={nombreEditorial} className="mb-5 animate__animated animate__fadeInUp">
                
                {/* Encabezado de la Editorial */}
                <h4 className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                    {nombreEditorial}
                  </span>
                  {mostrarVerMas && (
                    <button 
                      className="btn btn-sm btn-outline-dark rounded-pill px-3"
                      onClick={() => toggleExpandir(nombreEditorial)}
                    >
                      {estaExpandida ? "Ocultar" : "Ver todo"}
                    </button>
                  )}
                </h4>

                {estaExpandida ? (
                  <div className="row g-4 animate__animated animate__fadeIn">
                    {librosAMostrar.map((libro) => (
                      <div key={libro._id} className="col-md-4 col-lg-3">
                        <TarjetaLibro libro={libro} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.carruselHorizontal}>
                    {librosAMostrar.map((libro) => (
                      <div key={libro._id} className={styles.itemCarrusel}>
                        <TarjetaLibro libro={libro} />
                      </div>
                    ))}
                    
                    <CarruselLibros libros={librosAMostrar} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
