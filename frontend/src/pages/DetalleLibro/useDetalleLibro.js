import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { APP_MESSAGES } from "../../constants/messages";

export function useDetalleLibro(id) {
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { usuario, actualizarUsuario } = useAuth();

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

  // ==========================================
  // FUNCIONES DE USUARIO (Deseos e Interacciones)
  // ==========================================
  async function registrarInteraccion(tipoAccion) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${URL}/api/usuarios/interaccion`,
        { libroId: id, tipoAccion },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.RADAR_ERROR);
    }
  }

  async function registrarDescarga(titulo_guardado, categoria, libro_id) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${URL}/api/usuarios/registrar-descarga-gratuita`,
        { titulo_guardado, categoria, libro_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.DESCARGAS_GRATUITAS_ERROR);
    }
  }

  async function toggleDeseos() {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.WISHLIST_ERROR);
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

  return {
    libro,
    cargando,
    enDeseos,
    toggleDeseos,
    registrarInteraccion,
    registrarDescarga,
    librosRelacionados,
    tituloSeccion,
  };
}
