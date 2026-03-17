import { useState } from 'react';
import { buscarLibrosGoogle } from '../services/googleBooksService';
import styles from './BuscadorGoogle.module.css';
import toast from 'react-hot-toast';

function BuscadorGoogle() {
  const [query, setQuery] = useState('');
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!query) return;

    setCargando(true);
    const resultados = await buscarLibrosGoogle(query);
    setLibros(resultados);
    setCargando(false);

    if (resultados.length === 0) {
      toast.error("No se encontraron libros con ese título.");
    }
  };

  return (
    <div className={styles.contenedorBusqueda}>
      <h2 className="text-center mb-4 fw-bold">🔍 Explorar catálogo global</h2>
      
      <form onSubmit={handleBuscar} className="mb-5 d-flex gap-2">
        <input
          type="text"
          className={`form-control ${styles.barraBusqueda}`}
          placeholder="Busca por título, autor o ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-dark rounded-pill px-4">
          Buscar
        </button>
      </form>

      {cargando ? (
        <div className="text-center">Cargando libros de Google...</div>
      ) : (
        <div className="row g-4">
          {libros.map((libro) => (
            <div key={libro.id} className="col-md-3">
              <div className={`card h-100 shadow-sm ${styles.tarjetaLibro}`}>
                <img
                  src={libro.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
                  className={styles.portadaLibro}
                  alt={libro.volumeInfo.title}
                />
                <div className="card-body">
                  <h6 className="fw-bold mb-1 text-truncate">{libro.volumeInfo.title}</h6>
                  <p className="small text-muted mb-0">{libro.volumeInfo.authors?.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuscadorGoogle;