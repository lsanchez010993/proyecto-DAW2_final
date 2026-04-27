const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verificarToken = require("../middleware/auth");

const controllerUusuario = require("../controllers/usuarioController");
const adminRecomendaciones = require("../controllers/adminRecomendaciones");
const adminUsuariosController = require("../controllers/adminUsuariosController");
const MESSAGES = require("../constants/messages");


// ==========================================
// VERIFICAR SI EL USUARIO ES ADMIN
// ==========================================
const requireAdmin = (req, res, next) => {
    if (req?.usuario?.rol !== "admin") {
      return res.status(403).json({ message: MESSAGES.USUARIOS.UNAUTHORIZED });
    }
    next();
  };



// ==========================================
// RUTAS PÚBLICAS (Auth)
// ==========================================

router.post("/", authController.registrarUsuario);
router.post("/login", authController.loginUsuario);

// ==========================================
// 2. PERFIL DEL USUARIO (Requieren Token)
// ==========================================

router.put("/perfil", verificarToken, controllerUusuario.actualizarPerfil);
router.put("/deseos/toggle", verificarToken, controllerUusuario.actualizarListaDeseos);
router.put("/cambiar-password", verificarToken, controllerUusuario.cambiarPassword);

// ==========================================
// 3. ADMINISTRACIÓN (Requieren Token + Admin)
// ==========================================

router.get("/", verificarToken, requireAdmin, adminUsuariosController.obtenerUsuarios);
router.delete("/:id", verificarToken, requireAdmin, adminUsuariosController.eliminarUsuario);
router.put("/:id", verificarToken, requireAdmin,adminUsuariosController.cambiarRolYEditorial);
  


module.exports = router;