import { Link } from "react-router-dom";
import styles from "../Autores/Autores.module.css";
import { useAutores } from "./useAutores";


function AutoresPage() {

    const {
      busqueda,
      setBusqueda,
      resultadosBusqueda,
      buscando,
      letraSeleccionada,
      setLetraSeleccionada,
      cargandoLetra,
      cargandoTodos,
      autorSeleccionado,
      setAutorSeleccionado,
      libros,
      cargandoLibros,
      autoresVisibles,
      listaActiva,
    } = useAutores();
    
    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
 
  return (
    <div className="container-fluid px-4 mt-4 ">
    <div className="row">
      
      {/* =========================================
          COLUMNA IZQUIERDA: Buscador AJAX
          ========================================= */}
   
      <div className="col-md-3 mb-4 h-100">
        <div className={`shadow-sm ${styles.panelLateral}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Autores</h5>
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-pill bg-white"
              placeholder="Buscar autor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className={styles.listaAutores}>
            {buscando ? (
              <p className="text-center text-muted small mt-4">Buscando...</p>
            ) : busqueda === "" ? (
              <p className="text-center text-muted small mt-4">
                Usa el buscador para encontrar un autor específico.
              </p>
            ) : resultadosBusqueda.length === 0 ? (
              <p className="text-center text-muted small mt-4">
                No hay autores que coincidan con "{busqueda}".
              </p>
            ) : (
              resultadosBusqueda.map((autor, index) => (
                <div 
                  key={index}
                  onClick={() => setAutorSeleccionado(autor)}
                  className={`${styles.itemAutor} ${autorSeleccionado === autor ? styles.itemAutorActivo : ""}`}
                >
                  {autor}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          COLUMNA DERECHA: Abecedario y Contenido
          ========================================= */}
      <div className="col-md-9">
        
        <div className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube}`}>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button
                onClick={() => {
                  setLetraSeleccionada(null);
                  setAutorSeleccionado(null);
                }}
                className={`btn rounded-circle shadow-sm fw-bold ${
                  !letraSeleccionada && !autorSeleccionado ? "btn-primary text-white" : "btn-light"
                }`}
                style={{ width: "38px", height: "38px", padding: 0 }}
                title="Ver Todos"
              >
                ∞
            </button>

            {abecedario.map((letra) => (
              <button
                key={letra}
                onClick={() => {
                  setLetraSeleccionada(letra);
                  setAutorSeleccionado(null);
                }}
                style={{ width: "38px", height: "38px", padding: 0 }}
                className={`btn rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold ${
                  letraSeleccionada === letra && !autorSeleccionado ? "btn-dark text-white" : "btn-outline-dark bg-white"
                }`}
              >
                {letra}
              </button>
            ))}
          </div>
        </div>

        <div>
          
          {/* VISTA 1: Libros de un autor seleccionado */}
          {autorSeleccionado ? (
            <>
              <h3 className="mb-4 border-bottom pb-2">
                Obras de <span className="fw-bold">{autorSeleccionado}</span>
              </h3>
              
              <div className="row g-4">
                {cargandoLibros ? (
                  <p className="text-center w-100">Cargando estantería...</p>
                ) : libros.length === 0 ? (
                  <p className="text-center w-100 text-muted">No se encontraron libros de este autor.</p>
                ) : (
                  libros.map((libro) => (
                    <div key={libro._id} className="col-md-4 col-lg-3">
                      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                        <img src={libro.portada_url} className="card-img-top p-3" style={{ height: '220px', objectFit: 'contain' }} alt={libro.titulo} />
                        <div className="card-body text-center d-flex flex-column justify-content-between">
                          <div>
                            <h6 className="fw-bold mb-1">{libro.titulo}</h6>
                            <p className="text-muted small mb-2">Editorial: {libro.editorial}</p>
                          </div>
                          <Link to={`/libro/${libro._id}`} className="btn btn-outline-dark btn-sm rounded-pill mt-2 w-100">
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : 
          
          /* VISTA 2: Lista de autores (Todos o Filtrados por letra) */
          (
            <>
              <h3 className="mb-4 border-bottom pb-2">
                {letraSeleccionada 
                  ? `Autores que empiezan por "${letraSeleccionada}"` 
                  : "Directorio de Autores"}
              </h3>
              
              <div className="row g-4">
                {(letraSeleccionada ? cargandoLetra : cargandoTodos) ? (
                  <p className="text-center w-100 mt-5">Cargando el directorio...</p>
                ) : listaActiva.length === 0 ? (
                  <p className="text-center w-100 text-muted mt-5">Aún no hay autores registrados en esta sección.</p>
                ) : (
                  <>
                    {/* Dibuja solo los autores limitados por el scroll */}
                    {autoresVisibles.map((autor, index) => (
                      <div key={index} className="col-md-4 col-sm-6 animate__animated animate__fadeIn">
                        <div 
                          className="card border-0 shadow-sm p-3 text-center h-100 d-flex justify-content-center" 
                          style={{ cursor: "pointer", transition: "transform 0.2s" }}
                          onClick={() => setAutorSeleccionado(autor)}
                          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                          <h6 className="m-0 fw-bold">{autor}</h6>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

            
             
            </>
          )}
        </div>

      </div>
    </div>
  </div>
);
}

export default AutoresPage;