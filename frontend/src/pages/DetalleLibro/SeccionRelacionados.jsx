import CarruselLibros from "../../features/libros/components/CarruselLibros";
import { APP_MESSAGES } from "../../constants/messages";

function SeccionRelacionados({ tituloSeccion, libros, onAbrirModal }) {
  const M = APP_MESSAGES.PAGES.DETALLE_LIBRO;
  return (
    <div className="mt-5 pt-4 border-top">
      <div className="d-flex gap-4 mb-4">
        <span className="text-dark fw-bold border-bottom border-dark border-2 pb-1">
          {M.RELACIONADOS_AUTOR}
        </span>
        <button
          className="btn btn-link text-decoration-none p-0 pb-1 text-primary"
          onClick={onAbrirModal}
        >
          {M.RELACIONADOS_GRATIS}
        </button>
      </div>

      <div className="bg-light p-4 rounded shadow-sm">
        <h4 className="mb-4 text-secondary">{tituloSeccion}:</h4>

        {libros.length > 0 ? (
          <CarruselLibros libros={libros} />
        ) : (
          <div className="py-4 text-center">
            <p className="text-muted mb-0">
              {M.RELACIONADOS_VACIO}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeccionRelacionados;