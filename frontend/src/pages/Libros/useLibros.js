import { useState, useEffect } from "react";
import axios from "axios";

import { APP_MESSAGES } from "../../constants/messages";

export function useLibros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const librosPorPagina = 20;

  useEffect(() => {
    fetchLibros();
  }, [pagina]);

  async function fetchLibros() {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/libros?limit=${librosPorPagina}&page=${pagina}`);

      if (res.data.data) {
        let librosObtenidos = res.data.data;

        setLibros(librosObtenidos);
        setTotalPaginas(res.data.paginacion?.totalPaginas || 1);
      } else {
        setLibros([]);
        setTotalPaginas(1);
      }
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.LOAD_BOOKS, error);
    } finally {
        setCargando(false); 
      }
  }

  return {
    libros,
    cargando,
    pagina,
    totalPaginas,
    setPagina,
  };
}
