import styles from "./Editoriales.module.css";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import CarruselLibros from "../../features/libros/components/CarruselLibros";
import { APP_MESSAGES } from "../../constants/messages";

export default function ListaEditoriales({
  listaEditoriales,
  seleccionadas,
  toggleEditorial,
  librosPorEditorial,
  cargandoFilas,
  editorialesExpandidas,
  toggleExpandir
}) {
  const M = APP_MESSAGES.PAGES.EDITORIALES;
  
  return (
    <>
      <section 
        className={`shadow-sm p-4 mb-5 ${styles.tarjetaNube} animate__animated animate__fadeIn`}
        aria-label="Filtros de editoriales disponibles"
      >
        <p className="text-muted text-center mb-4">
          {M.LISTA_INTRO}
        </p>
        
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {listaEditoriales.map((ed) => (
            <button
              key={ed}
              onClick={() => toggleEditorial(ed)}
              aria-label={`Filtrar por editorial ${ed}`}
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
            <p className="text-muted m-0">{M.LISTA_VACIO_EDITORIALES}</p>
          )}
        </div>
      </section>
      
      {/* Contenedor del escaparate de resultados */}
      <div className="animate__animated animate__fadeIn">

        <h3 className="h4 mb-4 border-bottom pb-2">
          {seleccionadas.length === 0 ? M.CATALOGO_GENERAL : M.CATALOGO_SELECCIONADO}
        </h3>

        {/* COMPROBACIÓN DE ESTANTERÍAS VACÍAS */}
        {Object.entries(librosPorEditorial).length === 0 && !cargandoFilas ? (
          <div className="text-center text-muted w-100 mt-5">
         
            <span aria-hidden="true" className="d-block mb-3" style={{ fontSize: "4rem" }}>📚</span>
            <p>{M.LISTA_SIN_LIBROS}</p>
          </div>
        ) : (
          Object.entries(librosPorEditorial).map(([nombreEditorial, librosDeEditorial]) => {
            const estaExpandida = editorialesExpandidas[nombreEditorial];
            const mostrarVerMas = librosDeEditorial.length > 5;
            const librosAMostrar = estaExpandida ? librosDeEditorial : librosDeEditorial.slice(0, 5);
            
        
            const idSeccionEd = `editorial-${nombreEditorial.toLowerCase().replace(/\s+/g, "-")}`;

            return (
           
              <section 
                key={nombreEditorial} 
                className="mb-5 animate__animated animate__fadeInUp" 
                aria-labelledby={idSeccionEd}
              >
                
                {/* Encabezado de la Editorial */}
                <div className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
            
                  <h4 id={idSeccionEd} className="h5 m-0 text-uppercase" style={{ letterSpacing: "1px" }}>
                    <span className="fw-bold">{nombreEditorial}</span>
                  </h4>
                  
                  {mostrarVerMas && (
                    <button 
                      className="btn btn-sm btn-outline-dark rounded-pill px-3"
                      onClick={() => toggleExpandir(nombreEditorial)}
                      aria-expanded={estaExpandida}
                    >
                      {estaExpandida ? M.OCULTAR : M.VER_TODO}
                    </button>
                  )}
                </div>

                {/* Renderizado condicional del tipo de rejilla */}
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
      </div>
    </>
  );
}