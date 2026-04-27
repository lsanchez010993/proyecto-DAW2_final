import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export function useAutores() {
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Estados para el Directorio (Columna Derecha)
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);
  const [autoresPorLetra, setAutoresPorLetra] = useState([]);
  const [cargandoLetra, setCargandoLetra] = useState(false);

  // Estados para la vista inicial (Todos los autores)
  const [todosLosAutores, setTodosLosAutores] = useState([]);
  const [cargandoTodos, setCargandoTodos] = useState(false);

  // Estados Globales (Visualización de libros)
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);
  const [libros, setLibros] = useState([]);
  const [cargandoLibros, setCargandoLibros] = useState(false);

  // ==========================================
  // ESTADOS DEL SCROLL INFINITO
  // ==========================================
  const [limiteVisibles, setLimiteVisibles] = useState(25);

  // Cargar TODOS los autores al entrar a la página
  useEffect(() => {
    const fetchTodosLosAutores = async () => {
      setCargandoTodos(true);
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const res = await axios.get(`${URL}/api/libros/autores/todos`);
        setTodosLosAutores(res.data);
      } catch (error) {
        console.error(APP_MESSAGES.ERRORS.LOAD_AUTHORS);
      } finally {
        setCargandoTodos(false);
      }
    };
    fetchTodosLosAutores();
  }, []);

  // Buscador AJAX (Se activa al escribir)
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim().length > 0) {
        setBuscando(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros/autores/buscar?q=${busqueda}`);
          setResultadosBusqueda(res.data);
        } catch (error) {
          console.error(APP_MESSAGES.ERRORS.SEARCH_ERROR);
        } finally {
          setBuscando(false);
        }
      } else {
        setResultadosBusqueda([]);
      }
    };

    const temporizador = setTimeout(() => {
      fetchBusqueda();
    }, 300);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // Cargar autores por letra (Se activa al pulsar el abecedario)
  useEffect(() => {
    const fetchLetra = async () => {
      if (letraSeleccionada) {
        setCargandoLetra(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros/autores/letra?l=${letraSeleccionada}`);
          setAutoresPorLetra(res.data);
        } catch (error) {
          toast.error("Error al cargar la letra");
        } finally {
          setCargandoLetra(false);
        }
      }
    };
    fetchLetra();
  }, [letraSeleccionada]);

  // Buscar libros cuando se hace clic en un autor
  useEffect(() => {
    if (autorSeleccionado) {
      cargarLibrosDelAutor(autorSeleccionado);
    }
  }, [autorSeleccionado]);

  const cargarLibrosDelAutor = async (autor) => {
    setCargandoLibros(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros?autor=${encodeURIComponent(autor)}`);
      setLibros(res.data.data || []);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setCargandoLibros(false);
    }
  };

  // Resetear el límite del scroll infinito al cambiar de vista
  useEffect(() => {
    setLimiteVisibles(25);
  }, [letraSeleccionada, autorSeleccionado]);

  // Envolvemos en useCallback para que la referencia no cambie en cada render
  const handleCargarMas = useCallback(() => {
    setLimiteVisibles((prev) => prev + 25);
  }, []);

  // Detector de Scroll Infinito
  useInfiniteScroll(
    handleCargarMas,
    false, // No hay estado de "cargando" específico para el scroll local
    !autorSeleccionado, // Solo activa el scroll si no hay un autor seleccionado
  );

  // Determinar qué lista renderizar y aplicar el límite visible
  const listaActiva = letraSeleccionada ? autoresPorLetra : todosLosAutores;
  const autoresVisibles = listaActiva.slice(0, limiteVisibles);

  return {
    busqueda,
    setBusqueda,
    todosLosAutores,
    cargandoTodos,
    resultadosBusqueda,
    buscando,
    letraSeleccionada,
    setLetraSeleccionada,
    autoresPorLetra,
    cargandoLetra,
    autorSeleccionado,
    setAutorSeleccionado,
    libros,
    cargandoLibros,
    limiteVisibles,
    autoresVisibles,
    listaActiva,
  };
}
