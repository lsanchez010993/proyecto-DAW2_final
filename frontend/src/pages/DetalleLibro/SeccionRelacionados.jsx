import CarruselLibros from "../../features/libros/components/CarruselLibros";

function SeccionRelacionados({ tituloSeccion, libros, onAbrirModal }) {
  return (
    <div className="mt-5 pt-4 border-top">
      <div className="d-flex gap-4 mb-4">
        <span className="text-dark fw-bold border-bottom border-dark border-2 pb-1">
          Más del autor
        </span>
        <button
          className="btn btn-link text-decoration-none p-0 pb-1 text-primary"
          onClick={onAbrirModal}
        >
          Contenido gratuito relacionado
        </button>
      </div>

      <div className="bg-light p-4 rounded shadow-sm">
        <h4 className="mb-4 text-secondary">{tituloSeccion}:</h4>

        {libros.length > 0 ? (
          <CarruselLibros libros={libros} />
        ) : (
          <div className="py-4 text-center">
            <p className="text-muted mb-0">
              No hay más obras de este autor en el catálogo por el momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeccionRelacionados;