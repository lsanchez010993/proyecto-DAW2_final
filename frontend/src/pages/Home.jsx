import { useState, useEffect } from "react";
import axios from "axios";
import CarruselLibros from "../components/CarruselLibros";


function Inicio() {
  const [esUsuarioRegistrado, setEsUsuarioRegistrado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Estados para Vista Pública
  const [novedades, setNovedades] = useState([]);
  const [topVentas, setTopVentas] = useState([]);
  const [tendencias, setTendencias] = useState([]);

  // Estados para Vista Privada
  const [recomendadosPorLibro, setRecomendadosPorLibro] = useState([]);
  const [recomendadosPorGenero, setRecomendadosPorGenero] = useState([]);

  useEffect(() => {
    const cargarEscaparate = async () => {
      const token = localStorage.getItem("token");
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      try {
        // 1. Cargar  los datos públicos (para todos)
        const resPublica = await axios.get(`${URL}/api/recomendaciones/publicas`);
        setNovedades(resPublica.data.novedades);
        setTopVentas(resPublica.data.topVentas);
        setTendencias(resPublica.data.tendencias);

        // 2. Si hay token, carga los datos privados
        if (token) {
          setEsUsuarioRegistrado(true);
          const resPrivada = await axios.get(`${URL}/api/recomendaciones/privadas`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          setRecomendadosPorLibro(resPrivada.data.porLibro);
          setRecomendadosPorGenero(resPrivada.data.porGenero);
        } else {
          setEsUsuarioRegistrado(false);
        }
      } catch (error) {
        console.error("Error cargando el escaparate:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarEscaparate();
  }, []);

  if (cargando) return <h4 className="text-center mt-5">Preparando tu escaparate...</h4>;

  return (
    <div className="mt-4">
        
      {/* === SECCIÓN PERSONALIZADA (Solo aparece si está registrado) === */}
      {esUsuarioRegistrado && (
        <div className="mb-5">
          <h2 className="mb-4 fw-bold">Bienvenido de nuevo</h2>
          
          <div className="mb-5">
            <h4 className="border-bottom pb-2">Porque leíste "El Imperio Final"</h4>
            <CarruselLibros libros={recomendadosPorLibro} />
          </div>

          <div className="mb-5">
            <h4 className="border-bottom pb-2">Tus géneros favoritos</h4>
            <CarruselLibros libros={recomendadosPorGenero} />
          </div>
        </div>
      )}

      {/* === SECCIÓN GLOBAL (Aparece para TODO el mundo) === */}
      <div className="text-center mb-5 bg-light p-5 rounded-4 shadow-sm">
        <h1 className="fw-bold">Descubre tu próxima aventura</h1>
        <p className="text-muted">Explora los libros que están cautivando a miles de lectores.</p>
      </div>

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