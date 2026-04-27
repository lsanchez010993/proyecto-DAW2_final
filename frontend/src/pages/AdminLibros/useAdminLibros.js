import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";
export function useAdminLibros(usuario) {
    const [libros, setLibros] = useState([]);
    const [pestañaActiva, setPestañaActiva] = useState("catalogo");
    const [vistaListado, setVistaListado] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [librosGratuitos, setLibrosGratuitos] = useState([]);
    const [cargandoGratuitos, setCargandoGratuitos] = useState(false);
    const [sincronizando, setSincronizando] = useState(false);
    const librosPorPagina = 20;

    useEffect(() => {
        if (usuario) {
          fetchLibros();
        }
      }, [usuario, pagina]);
    
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
    
          if (res.data.data) {
            let librosObtenidos = res.data.data;
    
            // ---  FILTRADO POR ROL ---
            // Si el usuario tiene rol 'editorial', filtar el array para dejar solo sus libros
            if (usuario.rol === "editorial") {
              librosObtenidos = librosObtenidos.filter(
                (libro) =>
                  libro.creador === usuario._id || libro.usuario === usuario._id,
              );
            }
    
            setLibros(librosObtenidos);
            setTotalPaginas(res.data.paginacion?.totalPaginas || 1);
          } else {
            setLibros([]);
            setTotalPaginas(1);
          }
        } catch (error) {
          console.error(APP_MESSAGES.ERRORS.LOAD_BOOKS, error);
        }
      };
    
      // 2. Función Eliminar
      const handleDelete = async (id, titulo) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${titulo}"?`)) {
          try {
            const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
            const token =
              localStorage.getItem("token") || sessionStorage.getItem("token");
    
            await axios.delete(`${URL}/api/libros/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            // recargar la lista
            fetchLibros();
          } catch (error) {
            toast.error("¡Error al eliminar el libro!");
          }
        }
      };
      // ==========================================
      // FUNCIONES PARA LIBROS GRATUITOS (GUTENDEX)
      // ==========================================
      const fetchLibrosGratuitos = async () => {
        setCargandoGratuitos(true);
        try {
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          // NOTA: Ajusta la ruta '/api/admin/libros-gratuitos' según cómo la hayas montado en tu server
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
          
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
    
          const res = await axios.post(
            `${URL}/api/gutendex/sincronizar-gutendex`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
    
          toast.success(
            `¡Sincronización completa! Se guardaron/actualizaron ${res.data.total} libros.`,
            { id: toastId, duration: 5000 },
          );
          fetchLibrosGratuitos(); // Recarga la lista para ver los nuevos
        } catch (error) {
          toast.error("Hubo un error al sincronizar con la API de Gutendex.", {
            id: toastId,
          });
        } finally {
          setSincronizando(false);
        }
      };
    return {
        // Estados
        libros, pestañaActiva, setPestañaActiva, vistaListado, setVistaListado,
        pagina, setPagina, totalPaginas, librosGratuitos, cargandoGratuitos, sincronizando,
        // Funciones
        handleDelete, handleSincronizarGutendex
      };
      
    }