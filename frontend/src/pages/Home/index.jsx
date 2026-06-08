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
  
    <div  className="mt-4">
      
     
      <header className="text-center mb-5 pb-3">
        <h1 className="fw-bold mb-3">{M.HERO_TITULO}</h1>
        <p className="text-muted mb-4">{M.HERO_SUBTITULO}</p>
        
       
        <div className="d-flex justify-content-end w-100">
          <BuscadorLibrosHome
            valor={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
          />
        </div>
      </header>

      {textoBusqueda.trim() && (
        <section className="mb-5" aria-labelledby="titulo-resultados">
          <h2 id="titulo-resultados" className="h4 border-bottom pb-2">
            Resultados de búsqueda ({resultadosBusqueda.length})
          </h2>
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
        </section>
      )}

      {/* === SECCIÓN PERSONALIZADA === */}
      {usuario && (
        <section className="mb-5" aria-labelledby="titulo-personalizado">
          {/* Título invisible para los lectores de pantalla que agrupa la sección */}
          <h2 id="titulo-personalizado" className="visually-hidden">Recomendaciones personalizadas</h2>
          
          {/* Al estar dentro de un h2 invisible, los carruseles pasan a ser h3 lógicamente, pero se ven como h4 */}
          {tituloReferencia && recomendadosPorLibro.length > 0 && (
            <article className="mb-5">
              <h3 className="h4 border-bottom pb-2">{`${M.PORQUE_LEISTE_PREFIJO}${tituloReferencia}${M.PORQUE_LEISTE_SUFIX}`}</h3>
              <CarruselLibros libros={recomendadosPorLibro} />
            </article>
          )}

          {generoReferencia && recomendadosPorGenero.length > 0 && (
            <article className="mb-5">
              <h3 className="h4 border-bottom pb-2">{`${M.PORQUE_TE_GUSTA} ${formatearGenero(generoReferencia)}`}</h3>
              <CarruselLibros libros={recomendadosPorGenero} />
            </article>
          )}
        </section>
      )}

      {/* === SECCIÓN GLOBAL === */}
      <section aria-labelledby="titulo-catalogo">
        <h2 id="titulo-catalogo" className="visually-hidden">Explora nuestro catálogo</h2>

        {mejorValorados.length > 0 && (
        <article className="mb-5">
          <h3 className="h4 border-bottom pb-2">{M.MEJOR_VALORADOS}</h3>
          <CarruselLibros libros={mejorValorados} />
        </article>
        )}

        {tendencias.length > 0 && (
        <article className="mb-5">
          <h3 className="h4 border-bottom pb-2">{M.TENDENCIAS}</h3>
          <CarruselLibros libros={tendencias} />
        </article>
        )}

        {topVentas.length > 0 && (
        <article className="mb-5">
          <h3 className="h4 border-bottom pb-2">{M.TOP_VENTAS}</h3>
          <CarruselLibros libros={topVentas} />
        </article>
        )}

        {novedades.length > 0 && (  
        <article className="mb-5">
          <h3 className="h4 border-bottom pb-2">{M.NOVEDADES}</h3>
          <CarruselLibros libros={novedades} />
        </article>
        )}
      </section>

    </div>
  );
}

export default Home;