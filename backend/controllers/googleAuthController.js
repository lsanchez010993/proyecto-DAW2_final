const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const MESSAGES = require("../constants/messages");
const { construirRespuestaAuth } = require("../utils/authTokens");

async function generarNombreUnicoDesdeGoogle(nombreVisible, email) {
  const baseRaw = (nombreVisible || "").trim() || email.split("@")[0];
  const base = baseRaw.replace(/\s+/g, " ").slice(0, 35);
  let nombre = base || `user_${email.split("@")[0]}`.slice(0, 35);
  let i = 0;
  // Si el nombre ya existe, se le añade un numero al final
  while (await Usuario.findOne({ nombre })) {
    i += 1;
    nombre = `${base.slice(0, 28)}_${i}`;
    // Si la combinacion nombre + numero ya existe mas de 200 veces, se le añade un numero aleatorio para que sea unico
    if (i > 200) {
      nombre = `user_${crypto.randomBytes(4).toString("hex")}`;
      if (!(await Usuario.findOne({ nombre }))) break;
    }
  }
  return nombre;
}

// ==========================================
// GOOGLE SIGN-IN / SIGN-UP 
// ==========================================
async function googleAuth(req, res) {
  const { credential, recordarSesion } = req.body;

  if (!credential) {
    return res.status(400).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_TOKEN_REQUIRED });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_NOT_CONFIGURED });
  }

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_INVALID });
    }
    if (!payload.email_verified) {
      return res.status(401).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_EMAIL_UNVERIFIED });
    }

    const sub = payload.sub;
    const email = String(payload.email).toLowerCase().trim();
    const name = payload.name || "";
    const picture = payload.picture || "";
// Buscar si el usuario existe por el ID de Google
    let usuario = await Usuario.findOne({ googleId: sub });
    if (usuario) {
      if (picture && usuario.avatar !== picture) {
        usuario.avatar = picture;
        await usuario.save();
      }
      return res.json(construirRespuestaAuth(usuario, recordarSesion));
    }
    // Buscar si el usuario existe por el email
    usuario = await Usuario.findOne({ email });
    if (usuario) {
      if (usuario.googleId && usuario.googleId !== sub) {
        // Si el usuario ya tiene un ID de Google y no es el mismo, se devuelve un error
        return res.status(409).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_ACCOUNT_CONFLICT });
      }
      usuario.googleId = sub;
      if (picture) usuario.avatar = picture;
      await usuario.save();
      return res.json(construirRespuestaAuth(usuario, recordarSesion));
    }

    const nombre = await generarNombreUnicoDesdeGoogle(name, email);
    // Generar una contraseña aleatoria para el usuario
    const randomPass = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(randomPass, salt);

    usuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      // Asignar rol por defecto.
      rol: "cliente",
      googleId: sub,
      avatar: picture,
    });
    await usuario.save();

    return res.json(construirRespuestaAuth(usuario, recordarSesion));
  } catch (error) {
    console.error("googleAuth:", error);
    return res.status(401).json({ mensaje: MESSAGES.USUARIOS.GOOGLE_INVALID });
  }
}

module.exports = {
  googleAuth,
};
