import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Filtros from "../components/Filtros";

function Home() {
  const [libros, setLibros] = useState([]);
  
  // 1.  PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // 2. paginaActual

  useEffect(() => {
    
    const fetchLibros = async () => {
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        
        // 3. PARÁMETROS DE PÁGINA Y LÍMITE
        const res = await axios.get(`${URL}/api/libros?page=${paginaActual}&limit=12`);
        
        setLibros(res.data.data); 
        setTotalPaginas(res.data.paginacion.totalPaginas);

      } catch (error) {
        console.error("Error cargando libros:", error);
      }
    };

    fetchLibros();
    
    // Scroll suave hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [paginaActual]);

  // Función para cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="container-fluid p-4">
      <Filtros />
      <hr />
      
      <h2 className="text-center mb-4">Libros</h2>

      {/* GRID DE LIBROS */}
      <div className="row">
        {libros.map((libro) => (
          <div key={libro._id} className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={libro.portada_url || "https://via.placeholder.com/300"}
                className="card-img-top"
                alt={libro.titulo}
                style={{ height: "350px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{libro.titulo}</h5>
                <p className="card-text text-muted">{libro.autor}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="h5 text-primary mb-0">
                    {libro.precio?.fisico} €
                  </span>
                  <Link to={`/libro/${libro._id}`} className="btn btn-dark">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. BARRA DE PAGINACIÓN */}
      {totalPaginas > 1 && (
        <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
                {/* Botón Anterior */}
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => cambiarPagina(paginaActual - 1)}
                    >
                        Anterior
                    </button>
                </li>

                {/* Números de página */}
                {[...Array(totalPaginas)].map((_, index) => (
                    <li 
                        key={index + 1} 
                        className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}
                    >
                        <button 
                            className="page-link" 
                            onClick={() => cambiarPagina(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}

                {/* Botón Siguiente */}
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => cambiarPagina(paginaActual + 1)}
                    >
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
      )}
    </div>
  );
}

export default Home;