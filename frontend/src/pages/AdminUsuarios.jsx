import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

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
  const cambiarRol = async (id, nuevoRol) => {
  
    if(!window.confirm(`¿Quieres cambiar el rol de este usuario a "${nuevoRol}"?`)) return;

    try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token = localStorage.getItem('token');

        await axios.put(`${URL}/api/usuarios/${id}`, 
            { rol: nuevoRol }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

      
        setUsuarios(usuarios.map(usuario => 
            usuario._id === id ? { ...usuario, rol: nuevoRol } : usuario
        ));

        toast.success("¡Rol actualizado correctamente!");
      

    } catch (error) {
       
        toast.error("Error al cambiar el rol");
    }
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
    toast.success(`📚 Historial de ${usuario.nombre}:\n\n- 🛒 Compras: ${compras}\n- ⬇️ Descargas: ${descargas}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👥 Gestión de Usuarios</h2>
      
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

                {/* --- COLUMNA ROL  --- */}
                <td>
                  <select 
                    className={`form-select form-select-sm fw-bold ${
                        user.rol === 'admin' ? 'border-warning text-warning' : 
                        user.rol === 'editorial' ? 'border-info text-info' : 'border-secondary text-secondary'
                    }`}
                    value={user.rol}
                    onChange={(e) => cambiarRol(user._id, e.target.value)}
                  >
                    <option value="cliente"> Usuario</option>
                    <option value="editorial"> Editor</option>
                    <option value="admin"> Admin</option>
                  </select>
                </td>

                {/* Columna Historial */}
                <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => verHistorial(user)}>
                        Ver
                    </button>
                </td>

                {/* Columna Eliminar */}
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarUsuario(user._id, user.nombre)}>
                    🗑️
                  </button>
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