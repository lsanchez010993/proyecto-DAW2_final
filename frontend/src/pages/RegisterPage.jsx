import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {

  const [nombre, setNombre] = useState('');     
  const [email, setEmail] = useState('');       
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState(null);   

  const navigate = useNavigate();

  // Conectar con backend)
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
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        
        <h3 className="text-center mb-4 fw-bold">Crear Cuenta</h3>

        {/* ALERTA VISUAL */}
        {alerta && (
            <div className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} text-center`}>
                {alerta.msg}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. CAMPO NOMBRE DE USUARIO (NICK) */}
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control py-2" 
              placeholder="Nombre de usuario"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          {/* 2. CAMPO EMAIL */}
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control py-2" 
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* 3. CAMPO PASSWORD */}
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control py-2" 
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* SEPARADOR */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">O continua con:</span>
            <hr className="flex-grow-1" />
          </div>

          {/* BOTÓN GOOGLE */}
          <button 
            type="button" 
            className="btn btn-light w-100 d-flex align-items-center justify-content-center border mb-4 py-2"
          >
            <svg className="me-2" width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9a8.998 8.998 0 0 0 .957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z"/>
            </svg>
            Google
          </button>

          {/* BOTÓN REGISTRARSE */}
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
            Registrarse
          </button>
        </form>

        <div className="mt-4 text-center">
            <Link to="/login" className="text-decoration-none text-muted small">
                ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;