const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const MESSAGES = require("../constants/messages");


// ==========================================
// ACTUALIZAR PERFIL
// ==========================================
async function actualizarPerfil (req, res) {
  try {
    // Extraer nombre_editorial
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

    res.status(500).json({ message: MESSAGES.USUARIOS.UPDATE_ERROR });
  }
};

// ==========================================
// ACTUALIZAR LISTA DE DESEOS
// ==========================================
async function actualizarListaDeseos (req, res) {
  try {
    const { libroId } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    // FindIndex para convertir ambos a String para una comparación exacta
    const index = usuario.lista_deseos.findIndex(
      (id_guardado) => id_guardado.toString() === libroId.toString(),
    );

    if (index === -1) {
      // Si no está, lo añade
      usuario.lista_deseos.push(libroId);
    } else {
      // Si ya está, lo elimina
      usuario.lista_deseos.splice(index, 1);
    }

    await usuario.save();

    // Devolver la lista actualizada para que React pinte/despinte el corazón
    res.json({ lista_deseos: usuario.lista_deseos });
  } catch (error) {
    console.error("Error en lista de deseos:", error);
    res.status(500).json({ message: MESSAGES.USUARIOS.WISHLIST_ERROR });
  }
};

// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================
async function cambiarPassword (req, res) {
  try {
    const { actual, nueva } = req.body;
    const usuario = await Usuario.findById(req.usuario.id); //

    // 1. Verificar si la contraseña actual es correcta
    const esValida = await bcrypt.compare(actual, usuario.password);
    if (!esValida) {
      return res
        .status(401)
        .json({ message: "La contraseña actual no es correcta." });
    }

    // 2. Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(nueva, salt);

    // 3. Guardar cambios
    await usuario.save();
    res.json({ message: MESSAGES.USUARIOS.PASSWORD_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}






module.exports = {
 
  actualizarPerfil,
  actualizarListaDeseos,
  cambiarPassword,
 

};
