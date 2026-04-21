import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoEditorialId, setEditandoEditorialId] = useState(null);
  const [nombreEditorialTemp, setNombreEditorialTemp] = useState("");

  // 1. Cargar usuarios al entrar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.get(`${URL}/api/usuarios`);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  // 2. NUEVA FUNCIÓN: Cambiar Rol
// 2. LÓGICA DE ROLES MEJORADA
  const handleSeleccionRol = (user, nuevoRol) => {
    if (nuevoRol === "editorial") {
      // Si elige editorial, abrimos el cajón y cargamos el nombre si ya tenía uno
      setEditandoEditorialId(user._id);
      setNombreEditorialTemp(user.nombre_editorial || "");
    } else {
      // Si es otro rol, confirmamos y guardamos directamente (borrando la editorial)
      
        setEditandoEditorialId(null);
        ejecutarCambioRol(user._id, nuevoRol, "");
      
    }
  };

  const ejecutarCambioRol = async (id, nuevoRol, nombreEditorial) => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem('token');

      await axios.put(`${URL}/api/usuarios/${id}`, 
        { rol: nuevoRol, nombre_editorial: nombreEditorial }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setUsuarios(usuarios.map(usuario => 
        usuario._id === id ? { ...usuario, rol: nuevoRol, nombre_editorial: nombreEditorial } : usuario
      ));

      toast.success("¡Rol actualizado correctamente!");
      setEditandoEditorialId(null); 
      
    } catch (error) {
      toast.error("Error al actualizar el rol");
    }
  };

  const guardarEditorial = (id) => {
    if (!nombreEditorialTemp.trim()) {
      return toast.error("El nombre de la editorial no puede estar vacío");
    }
    ejecutarCambioRol(id, "editorial", nombreEditorialTemp);
  };
  // 3. Función para eliminar
  const eliminarUsuario = async (id, nombre) => {
    if (window.confirm(`¿Seguro que quieres eliminar al usuario ${nombre}?`)) {
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token = localStorage.getItem('token');
        
        await axios.delete(`${URL}/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        fetchUsuarios(); 
      } catch (error) {
        toast.error("Error al eliminar usuario");
      }
    }
  };

  // 4. Función consultar libros
  const verHistorial = (usuario) => {
    const compras = usuario.compras_realizadas?.length || 0;
    const descargas = usuario.historial_descargas_gratuitas?.length || 0;
    toast.success(`Historial de ${usuario.nombre}:\n\n- Compras: ${compras}\n- Descargas: ${descargas}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestión de Usuarios</h2>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol (Permisos)</th>
              <th>Historial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user._id}>
                {/* Columna Usuario */}
                <td>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" 
                         style={{width: '40px', height: '40px', fontSize: '1.2rem'}}>
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="fw-bold mb-1">{user.nombre}</p>
                      <p className="text-muted mb-0 small">ID: {user._id.slice(-4)}</p>
                    </div>
                  </div>
                </td>
                
                {/* Columna Email */}
                <td>{user.email}</td>

                
{/* --- COLUMNA ROL --- */}
                <td style={{ minWidth: "220px" }}>
                  {user.rol === 'admin' ? (
                    /* Si es admin, mostramos una etiqueta bloqueada */
                    <div 
                      className="form-control form-control-sm fw-bold border-warning text-warning bg-light shadow-sm d-flex align-items-center" 
                      style={{ cursor: 'not-allowed', height: '31px' }}
                    >
                      Admin
                    </div>
                  ) : (
                    /* Si no es admin, mostramos el selector normal */
                    <>
                      <select 
                        className={`form-select form-select-sm fw-bold shadow-sm ${
                            (editandoEditorialId === user._id || user.rol === 'editorial') ? 'border-info text-info' : 
                            'border-secondary text-secondary'
                        }`}
                        value={editandoEditorialId === user._id ? "editorial" : user.rol}
                        onChange={(e) => handleSeleccionRol(user, e.target.value)}
                      >
                        <option value="cliente">Usuario</option>
                        <option value="editorial">Editor</option>
                        <option value="admin">Admin</option>
                      </select>

                      {/* CAJÓN AUTOEDITABLE PARA LA EDITORIAL */}
                      {editandoEditorialId === user._id && (
                        <div className="mt-2 animate__animated animate__fadeIn">
                          <div className="input-group input-group-sm shadow-sm rounded">
                            <input
                              type="text"
                              className="form-control border-info"
                              placeholder="Nombre de la editorial..."
                              value={nombreEditorialTemp}
                              onChange={(e) => setNombreEditorialTemp(e.target.value)}
                              autoFocus
                            />
                            <button 
                              className="btn btn-info text-white fw-bold px-3" 
                              onClick={() => guardarEditorial(user._id)}
                            >
                              ✓
                            </button>
                            <button 
                              className="btn btn-outline-danger px-3 fw-bold" 
                              onClick={() => setEditandoEditorialId(null)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Etiqueta visual de la editorial */}
                      {user.rol === 'editorial' && editandoEditorialId !== user._id && user.nombre_editorial && (
                        <div className="mt-2 d-flex justify-content-end animate__animated animate__fadeIn">
                          <span 
                            className="badge bg-info text-dark rounded-pill shadow-sm d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setEditandoEditorialId(user._id);
                              setNombreEditorialTemp(user.nombre_editorial);
                            }}
                          >
                            <span className="me-2">{user.nombre_editorial}</span>
                            <span style={{ fontSize: "0.85rem" }}>✏️</span>
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* Columna Historial */}
                <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => verHistorial(user)}>
                        Ver
                    </button>
                </td>

              {/* Columna Eliminar */}
                <td>
                  {user.rol !== 'admin' && (
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => eliminarUsuario(user._id, user.nombre)}
                      title="Eliminar usuario"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsuarios;