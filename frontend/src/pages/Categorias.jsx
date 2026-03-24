import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Categorias.module.css";

function Categorias() {
  const listaCategorias = [
    "Ciencia Ficción", "Fantasía", "Misterio y Thriller", "Romance", 
    "Terror", "Novela Histórica", "Biografía", "Desarrollo Personal", 
    "Poesía", "Cómic y Manga", "Clásicos", "Aventura"
  ];

  const [seleccionadas, setSeleccionadas] = useState([]);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarLibros();
  }, [seleccionadas]); 

  const cargarLibros = async () => {
    setCargando(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const categoriasQuery = seleccionadas.length > 0 ? `?categorias=${seleccionadas.join(",")}` : "";
      
      const res = await axios.get(`${URL}/api/libros${categoriasQuery}`);
      setLibros(res.data.data || []);
    } catch (error) {
      toast.error("Error al cargar la estantería");
    } finally {
      setCargando(false);
    }
  };

  const toggleCategoria = (categoria) => {
    if (seleccionadas.includes(categoria)) {
      setSeleccionadas(seleccionadas.filter((c) => c !== categoria));
    } else {
      setSeleccionadas([...seleccionadas, categoria]);
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4 fw-bold">Explora por Categorías</h2>

      {/* SECCIÓN 1: La nube de píldoras estáticas */}
      <div className={`shadow-sm p-4 mb-5 ${styles.tarjetaNube}`}>
        <p className="text-muted text-center mb-4">
          Combina tus géneros favoritos para encontrar tu próxima lectura.
        </p>
        
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {listaCategorias.map((cat) => (
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

      {/* SECCIÓN 2: Resultados  */}
      <h4 className="mb-4 border-bottom pb-2">
       
        {seleccionadas.length === 0 
          ? `Catálogo Completo (${libros.length} libros)` 
          : `Resultados Filtrados (${libros.length} libros)`}
      </h4>
      
      <div className="row g-4">
        {cargando ? (
          <p className="text-center w-100 mt-4">Buscando libros...</p>
        ) : libros.length === 0 ? (
          <div className={`text-center text-muted ${styles.estadoVacio}`}>
            <div className={styles.iconoLibros}>🧭</div>
            <p className="mt-3">No tenemos libros que coincidan con esta selección exacta.</p>
          </div>
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
                    <p className="text-muted small mb-2">{libro.autor}</p>
                    
                    <div className="mb-2">
                      {libro.categorias && libro.categorias.slice(0, 2).map((c, i) => (
                        <span key={i} className={styles.etiquetaCategoria}>{c}</span>
                      ))}
                      {libro.categorias && libro.categorias.length > 2 && (
                        <span className={styles.etiquetaCategoria}>+{libro.categorias.length - 2}</span>
                      )}
                    </div>
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
    </div>
  );
}

export default Categorias;