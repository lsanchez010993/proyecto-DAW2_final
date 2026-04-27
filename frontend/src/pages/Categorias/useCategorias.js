import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export function useCategorias() {
  // Actúa como nuestra "base de datos de filas"
  const listaCategoriasGlobal = [
    "Ciencia Ficción",
    "Fantasía",
    "Misterio y Thriller",
    "Romance",
    "Terror",
    "Novela Histórica",
    "Biografía",
    "Desarrollo Personal",
    "Poesía",
    "Cómic y Manga",
    "Clásicos",
    "Aventura",
  ];

  // Estados Generales
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});

  // ==========================================
  // ESTADOS DEL SCROLL INFINITO
  // ==========================================
  const [librosPorCategoria, setLibrosPorCategoria] = useState({});
  const [paginaFilas, setPaginaFilas] = useState(1);
  const [cargandoFilas, setCargandoFilas] = useState(false);
  const [finDelCatalogo, setFinDelCatalogo] = useState(false);
  const filasPorPagina = 3;

  // Determina qué categorías mostrar (todas o solo las filtradas)
  const categoriasAProcesar = seleccionadas.length > 0 ? seleccionadas : listaCategoriasGlobal;

  // Carga un grupo especifico de libros a partir de la categoria
  const cargarLoteDeCategorias = async (pagina, categoriasActivas) => {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const loteActual = categoriasActivas.slice(inicio, fin);

    if (loteActual.length === 0) {
      setFinDelCatalogo(true);
      return;
    }

    setCargandoFilas(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      // Pide un máximo de 15 libros por categoría para no saturar
      const peticiones = loteActual.map((cat) =>
        axios.get(
          //encodeURIComponent traduce caracteres como espacios, ñ o acentos a caracteres seguros para no romper la URL
          `${URL}/api/libros?categorias=${encodeURIComponent(cat)}&limit=15`,
        ),
      );

      const respuestas = await Promise.all(peticiones);

      const nuevosDatos = {};
      respuestas.forEach((res, index) => {
        const nombreCat = loteActual[index];
        const librosDeEstaCat = res.data.data || [];
        // Solo muestra la categoría si realmente tiene libros
        if (librosDeEstaCat.length > 0) {
          nuevosDatos[nombreCat] = librosDeEstaCat;
        }
      });

      setLibrosPorCategoria((prev) => ({ ...prev, ...nuevosDatos }));

      // Si el lote actual era el último disponible, marco que ha llegado al final
      if (fin >= categoriasActivas.length) {
        setFinDelCatalogo(true);
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setCargandoFilas(false);
    }
  };

  // EFECTO 1: Cuando cambian los filtros (píldoras), se resetea todo y carga la página 1
  useEffect(() => {
    setLibrosPorCategoria({});
    setPaginaFilas(1);
    setFinDelCatalogo(false);
    cargarLoteDeCategorias(1, categoriasAProcesar);
  }, [seleccionadas]);

  // EFECTO 2: Cuando la página cambia (por hacer scroll), carga más categorias
  useEffect(() => {
    if (paginaFilas > 1) {
      cargarLoteDeCategorias(paginaFilas, categoriasAProcesar);
    }
  }, [paginaFilas]);

  // Envolvemos en useCallback para que la referencia no cambie en cada render
  const handleCargarMas = useCallback(() => {
    if (!cargandoFilas && !finDelCatalogo) {
      setPaginaFilas((prev) => prev + 1);
    }
  }, [cargandoFilas, finDelCatalogo]);

  // EVENTO: Detector de Scroll para cargar más datos
  useInfiniteScroll(handleCargarMas, cargandoFilas, !finDelCatalogo);

  // ==========================================
  // BUSCADOR AJAX LATERAL
  // ==========================================
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim().length > 0) {
        setBuscando(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          const res = await axios.get(`${URL}/api/libros?titulo=${encodeURIComponent(busqueda)}`);
          setResultadosBusqueda(res.data.data || []);
        } catch (error) {
          console.error(APP_MESSAGES.ERRORS.QUICK_SEARCH_ERROR);
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

  const toggleCategoria = (categoria) => {
    if (seleccionadas.includes(categoria)) {
      setSeleccionadas(seleccionadas.filter((c) => c !== categoria));
    } else {
      setSeleccionadas([...seleccionadas, categoria]);
    }
  };

  const toggleExpandir = (nombreCategoria) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [nombreCategoria]: !prev[nombreCategoria],
    }));
  };
  return {
    listaCategoriasGlobal,
    seleccionadas,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    buscando,
    categoriasExpandidas,
    librosPorCategoria,
    cargandoFilas,
    toggleCategoria,
    toggleExpandir,
    handleCargarMas,
  };
}
