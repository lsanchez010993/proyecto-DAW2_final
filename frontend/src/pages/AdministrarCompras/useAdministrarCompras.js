import { useEffect, useState } from "react";
import axios from "axios";

export function useAdministrarCompras() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        setCargando(true);
        setError(null);

        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const res = await axios.get(`${URL}/api/usuarios/admin/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelado) setUsuarios(res.data || []);
      } catch (e) {
        if (!cancelado) setError(e);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  return { usuarios, cargando, error };
}

