import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { APP_MESSAGES } from "../../constants/messages";

export function useAdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoEditorialId, setEditandoEditorialId] = useState(null);
  const [nombreEditorialTemp, setNombreEditorialTemp] = useState("");
  
  // Estado genérico para el modal de confirmación
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: null, // 'ROL' o 'ELIMINAR'
    datos: null
  });

  // 1. Cargar usuarios al entrar
  useEffect(() => {
    fetchUsuarios();
  }, []);

   async function fetchUsuarios()  {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem('token') || sessionStorage.getItem("token");
      const res = await axios.get(`${URL}/api/usuarios`, { headers: { 'Authorization': `Bearer ${token}` }  });
      setUsuarios(res.data);
    } catch (error) {
      console.error(APP_MESSAGES.ERRORS.LOAD_USERS, error);
    }
  };

  
  function handleSeleccionRol(user, nuevoRol) {
    if (nuevoRol === "editorial") {
      setEditandoEditorialId(user._id);
      setNombreEditorialTemp(user.nombre_editorial || "");
    } else {
      // Abrir el modal genérico configurado para 'ROL'
      setModalConfig({
        isOpen: true,
        tipo: 'ROL',
        datos: { user, nuevoRol }
      });
    }
  }

  function confirmarModal() {
    if (!modalConfig.datos) return;

    if (modalConfig.tipo === 'ROL') {
      const { user, nuevoRol } = modalConfig.datos;
      setEditandoEditorialId(null);
      ejecutarCambioRol(user._id, nuevoRol, "");
    } else if (modalConfig.tipo === 'ELIMINAR') {
      const { user } = modalConfig.datos;
      ejecutarEliminarUsuario(user._id);
    }
    
    cerrarModal();
  }

  function cerrarModal() {
    setModalConfig({ isOpen: false, tipo: null, datos: null });
  }

  async function ejecutarCambioRol(id, nuevoRol, nombreEditorial) {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem('token') || sessionStorage.getItem("token");

      await axios.put(`${URL}/api/usuarios/${id}`, 
        { rol: nuevoRol, nombre_editorial: nombreEditorial }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setUsuarios(usuarios.map(function (usuario) {
        return usuario._id === id ? { ...usuario, rol: nuevoRol, nombre_editorial: nombreEditorial } : usuario;
      }));

      toast.success("¡Rol actualizado correctamente!");
      setEditandoEditorialId(null); 
      
    } catch (error) {
      toast.error("Error al actualizar el rol");
    }
  }

  function guardarEditorial(id) {
    if (!nombreEditorialTemp.trim()) {
      return toast.error("El nombre de la editorial no puede estar vacío");
    }
    ejecutarCambioRol(id, "editorial", nombreEditorialTemp);
  }

  // Función para confirmar eliminación de usuario
  function confirmarEliminacionUsuario(user) {
    setModalConfig({
      isOpen: true,
      tipo: 'ELIMINAR',
      datos: { user }
    });
  }

  async function ejecutarEliminarUsuario(id) {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem('token') || sessionStorage.getItem("token");
      
      await axios.delete(`${URL}/api/usuarios/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      
      fetchUsuarios(); 
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  }

  // 4. Función consultar libros
  function verHistorial(usuario) {
    const compras = usuario.compras_realizadas?.length || 0;
    const descargas = usuario.historial_descargas_gratuitas?.length || 0;
    toast.success(`Historial de ${usuario.nombre}:\n\n- Compras: ${compras}\n- Descargas: ${descargas}`);
  }

  return {
    usuarios,
    editandoEditorialId, setEditandoEditorialId,
    nombreEditorialTemp, setNombreEditorialTemp,
    handleSeleccionRol,
    guardarEditorial,
    confirmarEliminacionUsuario,
    verHistorial,
    modalConfig,
    confirmarModal,
    cerrarModal
  };
}