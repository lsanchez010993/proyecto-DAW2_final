import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function DetalleLibro() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const { agregarAlCarrito } = useCarrito();
  const { usuario, actualizarUsuario } = useAuth();

  // Estado para la Lista de Deseos
  const [enDeseos, setEnDeseos] = useState(() => {
    return usuario?.lista_deseos?.includes(id) || false;
  });


  const registrarInteraccion = async (tipoAccion) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${URL}/api/usuarios/interaccion`,
        { libroId: id, tipoAccion },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Error en el radar de interacciones");
    }
  };

 
// Función para añadir/quitar de la lista de deseos
  const toggleDeseos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión para guardar libros.");

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.put(
        `${URL}/api/usuarios/deseos/toggle`,
        { libroId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEnDeseos(!enDeseos);
      
      
      if (usuario) {
        actualizarUsuario({ 
          ...usuario, 
          lista_deseos: res.data.lista_deseos 
        });
      }
      
      
      if (!enDeseos) registrarInteraccion("deseo"); 
      
    } catch (error) {
      console.error("Error al actualizar deseos");
    }
  };

  // Cargar los detalles del libro
  useEffect(() => {
    const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    axios
      .get(`${URL}/api/libros/${id}`)
      .then((res) => setLibro(res.data))
      .catch((err) => console.error("Error cargando el libro:", err));
  }, [id]);

  // Registrar la visita silenciosa al entrar
  useEffect(() => {
    registrarInteraccion("vista");
    
  }, [id]);

  if (!libro) return <div className="text-center mt-5">Cargando libro...</div>;

  return (
    <div className="container mt-5">
      <Link to="/" className="btn btn-outline-secondary mb-3">
        ← Volver al catálogo
      </Link>

      <div className="row">
        <div className="col-md-4">
          <img
            src={libro.portada_url || "https://via.placeholder.com/300"}
            alt={libro.titulo}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h1>{libro.titulo}</h1>
          <h3 className="text-muted">{libro.autor}</h3>
          <hr />
          <p className="lead">{libro.sinopsis}</p>

          <p className="mb-3 text-secondary">
            <span className="fw-bold">Editorial:</span>{" "}
            {libro.editorial || "Editorial Independiente"}
          </p>

          {libro.categorias && libro.categorias.length > 0 && (
            <div className="mb-4 d-flex flex-wrap gap-2">
              {libro.categorias.map((cat, index) => (
                <span
                  key={index}
                  className="badge bg-dark rounded-pill px-3 py-2 fw-normal shadow-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <div className="card bg-light p-3 mt-4">
            <h5>Opciones de Compra:</h5>
            <div className="d-flex gap-3 mt-2 align-items-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  agregarAlCarrito(libro);
                  registrarInteraccion("carrito");
                }}
              >
                Comprar Físico ({libro.precio?.fisico} €)
              </button>

              <button
                className="btn btn-info text-white"
                onClick={() => {
                  agregarAlCarrito(libro);
                  registrarInteraccion("carrito");
                }}
              >
                Comprar Ebook ({libro.precio?.digital} €)
              </button>

              <button
                className={`btn ${enDeseos ? "btn-danger" : "btn-outline-danger"}`}
                onClick={toggleDeseos}
                title="Añadir a lista de deseos"
              >
                {enDeseos ? "❤️ Guardado" : "🤍 Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleLibro;
