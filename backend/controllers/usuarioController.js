const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// ==========================================
// REGISTRAR USUARIO
// ==========================================
const registrarUsuario = async (req, res) => {
  const { email, password, nombre } = req.body;

  try {
    // Verificar email
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ mensaje: "El email está en uso" });
    }

    // Verificar Nombre de Usuario 
    const existeNick = await Usuario.findOne({ nombre });
    if (existeNick) {
      return res.status(400).json({ mensaje: "El nombre de usuario está en uso" });
    }

    // Crear usuario
    const usuario = new Usuario(req.body);

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Asignar rol por defecto.
    if (!usuario.rol) {
        usuario.rol = 'usuario';
    }

    // Guardar usuario
    await usuario.save();

    res.json({ mensaje: "¡Usuario creado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al guardarr" });
  }
};


const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar si el usuario existe por email
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        const esCorrecto = await bcrypt.compare(password, usuario.password);

        if (!esCorrecto) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // GENERAR EL TOKEN con el ID y el ROL del usuario. Luego se utiliza para identificar libros guardados por cada usuario.
        const token = jwt.sign(
            { 
                id: usuario._id, 
                rol: usuario.rol 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }     
        );

       
        res.json({
            token, 
            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};