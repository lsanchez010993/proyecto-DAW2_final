import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { APP_MESSAGES } from "../../constants/messages";

export default function useHome() {
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
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      try {
        // 1. Cargar  los datos públicos (para todos)
        const resPublica = await axios.get(`${URL}/api/home/publicas`);
        setNovedades(resPublica.data.novedades);
        setTopVentas(resPublica.data.topVentas);
        setTendencias(resPublica.data.tendencias);

        // 2. Si hay token, carga los datos privados
        if (token) {
          const resPrivada = await axios.get(`${URL}/api/home/privadas`, {
            //Se envía el token en las cabeceras (headers) HTTP. El estándar de seguridad dicta que se envíe con la palabra clave "Bearer" seguida del token.
            headers: { Authorization: `Bearer ${token}` },
          });
          //Se actualizan los estados con los datos recibidos de la API.
          setRecomendadosPorLibro(resPrivada.data.porLibro);
          setRecomendadosPorGenero(resPrivada.data.porGenero);
          setTituloReferencia(resPrivada.data.tituloReferencia);
          setGeneroReferencia(resPrivada.data.generoReferencia);
        }
      } catch (error) {
        console.error(APP_MESSAGES.ERRORS.LOAD_SHOWCASE, error);
      } finally {
        setCargando(false);
      }
    };

    cargarEscaparate();
  }, []);

  return {
    usuario,
    novedades,
    topVentas,
    tendencias,
    recomendadosPorLibro,
    recomendadosPorGenero,
    tituloReferencia,
    generoReferencia,
    cargando,
  };
}
