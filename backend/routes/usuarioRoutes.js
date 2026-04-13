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
    // [NUEVO] Extraemos nombre_editorial
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
// RUTA NUEVA: Añadir/Quitar libro de Lista de Deseos (Toggle)
// ==========================================
router.put("/deseos/toggle", verificarToken, async (req, res) => {
  try {
    const { libroId } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comprobamos si el libro ya está en su lista
    const index = usuario.lista_deseos.indexOf(libroId);

    if (index === -1) {
      // Si no está, lo añadimos
      usuario.lista_deseos.push(libroId);
    } else {
      // Si ya está, lo eliminamos
      usuario.lista_deseos.splice(index, 1);
    }

    await usuario.save();
    
    // Devolvemos la lista actualizada para que React pinte/despinte el corazón
    res.json({ lista_deseos: usuario.lista_deseos });
  } catch (error) {
    console.error("Error en lista de deseos:", error);
    res.status(500).json({ message: "Error al actualizar la lista de deseos" });
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
    // 1. Extraemos AMBOS datos del req.body que nos manda tu frontend perfecto
    const { rol, nombre_editorial } = req.body; 
    
    // 2. Preparamos el objeto con los datos a actualizar en MongoDB
    const datosActualizar = { rol: rol };
    
    // 3. Si es editorial, guardamos el nombre. Si le quitan el rol, se lo borramos.
    if (rol === "editorial" && nombre_editorial) {
      datosActualizar.nombre_editorial = nombre_editorial;
    } else if (rol !== "editorial") {
      datosActualizar.nombre_editorial = "";
    }

    // 4. Actualizamos la base de datos
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar, // Pasamos el objeto completo con la editorial
      { new: true },
    );
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar rol y editorial" });
  }
});
module.exports = router;
