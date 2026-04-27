import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function useRegistroUser() {

    const [nombre, setNombre] = useState('');     
    const [email, setEmail] = useState('');       
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState(null);   
  
    const navigate = useNavigate();
  
    // Conectar con el backend)
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if([nombre, email, password].includes('')) {
          setAlerta({ msg: "Todos los campos son obligatorios", error: true });
          return;
      }
  
      try {
          // URL inteligente (Nube o Local)
          const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
          // Usamos esa variable en la petición
          await axios.post(`${URL}/api/usuarios`, { nombre, email, password });
          
          setAlerta({ msg: "¡Cuenta creada con éxito! Redirigiendo...", error: false });
          
          setTimeout(() => {
              navigate('/login');
          }, 2000);
  
      } catch (error) {
          setAlerta({ 
              msg: error.response?.data?.msg || "Hubo un error", 
              error: true 
          });
      }
    }
    return {
        nombre,
        setNombre,
        email,
        setEmail,
        password,
        setPassword,
        alerta,
        setAlerta,
        handleSubmit,
    };
}