import { useState, useEffect } from "react";
import { buscarLibrosGratuitos } from "../services/googleBooksService";
import styles from "./css/Categorias.module.css";
import toast from 'react-hot-toast';

function Categorias() {
  const [categoriaActual, setCategoriaActual] = useState("Gratuitos");
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  const listaCategorias = ["Gratuitos", "Ciencia Ficción", "Fantasía", "Romance", "Terror"];

  useEffect(() => {
    cargarLibros();
  }, [categoriaActual]);

  const cargarLibros = async () => {
    setCargando(true);
    if (categoriaActual === "Gratuitos") {
      const data = await buscarLibrosGratuitos();
      setLibros(data);
    } else {
      // Aquí ira la lógica para buscar en ls BD por categoría
      
    }
    setCargando(false);
  };

  return (
    <div className={styles.contenedorCategorias}>
      <h2 className="text-center mb-4 fw-bold">Explorar por Categoría</h2>

      {/* Selector de Pestañas Estilo Perfil */}
      <div className={styles.selectorPestanas}>
        {listaCategorias.map((cat) => (
          <button
            key={cat}
            className={`${styles.botonPestana} ${categoriaActual === cat ? styles.activa : ""} ${cat === "Gratuitos" ? styles.gratis : ""}`}
            onClick={() => setCategoriaActual(cat)}
          >
            {cat === "Gratuitos" ? "🎁 " + cat : cat}
          </button>
        ))}
      </div>

      {/* Grid de Libros */}
      <div className="row g-4">
        {cargando ? (
          <p className="text-center w-100">Buscando los mejores libros...</p>
        ) : (
          libros.map((libro) => (
            <div key={libro.id} className="col-md-3 animate__animated animate__fadeIn">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img 
                  src={libro.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150"} 
                  className="card-img-top p-3" 
                  style={{ height: '220px', objectFit: 'contain' }}
                  alt={libro.volumeInfo?.title}
                />
                <div className="card-body text-center">
                  <h6 className="fw-bold text-truncate">{libro.volumeInfo?.title}</h6>
                  <span className="badge bg-success rounded-pill">¡Gratis!</span>
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