import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Función para añadir libros
  const agregarAlCarrito = (libro) => {
    setCarrito((prevCarrito) => {
      
      const existe = prevCarrito.find((item) => item._id === libro._id);
      if (existe) {
        return prevCarrito.map((item) =>
          item._id === libro._id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      
      return [...prevCarrito, { ...libro, cantidad: 1 }];
    });
   
    toast.success("¡Libro añadido al carrito!");
  };

 
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  );
};

// Atajo (hook) para usar el carrito en cualquier lado
export const useCarrito = () => useContext(CarritoContext);