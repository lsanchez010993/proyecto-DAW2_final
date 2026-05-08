import formatearGenero from "./formatearGenero";
import useHome from "./useHome";
import BuscadorLibrosHome from "./BuscadorLibrosHome";
import CarruselLibros from "../../features/libros/components/CarruselLibros";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
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
    mejorValorados,
    tituloReferencia,
    generoReferencia,
    cargando,
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    buscandoBusqueda,
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

      <BuscadorLibrosHome
        valor={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
      />

      {textoBusqueda.trim() && (
        <div className="mb-5">
          <h4 className="border-bottom pb-2">
            Resultados de búsqueda ({resultadosBusqueda.length})
          </h4>
          {buscandoBusqueda ? (
            <p className="text-muted mb-0">Buscando en todo el catálogo...</p>
          ) : resultadosBusqueda.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {resultadosBusqueda.map((libro) => (
                <div className="col" key={libro._id}>
                  <TarjetaLibro libro={libro} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-0">
              No se han encontrado libros que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      )}
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

      {/* ===  MEJOR VALORADOS === */}
      {/* Si hay libros mejor valorados, los muestra en el carrusel */}
      
      {mejorValorados.length > 0 && (
      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.MEJOR_VALORADOS}</h4>
        <CarruselLibros libros={mejorValorados} />
      </div>
      )}
      {/* === TENDENCIAS DE LA SEMANA === */}
    {tendencias.length > 0 && (
      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.TENDENCIAS}</h4>
        <CarruselLibros libros={tendencias} />
      </div>
      )}
      {/* === TOP VENTAS GLOBAL === */}
    {topVentas.length > 0 && (
      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.TOP_VENTAS}</h4>
        <CarruselLibros libros={topVentas} />
      </div>
      )}
      {/* === NOVEDADES === */}
    {novedades.length > 0 && (  
      <div className="mb-5">
        <h4 className="border-bottom pb-2">{M.NOVEDADES}</h4>
        <CarruselLibros libros={novedades} />
      </div>
      )}
    </div>
  );
}

export default Home;
