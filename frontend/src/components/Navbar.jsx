import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext"; 
import logo from "../images/logo.jpg"; 

function Navbar() {
  const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth(); 

  const handleCerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo QuéDeLibros" height="40" className="d-inline-block align-text-top rounded" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* 1. MENÚ IZQUIERDO */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
          </ul>

          {/* 2. MENÚ DERECHO */}
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item me-3">
              <Link className="nav-link" to="/carrito">
                🛒 Carrito <span className="badge bg-primary">{cantidadTotal}</span>
              </Link>
            </li>

            {/* LÓGICA DE USUARIO */}
            {usuario ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Benvingut, {usuario.nombre}
                </a>
                
                <ul className="dropdown-menu dropdown-menu-end">
                  
                  {/* === 1. CONDICIÓN: ¿ES ADMIN? === */}
                  {usuario.rol === 'admin' ? (
                    <>
                      <li><Link className="dropdown-item" to="/admin/usuarios">Administrar usuarios</Link></li>
                      <li><Link className="dropdown-item" to="/admin/libros">Administrar libros</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><h6 className="dropdown-header">Historial (administrar)</h6></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/admin/compras">↳ Compras</Link></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/admin/descargas">↳ Descargas</Link></li>
                    </>
                  
                  // {/* === 2. CONDICIÓN: ¿ES EDITORIAL? === */}
                  ) : usuario.rol === 'editorial' ? (
                    <>
                      <li><Link className="dropdown-item" to="/perfil">Editar perfil</Link></li>
                      {/* Enlazamos "Nuestro catálogo" a la vista de administrar libros para que puedan subir/editar */}
                      <li><Link className="dropdown-item" to="/admin/libros">Nuestro catalogo</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><h6 className="dropdown-header">Historial</h6></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/historial/compras">↳ Compras</Link></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/historial/descargas">↳ Descargas</Link></li>
                    </>
                  
                  // {/* === 3. CONDICIÓN: ES CLIENTE NORMAL === */}
                  ) : (
                    <>
                      <li><Link className="dropdown-item" to="/perfil">Editar perfil</Link></li>
                      <li><Link className="dropdown-item" to="/favoritos">Favoritos</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><h6 className="dropdown-header">Historial</h6></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/historial/compras">↳ Compras</Link></li>
                      <li className="ps-3"><Link className="dropdown-item" to="/historial/descargas">↳ Descargas</Link></li>
                    </>
                  )}

                  {/* PARTE COMÚN PARA TODOS (Cerrar sesión) */}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleCerrarSesion}>
                      Tanca la sessio
                    </button>
                  </li>

                </ul>
              </li>
            ) : (
              // === INVITADO ===
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  👤 Iniciar sesión
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                  <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;