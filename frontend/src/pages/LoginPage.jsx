import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../context/AuthContext'; 

function LoginPage() {
  // 1. ESTADOS PARA LOS INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. HOOKS DE NAVEGACIÓN
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // 3. FUNCIÓN PARA ENVIAR EL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      // --- CAMBIO A AXIOS ---
      // Axios lanza un error automáticamente si el status no es 200 (ej: 401 o 400)
   
      const res = await axios.post(`${URL}/api/usuarios/login`, {
        email, 
        password
      });

      login(res.data);
      navigate("/");

    } catch (error) {
      console.error(error);
      

      const mensajeError = error.response?.data?.mensaje || "Error al iniciar sesión";
      alert("Error: " + mensajeError);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      
      {/* TARJETA BLANCA CENTRADA */}
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        
        <h3 className="text-center mb-4 fw-bold">Inicia sesión</h3>

        <form onSubmit={handleSubmit}>
          
          {/* INPUT EMAIL */}
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control py-2" 
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control py-2" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN AZUL GRANDE */}
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
            Iniciar Sesión
          </button>

        </form>

        {/* SEPARADOR */}
        <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">O continua con</span>
            <hr className="flex-grow-1" />
        </div>

        {/* BOTÓN GOOGLE */}
        <button 
            type="button" 
            className="btn btn-light w-100 d-flex align-items-center justify-content-center border py-2"
            onClick={() => alert("Función de Google próximamente")}
        >
            <svg className="me-2" width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9a8.998 8.998 0 0 0 .957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z"/>
            </svg>
            Google
        </button>

        {/* ENLACE A REGISTRO */}
        <div className="text-center mt-4">
            <span className="text-muted">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-primary text-decoration-none fw-bold">
                Regístrate aquí
            </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;