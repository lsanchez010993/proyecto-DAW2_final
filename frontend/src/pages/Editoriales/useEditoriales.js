import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";

export function useEditoriales() {
  const [listaEditoriales, setListaEditoriales] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editorialesExpandidas, setEditorialesExpandidas] = useState({});

  const [librosPorEditorial, setLibrosPorEditorial] = useState({});
  const [paginaFilas, setPaginaFilas] = useState(1);
  const [cargandoFilas, setCargandoFilas] = useState(false);
  const [finDelCatalogo, setFinDelCatalogo] = useState(false);
  const filasPorPagina = 3;

  const editorialesAProcesar = seleccionadas.length > 0 ? seleccionadas : listaEditoriales;

  useEffect(() => {
    cargarEditorialesUnicas();
  }, []);

  const cargarEditorialesUnicas = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros/editoriales/unicas`);
      setListaEditoriales(res.data);
    } catch (error) {
      toast.error(APP_MESSAGES.ERRORS.LOAD_EDITORS);
    }
  };

  const cargarLoteDeEditoriales = async (pagina, editorialesActivas) => {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const loteActual = editorialesActivas.slice(inicio, fin);

    if (loteActual.length === 0) {
      setFinDelCatalogo(true);
      return;
    }

    setCargandoFilas(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      
      const peticiones = loteActual.map((ed) =>
        axios.get(`${URL}/api/libros?editoriales=${encodeURIComponent(ed)}&limit=15`)
      );
      
      const respuestas = await Promise.all(peticiones);
      
      const nuevosDatos = {};
      respuestas.forEach((res, index) => {
        const nombreEd = loteActual[index];
        const librosDeEstaEd = res.data.data || [];
        if (librosDeEstaEd.length > 0) {
          nuevosDatos[nombreEd] = librosDeEstaEd;
        }
      });

      setLibrosPorEditorial((prev) => ({ ...prev, ...nuevosDatos }));
      
      if (fin >= editorialesActivas.length) {
        setFinDelCatalogo(true);
      }
    } catch (error) {
      toast.error(APP_MESSAGES.ERRORS.LOAD_BOOKS);
    } finally {
      setCargandoFilas(false);
    }
  };

  useEffect(() => {
    if (listaEditoriales.length === 0) return;

    setLibrosPorEditorial({});
    setPaginaFilas(1);
    setFinDelCatalogo(false);
    cargarLoteDeEditoriales(1, editorialesAProcesar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionadas, listaEditoriales]);

  useEffect(() => {
    if (paginaFilas > 1) {
      cargarLoteDeEditoriales(paginaFilas, editorialesAProcesar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaFilas]);

  const editorialesFiltradas = listaEditoriales.filter((editorial) =>
    editorial.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleEditorial = (editorial) => {
    if (seleccionadas.includes(editorial)) {
      setSeleccionadas(seleccionadas.filter((e) => e !== editorial));
    } else {
      setSeleccionadas([...seleccionadas, editorial]);
    }
  };

  const toggleExpandir = (nombreEditorial) => {
    setEditorialesExpandidas(prev => ({
      ...prev,
      [nombreEditorial]: !prev[nombreEditorial]
    }));
  };

  const cargarMas = useCallback(() => {
    if (!cargandoFilas && !finDelCatalogo) {
      setPaginaFilas((prev) => prev + 1);
    }
  }, [cargandoFilas, finDelCatalogo]);

  return {
    listaEditoriales,
    seleccionadas,
    setSeleccionadas,
    busqueda,
    setBusqueda,
    editorialesExpandidas,
    librosPorEditorial,
    cargandoFilas,
    finDelCatalogo,
    editorialesFiltradas,
    toggleEditorial,
    toggleExpandir,
    cargarMas
  };
}
