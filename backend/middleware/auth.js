const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    //Buscar token creado en UsuarioController
    const token = req.header('Authorization');

    //Si no hay token, fuera
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        //limpiar Token
        const tokenLimpio = token.replace("Bearer ", "");

        // Verificar 
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

        // Guardar datos del usuario dentro de la petición (req)
        req.usuario = verificado; 
        
        next(); // Continuar

    } catch (error) {
        res.status(400).json({ message: "Token no válido o expirado." });
    }
};

module.exports = verificarToken;