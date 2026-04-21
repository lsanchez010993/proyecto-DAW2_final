import { useState, useEffect } from "react";
import axios from "axios";
import CarruselLibros from "../components/CarruselLibros";
import { useAuth } from "../context/AuthContext";

// Con la siguiente funcion determino el artículo (la/el) correcto dependiendo del genero. Como las categorias son siempre las mismas, basta con definir las que son de un genero concreto. En este caso genero femenino
  const formatearGenero = (genero) => {
    if (!genero) return "";

   
    const generosFemeninos = [
      "Fantasía", 
      "Ciencia Ficción", 
      "Aventura", 
      "Novela Histórica", 
      "Poesía",
      "Biografía",
      "Ficción Contemporánea"
    ];

    // Si el género está en la lista de femeninos, usa "la". Si no, usa "el".
    const articulo = generosFemeninos.includes(genero) ? "la" : "el";

    return `${articulo} ${genero}`;
  };
function Inicio() {
  const { usuario } = useAuth();
 
  const [cargando, setCargando] = useState(true);

  // Estados para Vista Pública
  const [novedades, setNovedades] = useState([]);
  const [topVentas, setTopVentas] = useState([]);
  const [tendencias, setTendencias] = useState([]);

  // Estados para Vista Privada
  const [recomendadosPorLibro, setRecomendadosPorLibro] = useState([]);
  const [recomendadosPorGenero, setRecomendadosPorGenero] = useState([]);
  const [tituloReferencia, setTituloReferencia] = useState(""); 
  const [generoReferencia, setGeneroReferencia] = useState(""); 

  useEffect(() => {
    const cargarEscaparate = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      try {
        // 1. Cargar  los datos públicos (para todos)
        const resPublica = await axios.get(
          `${URL}/api/recomendaciones/publicas`,
        );
        setNovedades(resPublica.data.novedades);
        setTopVentas(resPublica.data.topVentas);
        setTendencias(resPublica.data.tendencias);

        // 2. Si hay token, carga los datos privados
       if (token) {
          
          const resPrivada = await axios.get(`${URL}/api/recomendaciones/privadas`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          setRecomendadosPorLibro(resPrivada.data.porLibro);
          setRecomendadosPorGenero(resPrivada.data.porGenero);
          setTituloReferencia(resPrivada.data.tituloReferencia); 
          setGeneroReferencia(resPrivada.data.generoReferencia); 
        } 
      } catch (error) {
        console.error("Error cargando el escaparate:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarEscaparate();
  }, []);

  

  return (
    <div className="mt-4">
      <div className="text-center mb-5 pb-3">
        <h1 className="fw-bold mb-3">Descubre tu próxima aventura</h1>
        <p className="text-muted">
          Explora los libros que están cautivando a miles de lectores.
        </p>
      </div>
     {/* === SECCIÓN PERSONALIZADA === */}
      {usuario && (
        <div className="mb-5">
          
          {/* Lógica por Libro */}
          {tituloReferencia && recomendadosPorLibro.length > 0 && (
            <div className="mb-5">
              <h4 className="border-bottom pb-2">Porque leíste "{tituloReferencia}"</h4>
              <CarruselLibros libros={recomendadosPorLibro} />
            </div>
          )}

         
        {/* Lógica por Género */}
          {generoReferencia && recomendadosPorGenero.length > 0 && (
            <div className="mb-5">
            
              <h4 className="border-bottom pb-2">
          
                Porque te gusta {formatearGenero(generoReferencia)}
              </h4>
              <CarruselLibros libros={recomendadosPorGenero} />
            </div>
          )}
          
        </div>
      )}

      {/* === SECCIÓN GLOBAL */}

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Tendencias de la Semana</h4>
        <CarruselLibros libros={tendencias} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Top Ventas Global</h4>
        <CarruselLibros libros={topVentas} />
      </div>

      <div className="mb-5">
        <h4 className="border-bottom pb-2">Novedades</h4>
        <CarruselLibros libros={novedades} />
      </div>
    </div>
  );
}

export default Inicio;
