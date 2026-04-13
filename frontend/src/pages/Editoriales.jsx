import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Editoriales.module.css"; 

function Editoriales() {
  const [listaEditoriales, setListaEditoriales] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  
  // Estados para la columna izquierda (Buscador en memoria)
  const [busqueda, setBusqueda] = useState("");
  
  const [editorialesExpandidas, setEditorialesExpandidas] = useState({});

  // ==========================================
  // ESTADOS DEL SCROLL INFINITO REAL
  // ==========================================
  const [librosPorEditorial, setLibrosPorEditorial] = useState({});
  const [paginaFilas, setPaginaFilas] = useState(1);
  const [cargandoFilas, setCargandoFilas] = useState(false);
  const [finDelCatalogo, setFinDelCatalogo] = useState(false);
  const filasPorPagina = 3;

  // Determina qué editoriales vamos a procesar (todas o solo las filtradas)
  const editorialesAProcesar = seleccionadas.length > 0 ? seleccionadas : listaEditoriales;

  // 1. Cargar las editoriales únicas al entrar a la página
  useEffect(() => {
    cargarEditorialesUnicas();
  }, []);

  const cargarEditorialesUnicas = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros/editoriales/unicas`);
      setListaEditoriales(res.data);
    } catch (error) {
      toast.error("Error al cargar las editoriales");
    }
  };

  // FUNCIÓN MAESTRA: Carga un lote de libros por editorial
  const cargarLoteDeEditoriales = async (pagina, editorialesActivas) => {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const loteActual = editorialesActivas.slice(inicio, fin);

    if (loteActual.length === 0) {
      setFinDelCatalogo(true);
      return;
    }

    setCargandoFilas(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      
      // Peticiones paralelas pidiendo solo 15 libros de cada editorial del lote
      const peticiones = loteActual.map((ed) =>
        axios.get(`${URL}/api/libros?editoriales=${encodeURIComponent(ed)}&limit=15`)
      );
      
      const respuestas = await Promise.all(peticiones);
      
      const nuevosDatos = {};
      respuestas.forEach((res, index) => {
        const nombreEd = loteActual[index];
        const librosDeEstaEd = res.data.data || [];
        if (librosDeEstaEd.length > 0) {
          nuevosDatos[nombreEd] = librosDeEstaEd;
        }
      });

      setLibrosPorEditorial((prev) => ({ ...prev, ...nuevosDatos }));
      
      if (fin >= editorialesActivas.length) {
        setFinDelCatalogo(true);
      }

    } catch (error) {
      toast.error("Error al buscar los libros");
    } finally {
      setCargandoFilas(false);
    }
  };

  // EFECTO 2: Cuando cambian los filtros (o cuando la lista de editoriales se carga por primera vez)
  useEffect(() => {
    if (listaEditoriales.length === 0) return; // Esperamos a tener editoriales

    setLibrosPorEditorial({});
    setPaginaFilas(1);
    setFinDelCatalogo(false);
    cargarLoteDeEditoriales(1, editorialesAProcesar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionadas, listaEditoriales]);

  // EFECTO 3: Cuando la página cambia (scroll)
  useEffect(() => {
    if (paginaFilas > 1) {
      cargarLoteDeEditoriales(paginaFilas, editorialesAProcesar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaFilas]);

  // EVENTO: Detector de Scroll para cargar más datos
  useEffect(() => {
    const manejarScroll = () => {
      if (cargandoFilas || finDelCatalogo) return;

      if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
        setPaginaFilas((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, [cargandoFilas, finDelCatalogo]);


  // Filtramos las editoriales en memoria según la búsqueda
  const editorialesFiltradas = listaEditoriales.filter((editorial) =>
    editorial.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleEditorial = (editorial) => {
    if (seleccionadas.includes(editorial)) {
      setSeleccionadas(seleccionadas.filter((e) => e !== editorial));
    } else {
      setSeleccionadas([...seleccionadas, editorial]);
    }
  };

  const toggleExpandir = (nombreEditorial) => {
    setEditorialesExpandidas(prev => ({
      ...prev,
      [nombreEditorial]: !prev[nombreEditorial]
    }));
  };

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row">
        
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador de Editoriales
            ========================================= */}
        <div className="col-md-3 mb-4 h-100">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <h5 className="fw-bold mb-3">Buscar Editorial</h5>
            
            <div className="mb-3">
              <input
                type="text"
                className="form-control rounded-pill bg-white"
                placeholder="🔍 Nombre de la editorial..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className={styles.listaResultados}>
              {busqueda === "" ? (
                <p className="text-center text-muted small mt-4">
                  Encuentra una editorial específica rápidamente.
                </p>
              ) : editorialesFiltradas.length === 0 ? (
                <p className="text-center text-muted small mt-4">
                  No hay editoriales que coincidan con "{busqueda}".
                </p>
              ) : (
                editorialesFiltradas.map((editorial, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      if (!seleccionadas.includes(editorial)) {
                        setSeleccionadas([...seleccionadas, editorial]);
                      }
                      setBusqueda("");
                    }}
                    className={styles.itemResultado}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                      {editorial}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      
        {/* =========================================
            COLUMNA DERECHA: Escaparate Netflix
            ========================================= */}
        <div className="col-md-9">
          
          <div className={`shadow-sm p-4 mb-5 ${styles.tarjetaNube} animate__animated animate__fadeIn`}>
            <p className="text-muted text-center mb-4">
              Selecciona una o varias editoriales para explorar su catálogo de libros.
            </p>
            
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {listaEditoriales.map((ed) => (
                <button
                  key={ed}
                  onClick={() => toggleEditorial(ed)}
                  className={`btn rounded-pill px-4 py-2 shadow-sm ${styles.botonPildora} ${
                    seleccionadas.includes(ed)
                      ? "btn-dark fw-bold animate__animated animate__pulse"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  {seleccionadas.includes(ed) && "✓ "} {ed}
                </button>
              ))}
              {listaEditoriales.length === 0 && (
                <p className="text-muted m-0">No hay editoriales registradas todavía.</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 border-bottom pb-2">
              {seleccionadas.length === 0 ? `Catálogo General:` : `Catálogo Seleccionado:`}
            </h4>

            {/* DIBUJAR ESTANTERÍAS DESCARGADAS */}
            {Object.entries(librosPorEditorial).length === 0 && !cargandoFilas ? (
              <div className={`text-center text-muted w-100 mt-5`}>
                <h1 style={{ fontSize: "4rem" }}>📚</h1>
                <p className="mt-3">No hay libros disponibles para esta selección actualmente.</p>
              </div>
            ) : (
              Object.entries(librosPorEditorial).map(([nombreEditorial, librosDeEditorial]) => {
                const estaExpandida = editorialesExpandidas[nombreEditorial];
                const mostrarVerMas = librosDeEditorial.length > 5;
                const librosAMostrar = estaExpandida ? librosDeEditorial : librosDeEditorial.slice(0, 5);

                return (
                  <div key={nombreEditorial} className="mb-5 animate__animated animate__fadeInUp">
                    
                    {/* Encabezado de la Editorial */}
                    <h4 className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                        {nombreEditorial}
                      </span>
                      {mostrarVerMas && (
                        <button 
                          className="btn btn-sm btn-outline-dark rounded-pill px-3"
                          onClick={() => toggleExpandir(nombreEditorial)}
                        >
                          {estaExpandida ? "Ocultar" : "Ver todo"}
                        </button>
                      )}
                    </h4>

                    {estaExpandida ? (
                      <div className="row g-4 animate__animated animate__fadeIn">
                        {librosAMostrar.map((libro) => (
                          <div key={libro._id} className="col-md-4 col-lg-3">
                            <TarjetaLibro libro={libro} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.carruselHorizontal}>
                        {librosAMostrar.map((libro) => (
                          <div key={libro._id} className={styles.itemCarrusel}>
                            <TarjetaLibro libro={libro} />
                          </div>
                        ))}
                        
                        {mostrarVerMas && (
                          <div className={styles.itemCarrusel} onClick={() => toggleExpandir(nombreEditorial)}>
                            <div className={`card h-100 rounded-4 shadow-sm ${styles.tarjetaVerMas}`}>
                              <div className="text-center p-4">
                                <h1 className="mb-3">+{librosDeEditorial.length - 5}</h1>
                                <span className="fw-bold">Ver catálogo completo</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

        
          
         
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente (Tarjeta)
function TarjetaLibro({ libro }) {
  return (
    <div className={`card h-100 shadow-sm border-0 rounded-4 overflow-hidden`} style={{ transition: "transform 0.2s ease" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <img 
        src={libro.portada_url} 
        className="card-img-top p-3" 
        style={{ height: '220px', objectFit: 'contain' }}
        alt={libro.titulo}
      />
      <div className="card-body text-center d-flex flex-column justify-content-between">
        <div>
          <h6 className="fw-bold mb-1">{libro.titulo}</h6>
          <p className="text-muted small mb-2">{libro.autor}</p>
        </div>
        <Link to={`/libro/${libro._id}`} className="btn btn-outline-dark btn-sm rounded-pill mt-3 w-100">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default Editoriales;