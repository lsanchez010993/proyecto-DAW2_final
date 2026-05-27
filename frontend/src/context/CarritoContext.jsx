import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const CarritoContext = createContext();
const CARRITO_STORAGE_KEY = "carrito_quedelibros";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem(CARRITO_STORAGE_KEY);
      const carritoParseado = carritoGuardado ? JSON.parse(carritoGuardado) : [];
      return Array.isArray(carritoParseado) ? carritoParseado : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  // Función para añadir libros
  const agregarAlCarrito = (libro, tipoCompra = "fisico") => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => item._id === libro._id && item.tipo_compra === tipoCompra,
      );
      if (existe) {
        return prevCarrito.map((item) =>
          item._id === libro._id && item.tipo_compra === tipoCompra
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      
      return [
        ...prevCarrito,
        { ...libro, cantidad: 1, tipo_compra: tipoCompra },
      ];
    });
   
    toast.success("Libro anadido al carrito.");
  };

  const cambiarCantidad = (libroId, tipoCompra, delta) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) => {
          if (item._id !== libroId || item.tipo_compra !== tipoCompra) {
            return item;
          }
          return { ...item, cantidad: item.cantidad + delta };
        })
        .filter((item) => item.cantidad > 0),
    );
  };

  const eliminarDelCarrito = (libroId, tipoCompra) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter(
        (item) => !(item._id === libroId && item.tipo_compra === tipoCompra),
      ),
    );
    toast.success("Libro eliminado del carrito.");
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// Atajo (hook) para usar el carrito en cualquier lado
export const useCarrito = () => useContext(CarritoContext);