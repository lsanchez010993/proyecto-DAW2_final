import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Editoriales.module.css"; 

function Editoriales() {
  const [listaEditoriales, setListaEditoriales] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarEditorialesUnicas();
  }, []);

  useEffect(() => {
    if (seleccionadas.length > 0) {
      cargarLibrosPorEditorial();
    } else {
      setLibros([]);
    }
  }, [seleccionadas]);

  const cargarEditorialesUnicas = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros/editoriales/unicas`);
      setListaEditoriales(res.data);
    } catch (error) {
      toast.error("Error al cargar las editoriales");
    }
  };

  const cargarLibrosPorEditorial = async () => {
    setCargando(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const editorialesQuery = seleccionadas.join(",");
      const res = await axios.get(`${URL}/api/libros?editoriales=${editorialesQuery}`);
      
      setLibros(res.data.data || []);
    } catch (error) {
      toast.error("Error al buscar los libros");
    } finally {
      setCargando(false);
    }
  };

  const toggleEditorial = (editorial) => {
    if (seleccionadas.includes(editorial)) {
      setSeleccionadas(seleccionadas.filter((e) => e !== editorial));
    } else {
      setSeleccionadas([...seleccionadas, editorial]);
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4 fw-bold">Descubre nuestras Editoriales</h2>

      {/* SECCIÓN 1: Nube de píldoras */}
      <div className={`shadow-sm p-4 mb-5 ${styles.tarjetaNube}`}>
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
            <p className="text-muted">No hay editoriales registradas todavía.</p>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: Resultados */}
      {seleccionadas.length === 0 ? (
        <div className={`text-center text-muted ${styles.estadoVacio}`}>
          <div className={styles.iconoLibros}>📚</div>
          
          <p>Selecciona una editorial.</p>
        </div>
      ) : (
        <>
          <h4 className="mb-4 border-bottom pb-2">
            Catálogo seleccionado ({libros.length} libros)
          </h4>
          
          <div className="row g-4">
            {cargando ? (
              <p className="text-center w-100 mt-4">Cargando la estantería...</p>
            ) : libros.length === 0 ? (
              <p className="text-center w-100 text-muted mt-4">
                No hay libros disponibles para esta selección actualmente.
              </p>
            ) : (
              libros.map((libro) => (
                <div key={libro._id} className="col-md-3 animate__animated animate__zoomIn">
                  <div className={`card h-100 shadow-sm ${styles.tarjetaLibro}`}>
                    <img 
                      src={libro.portada_url} 
                      className={`card-img-top ${styles.imagenPortada}`} 
                      alt={libro.titulo}
                    />
                    <div className="card-body text-center d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">{libro.titulo}</h6>
                        <p className={`text-muted mb-2 ${styles.textoEditorial}`}>
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
        </>
      )}
    </div>
  );
}

export default Editoriales;