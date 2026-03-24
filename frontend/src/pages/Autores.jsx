import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Autores.module.css";

function Autores() {
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  // Estados para el Buscador (Columna Izquierda)
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Estados para el Directorio (Columna Derecha)
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);
  const [autoresPorLetra, setAutoresPorLetra] = useState([]);
  const [cargandoLetra, setCargandoLetra] = useState(false);

  // [NUEVO] Estados para la vista inicial (Todos los autores)
  const [todosLosAutores, setTodosLosAutores] = useState([]);
  const [cargandoTodos, setCargandoTodos] = useState(false);

  // Estados Globales (Visualización de libros)
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);
  const [libros, setLibros] = useState([]);
  const [cargandoLibros, setCargandoLibros] = useState(false);

  //  Cargar TODOS los autores al entrar a la página
  useEffect(() => {
    const fetchTodosLosAutores = async () => {
      setCargandoTodos(true);
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const res = await axios.get(`${URL}/api/libros/autores/todos`);
        setTodosLosAutores(res.data);
      } catch (error) {
        console.error("Error al cargar el directorio de autores");
      } finally {
        setCargandoTodos(false);
      }
    };
    fetchTodosLosAutores();
  }, []);

  // Buscador AJAX (Se activa al escribir)
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim().length > 0) {
        setBuscando(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros/autores/buscar?q=${busqueda}`);
          setResultadosBusqueda(res.data);
        } catch (error) {
          console.error("Error en la búsqueda");
        } finally {
          setBuscando(false);
        }
      } else {
        setResultadosBusqueda([]);
      }
    };

    const temporizador = setTimeout(() => {
      fetchBusqueda();
    }, 300);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // Cargar autores por letra (Se activa al pulsar el abecedario)
  useEffect(() => {
    const fetchLetra = async () => {
      if (letraSeleccionada) {
        setCargandoLetra(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros/autores/letra?l=${letraSeleccionada}`);
          setAutoresPorLetra(res.data);
        } catch (error) {
          toast.error("Error al cargar la letra");
        } finally {
          setCargandoLetra(false);
        }
      }
    };
    fetchLetra();
  }, [letraSeleccionada]);

  // Buscar libros cuando se hace clic en un autor
  useEffect(() => {
    if (autorSeleccionado) {
      cargarLibrosDelAutor(autorSeleccionado);
    }
  }, [autorSeleccionado]);

  const cargarLibrosDelAutor = async (autor) => {
    setCargandoLibros(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros?autor=${encodeURIComponent(autor)}`);
      setLibros(res.data.data || []);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setCargandoLibros(false);
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="row">
        
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador AJAX
            ========================================= */}
        <div className="col-md-3 mb-4">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Autores</h5>
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                className="form-control rounded-pill bg-white"
                placeholder="🔍 Buscar autor..."
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
          
          <div className={`shadow-sm p-3 mb-4 ${styles.tarjetaNube}`}>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {/* Quitar el filtro de la letra */}
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

          <div className="animate__animated animate__fadeIn">
            
            {/* Libros de un autor seleccionado */}
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
                              <p className="text-muted small mb-2">🏢 {libro.editorial}</p>
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
            
            /* Lista de autores de una letra */
            letraSeleccionada ? (
              <>
                <h3 className="mb-4 border-bottom pb-2">
                  Autores que empiezan por <span className="fw-bold">"{letraSeleccionada}"</span>
                </h3>
                
                <div className="row g-3">
                  {cargandoLetra ? (
                    <p className="text-center w-100">Cargando autores...</p>
                  ) : autoresPorLetra.length === 0 ? (
                    <p className="text-center w-100 text-muted">No tenemos autores registrados con esta inicial.</p>
                  ) : (
                    autoresPorLetra.map((autor, index) => (
                      <div key={index} className="col-md-4 col-sm-6">
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
                    ))
                  )}
                </div>
              </>
            ) : 
            
            /* Vista inicial  */
            (
              <>
                <h3 className="mb-4 border-bottom pb-2">
                  Lista de autores
                </h3>
                
                <div className="row g-3">
                  {cargandoTodos ? (
                    <p className="text-center w-100 mt-5">Cargando el directorio...</p>
                  ) : todosLosAutores.length === 0 ? (
                    <p className="text-center w-100 text-muted mt-5">Aún no hay autores registrados en la tienda.</p>
                  ) : (
                    todosLosAutores.map((autor, index) => (
                      <div key={index} className="col-md-4 col-sm-6 animate__animated animate__fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
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
                    ))
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

export default Autores;