import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";

export function useAdminLibrosAdministrador() {
  const [libros, setLibros] = useState([]);
  const [pestañaActiva, setPestañaActiva] = useState("catalogo");
  const [vistaListado, setVistaListado] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [librosGratuitos, setLibrosGratuitos] = useState([]);
  const [cargandoGratuitos, setCargandoGratuitos] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, tipo: null, datos: null });
  const librosPorPagina = 20;

  useEffect(() => {
    fetchLibros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  useEffect(() => {
    if (pestañaActiva === "gratuitos" && librosGratuitos.length === 0) {
      fetchLibrosGratuitos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pestañaActiva]);

  const fetchLibros = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(
        `${URL}/api/libros?limit=${librosPorPagina}&page=${pagina}`,
      );
      const librosObtenidos = res.data?.data || [];
      setLibros(librosObtenidos);
      setTotalPaginas(res.data?.paginacion?.totalPaginas || 1);
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.LOAD_BOOKS, error);
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
    setModalConfig({ isOpen: true, tipo: "ELIMINAR", datos: { id, titulo } });
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

  const fetchLibrosGratuitos = async () => {
    setCargandoGratuitos(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/gutendex/libros-gratuitos`);
      setLibrosGratuitos(res.data);
    } catch (error) {
      toast.error("Error al cargar la base de datos de libros gratuitos.");
    } finally {
      setCargandoGratuitos(false);
    }
  };

  const handleSincronizarGutendex = async () => {
    setSincronizando(true);
    const toastId = toast.loading(
      "Conectando con Gutendex... Esto puede tardar entre 10 y 15 minutos. No cierres la ventana.",
    );

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post(
        `${URL}/api/gutendex/sincronizar-gutendex`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(
        `¡Sincronización completa! Se guardaron/actualizaron ${res.data.total} libros.`,
        { id: toastId, duration: 5000 },
      );
      fetchLibrosGratuitos();
    } catch (error) {
      toast.error("Hubo un error al sincronizar con la API de Gutendex.", { id: toastId });
    } finally {
      setSincronizando(false);
    }
  };

  return {
    libros,
    pestañaActiva,
    setPestañaActiva,
    vistaListado,
    setVistaListado,
    pagina,
    setPagina,
    totalPaginas,
    librosGratuitos,
    cargandoGratuitos,
    sincronizando,
    handleDelete,
    modalConfig,
    confirmarModal,
    cerrarModal,
    handleSincronizarGutendex,
  };
}

