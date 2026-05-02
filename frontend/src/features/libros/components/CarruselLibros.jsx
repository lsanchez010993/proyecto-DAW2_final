import { Link } from 'react-router-dom';
import './css/CarruselLibros.css'; 
function CarruselLibros({ libros }) {
  if (!libros || libros.length === 0) {
    return (
      <div className="text-muted p-3 bg-light rounded text-center">
        No hay libros disponibles en esta sección todavía.
      </div>
    );
  }

  return (
    <div className="carrusel-scroll-visible">
      {libros.map((libro) => (
        <div key={libro._id} style={{ width: '240px', flexShrink: 0 }}>
          
          <div 
            className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" 
            style={{ transition: "transform 0.2s ease" }} 
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"} 
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <img 
              src={libro.portada_url || "https://via.placeholder.com/220x330"} 
              className="card-img-top p-3" 
              style={{ height: "220px", objectFit: "contain" }} 
              alt={libro.titulo} 
            />
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <h6 className="fw-bold mb-1 text-truncate" title={libro.titulo}>{libro.titulo}</h6>
                <p className="text-muted small mb-2 text-truncate" title={libro.autor}>{libro.autor}</p>
              </div>
              <Link to={`/libro/${libro._id}`} className="btn btn-outline-dark btn-sm rounded-pill mt-2 w-100">
                Ver Detalles
              </Link>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default CarruselLibros;