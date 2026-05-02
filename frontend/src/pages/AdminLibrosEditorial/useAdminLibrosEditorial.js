import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function useAdminLibrosEditorial(usuario) {
  const [libros, setLibros] = useState([]);
  const [vistaListado, setVistaListado] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const librosPorPagina = 20;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: null, 
    datos: null,
  });

  const nombreEditorial = useMemo(
    () => (usuario?.rol === "editorial" ? (usuario?.nombre_editorial || "").trim() : ""),
    [usuario?.rol, usuario?.nombre_editorial],
  );

  useEffect(() => {
    if (!nombreEditorial) {
      setLibros([]);
      setTotalPaginas(1);
      return;
    }
    fetchLibros();
  
  }, [nombreEditorial, pagina]);

  const fetchLibros = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(
        `${URL}/api/libros?limit=${librosPorPagina}&page=${pagina}&editoriales=${encodeURIComponent(nombreEditorial)}`,
      );
      setLibros(res.data?.data || []);
      setTotalPaginas(res.data?.paginacion?.totalPaginas || 1);
    } catch (error) {
      setLibros([]);
      setTotalPaginas(1);
    }
  };

  const eliminarLibro = async (id) => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${URL}/api/libros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLibros();
    } catch (error) {
      toast.error("¡Error al eliminar el libro!");
    }
  };

  const handleDelete = (id, titulo) => {
    setModalConfig({
      isOpen: true,
      tipo: "ELIMINAR",
      datos: { id, titulo },
    });
  };

  function confirmarModal() {
    if (!modalConfig.datos) return;

    if (modalConfig.tipo === "ELIMINAR") {
      const { id } = modalConfig.datos;
      cerrarModal();
      eliminarLibro(id);
    }
  }
  function cerrarModal() {
    setModalConfig({ isOpen: false, tipo: null, datos: null });
  }
  return {
    nombreEditorial,
    libros,
    vistaListado,
    setVistaListado,
    pagina,
    setPagina,
    totalPaginas,
    confirmarModal,
    handleDelete,
    modalConfig,
    cerrarModal,
  };
}

