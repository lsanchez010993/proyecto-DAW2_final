import formatearGenero from "./formatearGenero";
import useHome from "./useHome";
import CarruselLibros from "../../features/libros/components/CarruselLibros";
import { APP_MESSAGES } from "../../constants/messages";

function Home() {
  const M = APP_MESSAGES.PAGES.HOME;
  const {
    usuario,
    novedades,
    topVentas,
    tendencias,
    recomendadosPorLibro,
    recomendadosPorGenero,
    tituloReferencia,
    generoReferencia,
    cargando,
  } = useHome();
  if (cargando) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">{M.CARGANDO_ESCAPARATE}</p>
      </div>
    );
  }
  return (
    
    <div className="mt-4">
      <div className="text-center mb-5 pb-3">
        <h1 className="fw-bold mb-3">{M.HERO_TITULO}</h1>
        <p className="text-muted">{M.HERO_SUBTITULO}</p>
      </div>
      {/* === SECCIÓN PERSONALIZADA === */}
      {usuario && (
        <div className="mb-5">
          {/* Lógica por Libro */}
          {tituloReferencia && recomendadosPorLibro.length > 0 && (
            <div className="mb-5">
              <h4 className="border-bottom pb-2">{`${M.PORQUE_LEISTE_PREFIJO}${tituloReferencia}${M.PORQUE_LEISTE_SUFIX}`}</h4>
              <CarruselLibros libros={recomendadosPorLibro} />
            </div>
          )}

          {/* Lógica por Género */}
          {generoReferencia && recomendadosPorGenero.length > 0 && (
            <div className="mb-5">
              <h4 className="border-bottom pb-2">{`${M.PORQUE_TE_GUSTA} ${formatearGenero(generoReferencia)}`}</h4>
              <CarruselLibros libros={recomendadosPorGenero} />
            </div>
          )}
        </div>
      )}

      {/* === SECCIÓN GLOBAL */}

      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.TENDENCIAS}</h4>
        <CarruselLibros libros={tendencias} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.TOP_VENTAS}</h4>
        <CarruselLibros libros={topVentas} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.NOVEDADES}</h4>
        <CarruselLibros libros={novedades} />
      </div>
    </div>
  );
}

export default Home;
