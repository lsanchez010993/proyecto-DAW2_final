import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Categorias.module.css";

function Categorias() {
  // Actúa como nuestra "base de datos de filas"
  const listaCategoriasGlobal = [
    "Ciencia Ficción", "Fantasía", "Misterio y Thriller", "Romance",
    "Terror", "Novela Histórica", "Biografía", "Desarrollo Personal",
    "Poesía", "Cómic y Manga", "Clásicos", "Aventura",
  ];

  // Estados Generales
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});

  // ==========================================
  // ESTADOS DEL NUEVO SCROLL INFINITO REAL
  // ==========================================
  const [librosPorCategoria, setLibrosPorCategoria] = useState({});
  const [paginaFilas, setPaginaFilas] = useState(1);
  const [cargandoFilas, setCargandoFilas] = useState(false);
  const [finDelCatalogo, setFinDelCatalogo] = useState(false);
  const filasPorPagina = 3;

  // Determina qué categorías vamos a mostrar (todas o solo las filtradas)
  const categoriasAProcesar = seleccionadas.length > 0 ? seleccionadas : listaCategoriasGlobal;

  // FUNCIÓN MAESTRA: Carga un lote específico de categorías
  const cargarLoteDeCategorias = async (pagina, categoriasActivas) => {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const loteActual = categoriasActivas.slice(inicio, fin);

    if (loteActual.length === 0) {
      setFinDelCatalogo(true);
      return;
    }

    setCargandoFilas(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      
      // Disparamos peticiones paralelas SOLO para las 3 categorías que tocan
      // Pedimos un máximo de 15 libros por categoría para no saturar
      const peticiones = loteActual.map((cat) =>
        axios.get(`${URL}/api/libros?categorias=${encodeURIComponent(cat)}&limit=15`)
      );
      
      const respuestas = await Promise.all(peticiones);
      
      const nuevosDatos = {};
      respuestas.forEach((res, index) => {
        const nombreCat = loteActual[index];
        const librosDeEstaCat = res.data.data || [];
        // Solo guardamos la categoría si realmente tiene libros
        if (librosDeEstaCat.length > 0) {
          nuevosDatos[nombreCat] = librosDeEstaCat;
        }
      });

      setLibrosPorCategoria((prev) => ({ ...prev, ...nuevosDatos }));
      
      // Si el lote actual era el último disponible, marcamos el fin
      if (fin >= categoriasActivas.length) {
        setFinDelCatalogo(true);
      }

    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setCargandoFilas(false);
    }
  };

  // EFECTO 1: Cuando cambian los filtros (píldoras), se resetea todo y carga la página 1
  useEffect(() => {
    setLibrosPorCategoria({});
    setPaginaFilas(1);
    setFinDelCatalogo(false);
    cargarLoteDeCategorias(1, categoriasAProcesar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionadas]);

  // EFECTO 2: Cuando la página cambia (por hacer scroll), carga más categorias
  useEffect(() => {
    if (paginaFilas > 1) {
      cargarLoteDeCategorias(paginaFilas, categoriasAProcesar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaFilas]);

  // EVENTO: Detector de Scroll para cargar más datos
  useEffect(() => {
    const manejarScroll = () => {
      if (cargandoFilas || finDelCatalogo) return;

      // Si estamos a 200px del final de la página, dispara la siguiente página
      if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
        setPaginaFilas((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, [cargandoFilas, finDelCatalogo]);


  // ==========================================
  // BUSCADOR AJAX LATERAL (Se mantiene igual)
  // ==========================================
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim().length > 0) {
        setBuscando(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros?titulo=${encodeURIComponent(busqueda)}`);
          setResultadosBusqueda(res.data.data || []);
        } catch (error) {
          console.error("Error en la búsqueda rápida");
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

  const toggleCategoria = (categoria) => {
    if (seleccionadas.includes(categoria)) {
      setSeleccionadas(seleccionadas.filter((c) => c !== categoria));
    } else {
      setSeleccionadas([...seleccionadas, categoria]);
    }
  };

  const toggleExpandir = (nombreCategoria) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [nombreCategoria]: !prev[nombreCategoria],
    }));
  };

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row">
        
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador
            ========================================= */}
        <div className="col-md-3 mb-4 h-100">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <h5 className="fw-bold mb-3">Buscar Libro</h5>

            <div className="mb-3">
              <input
                type="text"
                className="form-control rounded-pill bg-white"
                placeholder="🔍 Título del libro..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className={styles.listaResultados}>
              {buscando ? (
                <p className="text-center text-muted small mt-4">Buscando...</p>
              ) : busqueda === "" ? (
                <p className="text-center text-muted small mt-4">
                  Encuentra un libro específico rápidamente por su título.
                </p>
              ) : resultadosBusqueda.length === 0 ? (
                <p className="text-center text-muted small mt-4">
                  No hay libros que coincidan con "{busqueda}".
                </p>
              ) : (
                resultadosBusqueda.map((libro) => (
                  <Link key={libro._id} to={`/libro/${libro._id}`} className={styles.itemResultado}>
                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{libro.titulo}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{libro.autor}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            COLUMNA DERECHA: Escaparate estilo netflix
            ========================================= */}
        <div className="col-md-9">
          
          <div className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube} animate__animated animate__fadeIn`}>
            <p className="text-muted text-center mb-4">
              Filtra por tus géneros favoritos
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              {listaCategoriasGlobal.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategoria(cat)}
                  className={`btn rounded-pill px-4 py-2 shadow-sm ${styles.botonPildora} ${
                    seleccionadas.includes(cat)
                      ? "btn-dark fw-bold animate__animated animate__pulse"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  {seleccionadas.includes(cat) && "✓ "} {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 border-bottom pb-2">
              {seleccionadas.length === 0 ? `Catálogo General:` : `Resultados Encontrados:`}
            </h4>

            {/* DIBUJAR ESTANTERÍAS DESCARGADAS */}
            {Object.entries(librosPorCategoria).length === 0 && !cargandoFilas ? (
              <div className={`text-center text-muted w-100 mt-5`}>
                <h1 style={{ fontSize: "4rem" }}>🧭</h1>
                <p className="mt-3">Aún no hay libros en estas categorías.</p>
              </div>
            ) : (
              Object.entries(librosPorCategoria).map(([nombreCategoria, librosDeCategoria]) => {
                const estaExpandida = categoriasExpandidas[nombreCategoria];
                const mostrarVerMas = librosDeCategoria.length > 5;
                const librosAMostrar = estaExpandida ? librosDeCategoria : librosDeCategoria.slice(0, 5);

                return (
                  <div key={nombreCategoria} className="mb-5 animate__animated animate__fadeInUp">
                    
                    <h5 className="mb-3 d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                        {nombreCategoria} 
                      </span>
                      {mostrarVerMas && (
                        <button 
                          className="btn btn-sm btn-outline-dark rounded-pill px-3"
                          onClick={() => toggleExpandir(nombreCategoria)}
                        >
                          {estaExpandida ? "Ocultar" : "Ver todo"}
                        </button>
                      )}
                    </h5>

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
                          <div className={styles.itemCarrusel} onClick={() => toggleExpandir(nombreCategoria)}>
                            <div className={`card h-100 rounded-4 shadow-sm ${styles.tarjetaVerMas}`}>
                              <div className="text-center p-4">
                                <h1 className="mb-3">+{librosDeCategoria.length - 5}</h1>
                                <span className="fw-bold">Desplegar</span>
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

            {/* SPINNER DE CARGA AL HACER SCROLL */}
            {cargandoFilas && (
              <div className="text-center mt-4 mb-5 text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando más géneros...
              </div>
            )}
            
            {/* MENSAJE DE FIN DE CATÁLOGO */}
            {finDelCatalogo && Object.keys(librosPorCategoria).length > 0 && (
              <p className="text-center text-muted mt-5 mb-5 small">
                Has llegado al final de nuestro catálogo.
              </p>
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
      <img src={libro.portada_url} className="card-img-top p-3" style={{ height: "220px", objectFit: "contain" }} alt={libro.titulo} />
      <div className="card-body text-center d-flex flex-column justify-content-between">
        <div>
          <h6 className="fw-bold mb-1">{libro.titulo}</h6>
          <p className="text-muted small mb-2">{libro.autor}</p>
        </div>
        <Link to={`/libro/${libro._id}`} className="btn btn-outline-dark btn-sm rounded-pill mt-2 w-100">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default Categorias;