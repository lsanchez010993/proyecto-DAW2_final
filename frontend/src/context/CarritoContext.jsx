import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

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
   
    toast.success("¡Libro añadido al carrito!");
  };

  const vaciarCarrito = () => setCarrito([]);
 
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, vaciarCarrito, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// Atajo (hook) para usar el carrito en cualquier lado
export const useCarrito = () => useContext(CarritoContext);