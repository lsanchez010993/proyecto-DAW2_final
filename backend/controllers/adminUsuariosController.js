
const Usuario = require("../models/Usuario");

const MESSAGES = require("../constants/messages");
// ==========================================
// OBTENER USUARIOS
// ==========================================
async function obtenerUsuarios (req, res) {
    try {
      const usuarios = await Usuario.find().select("-password");
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// ==========================================
// OBTENER HISTORIAL COMPLETO (Admin)
// ==========================================
async function obtenerHistorialUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find()
      .select(
        "nombre apellidos email rol biblioteca_digital historial_descargas_gratuitas createdAt",
      )
      .populate({
        path: "biblioteca_digital.libro",
        select: "titulo autor editorial portada_url",
      })
      .sort({ createdAt: -1 });

    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
  
  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  async function eliminarUsuario (req, res) {
    try {
      await Usuario.findByIdAndDelete(req.params.id);
      res.json({ message: MESSAGES.USUARIOS.DELETE_SUCCESS });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  // ==========================================
  // CAMBIAR ROL Y NOMBRE DE EDITORIAL
  // ==========================================
  async function cambiarRolYEditorial (req, res) {
    try {
      // 1. Extraer datos del req.body del frontend
      const { rol, nombre_editorial } = req.body;
  
      // Preparar el objeto con los datos a actualizar en MongoDB
      const datosActualizar = { rol: rol };
  
      // Si es editorial, guarda el nombre.
      if (rol === "editorial" && nombre_editorial) {
        datosActualizar.nombre_editorial = nombre_editorial;
      } else if (rol !== "editorial") {
        datosActualizar.nombre_editorial = "";
      }
  
      // actualizar la base de datos
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        datosActualizar,
        { new: true },
      );
  
      res.json(usuarioActualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MESSAGES.USUARIOS.ROLE_UPDATE_ERROR });
    }
  };
  module.exports = {
    obtenerUsuarios,
    obtenerHistorialUsuarios,
    eliminarUsuario,
    cambiarRolYEditorial,
  };