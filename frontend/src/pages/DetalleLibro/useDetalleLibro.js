import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { APP_MESSAGES } from "../../constants/messages";

export function useDetalleLibro(id) {
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { usuario, actualizarUsuario } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [resumenResenas, setResumenResenas] = useState({
    mediaPuntuacion: 0,
    totalResenas: 0,
  });
  const [permisoResena, setPermisoResena] = useState({
    canReview: false,
    hasReview: false,
    review: null,
    message: "",
  });
  const [guardandoResena, setGuardandoResena] = useState(false);

  // Estados para libros relacionados
  const [tituloSeccion, setTituloSeccion] = useState("Otros del autor");
  const [librosRelacionados, setLibrosRelacionados] = useState([]);

  // Estado para la Lista de Deseos
  const [enDeseos, setEnDeseos] = useState(() => {
    return usuario?.lista_deseos?.includes(id) || false;
  });

  useEffect(() => {
    setEnDeseos(usuario?.lista_deseos?.includes(id) || false);
  }, [usuario, id]);

  function obtenerToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  // ==========================================
  // FUNCIONES DE USUARIO (Deseos e Interacciones)
  // ==========================================
  async function registrarInteraccion(tipoAccion) {
    const token = obtenerToken();
    if (!token) return;

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${URL}/api/usuarios/interaccion`,
        { libroId: id, tipoAccion },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      console.error(APP_MESSAGES.ERRORS.RADAR_ERROR);
    }
  }

  async function registrarDescarga(titulo_guardado, categoria, libro_id) {
    const token = obtenerToken();
    if (!token) return;

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${URL}/api/usuarios/registrar-descarga-gratuita`,
        { titulo_guardado, categoria, libro_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      console.error(APP_MESSAGES.ERRORS.DESCARGAS_GRATUITAS_ERROR);
    }
  }

  async function toggleDeseos() {
    const token = obtenerToken();
    if (!token) return alert(APP_MESSAGES.NOTIFICATIONS.LOGIN_REQUIRED);

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.put(
        `${URL}/api/usuarios/deseos/toggle`,
        { libroId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setEnDeseos(!enDeseos);

      if (usuario) {
        actualizarUsuario({
          ...usuario,
          lista_deseos: res.data.lista_deseos,
        });
      }

      if (!enDeseos) registrarInteraccion("deseo");
    } catch {
      console.error(APP_MESSAGES.ERRORS.WISHLIST_ERROR);
    }
  }

  const cargarResenas = useCallback(async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/resenas/libro/${id}`);
      setResenas(res.data?.data || []);
      setResumenResenas({
        mediaPuntuacion: res.data?.resumen?.mediaPuntuacion || 0,
        totalResenas: res.data?.resumen?.totalResenas || 0,
      });
    } catch (error) {
      console.error("Error al cargar resenas:", error);
      setResenas([]);
      setResumenResenas({ mediaPuntuacion: 0, totalResenas: 0 });
    }
  }, [id]);

  const cargarPermisoResena = useCallback(async () => {
    const token = obtenerToken();
    if (!token) {
      setPermisoResena({
        canReview: false,
        hasReview: false,
        review: null,
        message: APP_MESSAGES.PAGES.DETALLE_LIBRO.RESENAS_LOGIN_REQUERIDO,
      });
      return;
    }

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/resenas/libro/${id}/permiso`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermisoResena({
        canReview: Boolean(res.data?.canReview),
        hasReview: Boolean(res.data?.hasReview),
        review: res.data?.review || null,
        message: "",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        APP_MESSAGES.PAGES.DETALLE_LIBRO.RESENAS_COMPRA_REQUERIDA;
      setPermisoResena({
        canReview: false,
        hasReview: false,
        review: null,
        message,
      });
    }
  }, [id]);

  async function guardarResena({ puntuacion, resena }) {
    const token = obtenerToken();
    if (!token) {
      throw new Error(APP_MESSAGES.PAGES.DETALLE_LIBRO.RESENAS_LOGIN_REQUERIDO);
    }

    setGuardandoResena(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.put(
        `${URL}/api/resenas/libro/${id}`,
        { puntuacion, resena },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await Promise.all([cargarResenas(), cargarPermisoResena()]);
      return {
        ok: true,
        message: APP_MESSAGES.PAGES.DETALLE_LIBRO.RESENAS_ENVIADA_OK,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message ||
          APP_MESSAGES.PAGES.DETALLE_LIBRO.RESENAS_COMPRA_REQUERIDA,
      };
    } finally {
      setGuardandoResena(false);
    }
  }

  // ==========================================
  // EFECTO PRINCIPAL: Cargar libro y relacionados
  // ==========================================
  useEffect(() => {
    const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const cargarRelacionados = async (libroPrincipal) => {
      if (!libroPrincipal || !libroPrincipal.autor) return;
      
      let filtradosAutor = [];

      try {
        const resAutor = await axios.get(
          `${URL}/api/libros/autor/${libroPrincipal.autor}`,
        );
        filtradosAutor = resAutor.data.filter(
          (b) => String(b._id) !== String(libroPrincipal._id),
        );
      } catch (error) {
        // Error capturado silenciosamente si no hay libros del autor
        console.log("Error buscando por autor:", error.response?.status || error.message);
      }

      if (filtradosAutor.length > 0) {
        setLibrosRelacionados(filtradosAutor);
        setTituloSeccion("Otros del autor");
      } else {
        const categoria = libroPrincipal.categorias?.[0];
        if (categoria) {
          try {
            const resCat = await axios.get(
              `${URL}/api/libros?categorias=${encodeURIComponent(categoria)}&limit=15`,
            );
            const librosDeEstaCat = resCat.data.data || [];
            const filtradosCat = librosDeEstaCat.filter(
              (libroCat) => String(libroCat._id) !== String(libroPrincipal._id),
            );

            setLibrosRelacionados(filtradosCat);
            setTituloSeccion(`Más de ${categoria}`);
          } catch (errorCategoria) {
            console.error(
              "Error al cargar recomendaciones por categoría:",
              errorCategoria,
            );
          }
        }
      }
    };

    setCargando(true);
    axios
      .get(`${URL}/api/libros/${id}`)
      .then((res) => {
        setLibro(res.data);
        cargarRelacionados(res.data);
      })
      .catch((err) => console.error(APP_MESSAGES.ERRORS.LOAD_BOOK, err))
      .finally(() => setCargando(false));
  }, [id]);

  useEffect(() => {
    cargarResenas();
  }, [cargarResenas]);

  useEffect(() => {
    cargarPermisoResena();
  }, [cargarPermisoResena]);

  return {
    libro,
    cargando,
    enDeseos,
    toggleDeseos,
    registrarInteraccion,
    registrarDescarga,
    librosRelacionados,
    tituloSeccion,
    resenas,
    resumenResenas,
    permisoResena,
    guardandoResena,
    guardarResena,
    recargarResenas: cargarResenas,
  };
}
