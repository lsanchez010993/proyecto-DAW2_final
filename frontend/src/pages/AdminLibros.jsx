import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function AdminLibros() {
  const [libros, setLibros] = useState([]);
  const { usuario } = useAuth(); 

  // 1. Cargar libros al iniciar
  useEffect(() => {
    
    if (usuario) {
      fetchLibros();
    }
  }, [usuario]);

  const fetchLibros = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros?limit=100`);

      if (res.data.data) {
        let librosObtenidos = res.data.data;

        // ---  FILTRADO POR ROL ---
        // Si el usuario tiene rol 'editorial', filtar el array para dejar solo sus libros
        if (usuario.rol === 'editorial') {
          librosObtenidos = librosObtenidos.filter(
      
            (libro) => libro.creador === usuario._id || libro.usuario === usuario._id
          );
        }

        setLibros(librosObtenidos);
      } else {
        setLibros([]);
      }
    } catch (error) {
      console.error("Error cargando libros", error);
    }
  };

  // 2. Función Eliminar
  const handleDelete = async (id, titulo) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${titulo}"?`)) {
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token = localStorage.getItem("token");

        await axios.delete(`${URL}/api/libros/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // recargar la lista
        fetchLibros();
      } catch (error) {
        alert("Error al eliminar el libro");
      }
    }
  };

  return (
    <div className="container mt-5">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          {usuario?.rol === 'editorial' ? 'Mi catálogo' : 'Administrar libros'}
        </h2>
        <Link to="/crear-libro" className="btn btn-success fw-bold">
          + Nuevo Libro
        </Link>
      </div>

      <div className="text-end mb-2">
        <a href="#" className="text-primary text-decoration-none small">
          Ver listado
        </a>
      </div>

      {/* --- ZONA GRIS DEL GRID --- */}
      <div
        className="p-4 rounded shadow-sm"
        style={{ backgroundColor: "#e0e0e0", minHeight: "400px" }}
      >
        {libros.length === 0 ? (
          <p className="text-center text-muted mt-5">
            {usuario?.rol === 'editorial' 
              ? "Aún no has subido ningún libro." 
              : "No hay libros cargados aún."}
          </p>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
            {libros.map((libro) => (
              <div className="col" key={libro._id}>
                {/* TARJETA BLANCA */}
                <div className="card h-100 border-0 shadow-sm">
                  {/* Imagen Portada */}
                  <div
                    style={{ height: "250px", overflow: "hidden" }}
                    className="bg-light d-flex align-items-center justify-content-center"
                  >
                    {libro.portada_url ? (
                      <img
                        src={libro.portada_url}
                        className="card-img-top h-100 w-100"
                        style={{ objectFit: "cover" }}
                        alt={libro.titulo}
                      />
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </div>

                  {/* Cuerpo de la tarjeta  */}
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-truncate small mb-3">
                      {libro.titulo}
                    </h6>

                    {/* BOTONES */}
                    <div className="d-flex justify-content-between px-2">
                      <button
                        className="btn btn-link text-dark text-decoration-none p-0 small"
                        onClick={() => handleDelete(libro._id, libro.titulo)}
                      >
                        Eliminar
                      </button>

                      <Link
                        to={`/editar-libro/${libro._id}`}
                        className="btn btn-link text-dark text-decoration-none p-0 small"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLibros;