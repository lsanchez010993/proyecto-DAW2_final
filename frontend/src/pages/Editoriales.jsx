import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Editoriales.module.css"; 

function Editoriales() {
  const [listaEditoriales, setListaEditoriales] = useState([]);
  
  // Estados para la columna derecha (Filtro por Editoriales)
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estados para la columna izquierda (Buscador AJAX de libros)
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Cargar la lista de editoriales únicas
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

  // Cargar escaparate principal 
  useEffect(() => {
    const cargarLibros = async () => {
      setCargando(true);
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const editorialesQuery = seleccionadas.length > 0 ? `?editoriales=${seleccionadas.join(",")}` : "";
        
        const res = await axios.get(`${URL}/api/libros${editorialesQuery}`);
        setLibros(res.data.data || []);
      } catch (error) {
        toast.error("Error al buscar los libros");
      } finally {
        setCargando(false);
      }
    };
    cargarLibros();
  }, [seleccionadas]);

  //  Buscador AJAX en tiempo real para el panel izquierdo
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

  const toggleEditorial = (editorial) => {
    if (seleccionadas.includes(editorial)) {
      setSeleccionadas(seleccionadas.filter((e) => e !== editorial));
    } else {
      setSeleccionadas([...seleccionadas, editorial]);
    }
  };

  return (
    <div className="container-fluid px-4 mt-4 animate__animated animate__fadeIn">
      <div className="row">
        
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador de Libros
            ========================================= */}
        <div className="col-md-3 mb-4">
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
                  <Link 
                    key={libro._id} 
                    to={`/libro/${libro._id}`}
                    className={styles.itemResultado}
                  >
                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{libro.titulo}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{libro.autor}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            COLUMNA DERECHA: Escaparate y Píldoras
            ========================================= */}
        <div className="col-md-9">
          
          <div className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube}`}>
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

          <h4 className="mb-4 border-bottom pb-2">
            {seleccionadas.length === 0 
              ? `Libros Disponibles` 
              : `Catálogo Seleccionado (${libros.length} libros)`}
          </h4>
          
          <div className="row g-4">
            {cargando ? (
              <p className="text-center w-100 mt-4">Cargando la estantería...</p>
            ) : libros.length === 0 ? (
              <div className={`text-center text-muted w-100 mt-5`}>
                <h1 style={{ fontSize: "4rem" }}>📚</h1>
                <p className="mt-3">No hay libros disponibles para esta selección actualmente.</p>
              </div>
            ) : (
              libros.map((libro) => (
                <div key={libro._id} className="col-md-4 col-lg-3 animate__animated animate__zoomIn">
                  <div className={`card h-100 shadow-sm border-0 rounded-4 overflow-hidden`} style={{ transition: "transform 0.2s ease" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    <img 
                      src={libro.portada_url} 
                      className={`card-img-top p-3 ${styles.imagenPortada}`} 
                      style={{ height: '220px', objectFit: 'contain' }}
                      alt={libro.titulo}
                    />
                    <div className="card-body text-center d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">{libro.titulo}</h6>
                        <p className={`text-muted small mb-2 ${styles.textoEditorial}`}>
                          {libro.editorial}
                        </p>
                      </div>
                      <Link to={`/libro/${libro._id}`} className="btn btn-outline-dark btn-sm rounded-pill mt-3 w-100">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Editoriales;