import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

  async function actualizarEstadoCompra(usuarioId, compraId, estadoPedido) {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      await axios.patch(
        `${URL}/api/usuarios/admin/compras/${usuarioId}/${compraId}/estado`,
        { estado_pedido: estadoPedido },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUsuarios((prev) =>
        prev.map((u) => {
          if (u._id !== usuarioId) return u;
          return {
            ...u,
            biblioteca_digital: (u.biblioteca_digital || []).map((c) =>
              c._id === compraId ? { ...c, estado_pedido: estadoPedido } : c,
            ),
          };
        }),
      );

      toast.success("Estado del pedido actualizado.");
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "No se pudo actualizar el estado.",
      );
    }
  }

  return { usuarios, cargando, error, actualizarEstadoCompra };
}

