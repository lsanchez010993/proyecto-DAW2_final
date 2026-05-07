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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">{M.TITULO}</h2>
        <div className="text-muted small">
          {libros.length} {libros.length === 1 ? M.LIBRO_SINGULAR : M.LIBRO_PLURAL}
        </div>
      </div>

      {libros.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h4>{M.VACIO_TITULO}</h4>
          <p className="mb-0">{M.VACIO_DESCRIPCION}</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {libros.map((libro) => (
            <div className="col" key={libro._id}>
              <div className="position-relative">
                <TarjetaLibro libro={libro} />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger position-absolute"
                  style={{ top: 12, right: 12 }}
                  onClick={() => quitarDeFavoritos(libro._id)}
                  title={M.QUITAR_TITLE}
                >
                  {M.QUITAR_BOTON}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritosPage;

