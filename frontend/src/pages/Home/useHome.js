import { useState, useEffect, useCallback, useRef } from "react";
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
  const [mejorValorados, setMejorValorados] = useState([]);
  // Estados para Vista Privada
  const [recomendadosPorLibro, setRecomendadosPorLibro] = useState([]);
  const [recomendadosPorGenero, setRecomendadosPorGenero] = useState([]);
  const [tituloReferencia, setTituloReferencia] = useState("");
  const [generoReferencia, setGeneroReferencia] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscandoBusqueda, setBuscandoBusqueda] = useState(false);
  const [catalogoCompleto, setCatalogoCompleto] = useState([]);
  const [catalogoInicializado, setCatalogoInicializado] = useState(false);
  const promesaCargaCatalogoRef = useRef(null);

  useEffect(() => {
    const cargarEscaparate = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      try {
        // 1. Cargar  los datos públicos (para todos)
        const resPublica = await axios.get(`${URL}/api/home/publicas`);
        setNovedades(resPublica.data.novedades || []);
        setTopVentas(resPublica.data.topVentas || []);
        setTendencias(resPublica.data.tendencias || []);
        setMejorValorados(resPublica.data.mejorValorados || []);
        
        // 2. Si hay token, carga los datos privados
        if (token) {
          const resPrivada = await axios.get(`${URL}/api/home/privadas`, {
            
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

  const cargarCatalogoCompleto = useCallback(async () => {
    if (catalogoInicializado) return catalogoCompleto;
    if (promesaCargaCatalogoRef.current) return promesaCargaCatalogoRef.current;

    const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    promesaCargaCatalogoRef.current = (async () => {
      const limite = 1000;
      let pagina = 1;
      let totalPaginas = 1;
      const acumulado = [];

      do {
        const res = await axios.get(`${URL}/api/libros?limit=${limite}&page=${pagina}`);
        const librosPagina = res.data?.data || [];
        totalPaginas = res.data?.paginacion?.totalPaginas || 1;
        acumulado.push(...librosPagina);
        pagina += 1;
      } while (pagina <= totalPaginas);

      setCatalogoCompleto(acumulado);
      setCatalogoInicializado(true);
      return acumulado;
    })();

    try {
      return await promesaCargaCatalogoRef.current;
    } finally {
      promesaCargaCatalogoRef.current = null;
    }
  }, [catalogoInicializado, catalogoCompleto]);

  useEffect(() => {
    let desmontado = false;

    const ejecutarBusqueda = async () => {
      const criterio = textoBusqueda.trim().toLowerCase();
      if (!criterio) {
        setResultadosBusqueda([]);
        return;
      }

      setBuscandoBusqueda(true);
      try {
        const libros = await cargarCatalogoCompleto();
        if (desmontado) return;

        const filtrados = libros.filter((libro) => {
          const campos = [libro.titulo, libro.autor, libro.editorial, libro.isbn];
          return campos.some((valor) =>
            String(valor || "").toLowerCase().includes(criterio),
          );
        });

        setResultadosBusqueda(filtrados);
      } catch (error) {
        if (!desmontado) {
          setResultadosBusqueda([]);
        }
        console.error(APP_MESSAGES.ERRORS.LOAD_BOOKS, error);
      } finally {
        if (!desmontado) {
          setBuscandoBusqueda(false);
        }
      }
    };

    ejecutarBusqueda();

    return () => {
      desmontado = true;
    };
  }, [textoBusqueda, cargarCatalogoCompleto]);

  return {
    usuario,
    novedades,
    topVentas,
    tendencias,
    recomendadosPorLibro,
    recomendadosPorGenero,
    mejorValorados,
    tituloReferencia,
    generoReferencia,
    cargando,
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    buscandoBusqueda,
  };
}
