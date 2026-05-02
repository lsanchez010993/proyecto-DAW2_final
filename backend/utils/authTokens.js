const jwt = require("jsonwebtoken");

function expiresInSesion(recordarSesion) {
  return recordarSesion ? "7d" : "2h";
}

function usuarioPublicoRespuesta(usuario) {
  return {
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
  };
}

function construirRespuestaAuth(usuario, recordarSesion) {
  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: expiresInSesion(recordarSesion) },
  );
  return {
    token,
    usuario: usuarioPublicoRespuesta(usuario),
  };
}

module.exports = {
  construirRespuestaAuth,
};
