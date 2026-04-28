import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { APP_MESSAGES } from "../../constants/messages";

export default function useRegistroUser() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState(null);

  const navigate = useNavigate();

  function validarDatos(nombre, email, password) {
    if ([nombre, email, password].includes('')) {
        setAlerta({ msg: APP_MESSAGES.ERRORS_REGISTRO_USER.CAMPOS_OBLIGATORIOS, error: true });
        return false; 
      }
    // Validar formato de email con una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlerta({ msg: APP_MESSAGES.ERRORS_REGISTRO_USER.EMAIL_FORMATO, error: true });
      return false;
    }

    // Validar longitud y seguridad de la contraseña
    if (password.length < 6) {
      setAlerta({ msg: APP_MESSAGES.ERRORS_REGISTRO_USER.PASSWORD_LONGITUD, error: true });
      return false;
    }

    // Validar que la contraseña tenga al menos una mayúscula y un número
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setAlerta({ msg: APP_MESSAGES.ERRORS_REGISTRO_USER.PASSWORD_MAYUSCULA_NUMERO, error: true });
      return false;
    }
    return true;
  }
  // Conectar con el backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarDatos(nombre, email, password)) {
        return; // <-- Detiene el submit si los datos no son válidos
      }

    try {
      // URL inteligente (Nube o Local)
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      // Usamos esa variable en la petición
      await axios.post(`${URL}/api/usuarios`, { nombre, email, password });

      setAlerta({ msg: APP_MESSAGES.ERRORS_REGISTRO_USER.CREATE_SUCCESS, error: false });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setAlerta({
        msg: error.response?.data?.mensaje || APP_MESSAGES.ERRORS_REGISTRO_USER.SAVE_ERROR,
        error: true,
      });
    }
  };
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
