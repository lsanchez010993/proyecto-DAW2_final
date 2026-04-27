import formatearGenero from "./formatearGenero";
import useHome from "./useHome";
import CarruselLibros from "../../components/CarruselLibros";

function Home() {
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
        <p className="mt-3 text-muted">Cargando tu escaparate personalizado...</p>
      </div>
    );
  }
  return (
    
    <div className="mt-4">
      <div className="text-center mb-5 pb-3">
        <h1 className="fw-bold mb-3">Descubre tu próxima aventura</h1>
        <p className="text-muted">Explora los libros que están cautivando a miles de lectores.</p>
      </div>
      {/* === SECCIÓN PERSONALIZADA === */}
      {usuario && (
        <div className="mb-5">
          {/* Lógica por Libro */}
          {tituloReferencia && recomendadosPorLibro.length > 0 && (
            <div className="mb-5">
              <h4 className="border-bottom pb-2">Porque leíste "{tituloReferencia}"</h4>
              <CarruselLibros libros={recomendadosPorLibro} />
            </div>
          )}

          {/* Lógica por Género */}
          {generoReferencia && recomendadosPorGenero.length > 0 && (
            <div className="mb-5">
              <h4 className="border-bottom pb-2">Porque te gusta {formatearGenero(generoReferencia)}</h4>
              <CarruselLibros libros={recomendadosPorGenero} />
            </div>
          )}
        </div>
      )}

      {/* === SECCIÓN GLOBAL */}

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Tendencias de la Semana</h4>
        <CarruselLibros libros={tendencias} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Top Ventas Global</h4>
        <CarruselLibros libros={topVentas} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Novedades</h4>
        <CarruselLibros libros={novedades} />
      </div>
    </div>
  );
}

export default Home;
