import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import { APP_MESSAGES } from "../../constants/messages";
import { useFavoritos } from "./useFavoritos";

function FavoritosPage() {
  const { cargando, libros, quitarDeFavoritos } = useFavoritos();
  const M = APP_MESSAGES.PAGES.FAVORITOS;

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

  return (
    // 1. Usamos <section> con un id unívoco para declarar formalmente la región del escaparate
    <section className="container mt-4" aria-labelledby="titulo-favoritos">
      
      {/* Cabecera del escaparate */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 id="titulo-favoritos" className="h2 fw-bold mb-0">
          {M.TITULO}
        </h1>
        <div className="text-muted small" aria-live="polite">
          {libros.length} {libros.length === 1 ? M.LIBRO_SINGULAR : M.LIBRO_PLURAL}
        </div>
      </header>

      {libros.length === 0 ? (
        // Bloque informativo de estado vacío
        <div className="text-center mt-5 text-muted py-5">
          {/* CORRECCIÓN: Ajustamos a h2 respetando el orden jerárquico secuencial */}
          <h2 className="h4 fw-bold">{M.VACIO_TITULO}</h2>
          <p className="mb-0">{M.VACIO_DESCRIPCION}</p>
        </div>
      ) : (
        // Cuadrícula de resultados
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {libros.map((libro) => (
            <div className="col" key={libro._id}>
              {/* CORRECCIÓN: Agrupamos de forma semántica la tarjeta y sus controles asociados */}
              <div className="position-relative bg-light rounded-4 h-100">
                
                <TarjetaLibro libro={libro} />
                
                {/* CORRECCIÓN DE ACCESIBILIDAD: Añadimos un aria-label descriptivo dinámico 
                    para que el lector lea: "Quitar [Título del libro] de favoritos" */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger position-absolute"
                  style={{ top: 12, right: 12, zIndex: 10 }}
                  onClick={() => quitarDeFavoritos(libro._id)}
                  title={`${M.QUITAR_TITLE} ${libro.titulo}`}
                  aria-label={`${M.QUITAR_TITLE}: ${libro.titulo}`}
                >
                  {M.QUITAR_BOTON}
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritosPage;