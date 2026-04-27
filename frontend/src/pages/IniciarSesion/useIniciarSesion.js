import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";


export default function useIniciarSesion() {
 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recordar, setRecordar] = useState(false);
  
    // HOOKS DE NAVEGACIÓN
  
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
  
    // Al cargar la página de login
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
  
      if (queryParams.get("expirado") === "true") {
        // Disparamos la notificación
        toast.error(APP_MESSAGES.NOTIFICATIONS.SESSION_EXPIRED, {
          id: "sesion-expirada-toast",
          duration: 4000,
          position: "top-center",
        });
    
        // Limpiamos la URL para quitar el ?expirado=true 
        navigate("/login", { replace: true });
      }
    }, [location, navigate]);

    // FUNCIÓN PARA ENVIAR EL FORMULARIO
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  
  
        const res = await axios.post(`${URL}/api/usuarios/login`, {
          email,
          password,
          recordarSesion: recordar
        });
        login(res.data, recordar);
  
        
        navigate("/");
      } catch (error) {
        console.error(error);
  
        const mensajeError =
          error.response?.data?.mensaje || APP_MESSAGES.NOTIFICATIONS.LOGIN_ERROR;
        toast.error("Error: " + mensajeError);
      }
    };
  
    return {
      email,
      setEmail,
      password,
      setPassword,
      recordar,
      setRecordar,
      handleSubmit,
    };
  }