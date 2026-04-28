const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MESSAGES = require("../constants/messages");

// ==========================================
// REGISTRAR USUARIO
// ==========================================
async function registrarUsuario(req, res) {
  const { email, password, nombre } = req.body;

  try {
    // Valido los campos obligatorios
    if (!email || !password || !nombre) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.CAMPOS_OBLIGATORIOS });
    }

    // Formato de email con una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.EMAIL_FORMATO });
    }

    // Longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.PASSWORD_LONGITUD });
    }

    // Que la contraseña tenga al menos una mayúscula y un número
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.PASSWORD_MAYUSCULA_NUMERO });
    }
    // Verificar email
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.EMAIL_IN_USE });
    }

    // Verificar Nombre de Usuario
    const existeNick = await Usuario.findOne({ nombre });
    if (existeNick) {
      return res.status(400).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.NOMBRE_USUARIO_EN_USO });
    }

    // Crear usuario
    const usuario = new Usuario(req.body);

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Asignar rol por defecto.
    if (!usuario.rol) {
      usuario.rol = "usuario";
    }

    // Guardar usuario
    await usuario.save();

    res.json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.CREATE_SUCCESS });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: MESSAGES.ERRORS_REGISTRO_USER.SAVE_ERROR });
  }
}
// ==========================================
// LOGIN USUARIO
// ==========================================
async function loginUsuario(req, res) {
  const { email, password, recordarSesion } = req.body;

  try {
    // Buscar si el usuario existe por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ mensaje: MESSAGES.USUARIOS.NOT_FOUND });
    }

    // Verificar la contraseña
    const esCorrecto = await bcrypt.compare(password, usuario.password);

    if (!esCorrecto) {
      return res.status(401).json({ mensaje: MESSAGES.USUARIOS.INVALID_PASSWORD });
    }

    // GENERAR EL TOKEN con el ID y el ROL del usuario. Luego se utiliza para identificar libros guardados por cada usuario.
    const tiempoExpiracion = recordarSesion ? "7d" : "2h";

    // GENERAR EL TOKEN con el tiempo elegido
    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: tiempoExpiracion },
    );

    res.json({
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        gustos_literarios: usuario.gustos_literarios,
        direccion: usuario.direccion,
        nombre_editorial: usuario.nombre_editorial,
        lista_deseos: usuario.lista_deseos,
        perfil_afinidad: usuario.perfil_afinidad,
        avatar: usuario.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: MESSAGES.GENERAL.SERVER_ERROR });
  }
}
module.exports = {
  registrarUsuario,
  loginUsuario,
};
