const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const verificarToken = require("../middleware/auth");
const bcrypt = require("bcryptjs"); 

// controlador para Auth
const {
  registrarUsuario,
  loginUsuario,
} = require("../controllers/usuarioController");

// ==========================================
// RUTAS PÚBLICAS (Auth)
// ==========================================

router.post("/", registrarUsuario);

router.post("/login", loginUsuario);

// ==========================================
// RUTA: Actualizar perfil propio y dirección
// ==========================================
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, apellidos, email, preferencias, direccion } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      {
        nombre,
        apellidos,
        email,
        gustos_literarios: preferencias,
        direccion,
      },
      { new: true, runValidators: true },
    ).select("-password");

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    // Error por nombre o email duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El nombre de usuario o email ya está en uso.",
      });
    }

    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
});


// ==========================================
// RUTA: Cambiar contraseña
// ==========================================
router.put('/cambiar-password', verificarToken, async (req, res) => {
    try {
        const { actual, nueva } = req.body;
        const usuario = await Usuario.findById(req.usuario.id); //

        // 1. Verificar si la contraseña actual es correcta
        const esValida = await bcrypt.compare(actual, usuario.password);
        if (!esValida) {
            return res.status(401).json({ message: "La contraseña actual no es correcta." });
        }

        // 2. Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nueva, salt);

        // 3. Guardar cambios
        await usuario.save();
        res.json({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error interno al cambiar la contraseña." });
    }
});
// ==========================================
// RUTAS DE ADMINISTRADOR
// ==========================================

// Obtener TODOS los usuarios (GET /api/usuarios)
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Eliminar usuario (DELETE /api/usuarios/:id)
router.delete("/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Cambiar ROL de usuario
router.put("/:id", async (req, res) => {
  try {
    const { rol } = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol: rol },
      { new: true },
    );
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol" });
  }
});

module.exports = router;
