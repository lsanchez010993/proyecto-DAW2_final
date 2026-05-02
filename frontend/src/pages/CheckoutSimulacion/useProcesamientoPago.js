import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";

export function useProcesamientoPago() {
  const { usuario } = useAuth();
  const { carrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [tarjeta, setTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [titular, setTitular] = useState("");
  const [cvv, setCvv] = useState("");
  const [enviando, setEnviando] = useState(false);

  const resumen = useMemo(() => {
    const lineas = carrito.map((item) => {
      const tipo = item.tipo_compra || "fisico";
      const precio = item.precio?.[tipo] || 0;
      return { ...item, tipo, precio, subtotal: precio * item.cantidad };
    });
    const total = lineas.reduce((acc, l) => acc + l.subtotal, 0);
    return { lineas, total: total.toFixed(2) };
  }, [carrito]);

  const requiereLogin = !usuario;
  const carritoVacio = carrito.length === 0;

  async function finalizarCompra() {
    if (requiereLogin) {
      toast.error("Necesitas iniciar sesión para comprar.");
      navigate("/login");
      return;
    }

    if (carritoVacio) {
      toast.error("No hay productos en el carrito.");
      navigate("/carrito");
      return;
    }

    try {
      setEnviando(true);
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const items = carrito.map((item) => ({
        libroId: item._id,
        tipo_compra: item.tipo_compra || "fisico",
        cantidad: item.cantidad,
      }));

      await axios.post(
        `${URL}/api/usuarios/compras`,
        { items },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      vaciarCarrito();
      toast.success("Compra registrada correctamente (simulación).");
      navigate("/historial/compras");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "No se pudo completar la compra. Inténtalo de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarCompra(e) {
    e.preventDefault();
    return finalizarCompra();
  }

  return {
    requiereLogin,
    carritoVacio,
    confirmarCompra,
    finalizarCompra,
    resumen,
    enviando,
    tarjeta,
    setTarjeta,
    vencimiento,
    setVencimiento,
    titular,
    setTitular,
    cvv,
    setCvv,
  };
}