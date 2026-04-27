
import { Link } from "react-router-dom";

export default function CuadriculaLibros({ libros, onDelete }) {
  if (libros.length === 0) return <p className="text-center text-muted mt-5">No hay libros.</p>;

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
    {libros.map((libro) => (
      <div className="col" key={libro._id}>
        <div className="card h-100 border-0 shadow-sm">
          <div
            style={{ height: "250px", overflow: "hidden" }}
            className="bg-light d-flex align-items-center justify-content-center"
          >
            {libro.portada_url ? (
              <img
                src={libro.portada_url}
                className="card-img-top h-100 w-100"
                style={{ objectFit: "cover" }}
                alt={libro.titulo}
              />
            ) : (
              <span className="text-muted">Sin imagen</span>
            )}
          </div>

          <div className="card-body p-2 text-center">
            <h6 className="card-title text-truncate small mb-3">
              {libro.titulo}
            </h6>

            <div className="d-flex justify-content-between px-2">
              <button
                className="btn btn-link text-dark text-decoration-none p-0 small"
                onClick={() =>
                  onDelete(libro._id, libro.titulo)
                }
              >
                Eliminar
              </button>

              <Link
                to={`/editar-libro/${libro._id}`}
                className="btn btn-link text-dark text-decoration-none p-0 small"
              >
                Editar
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
}