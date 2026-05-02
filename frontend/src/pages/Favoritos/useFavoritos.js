import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export function useFavoritos() {
  const { usuario, actualizarUsuario } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [libros, setLibros] = useState([]);

  const fetchFavoritos = async () => {
    setCargando(true);
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${URL}/api/usuarios/deseos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(res.data?.data || []);
    } catch (error) {
      setLibros([]);
      toast.error("No se pudieron cargar tus favoritos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();
    
  }, []);

  const quitarDeFavoritos = async (libroId) => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.put(
        `${URL}/api/usuarios/deseos/toggle`,
        { libroId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Mantener AuthContext sincronizado (porque lista_deseos se usa en varias vistas)
      if (usuario) {
        actualizarUsuario({ ...usuario, lista_deseos: res.data?.lista_deseos || [] });
      }

      // Refrescar lista visible
      setLibros((prev) => prev.filter((l) => l._id !== libroId));
      toast.success("Eliminado de favoritos.");
    } catch (error) {
      toast.error("No se pudo quitar de favoritos.");
    }
  };

  return { cargando, libros, quitarDeFavoritos, recargar: fetchFavoritos };
}

