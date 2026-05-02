const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verificarToken = require("../middleware/auth");
const controllerUusuario = require("../controllers/usuarioController");
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
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ==========================================
// PERFIL DEL USUARIO (Requieren Token)
// ==========================================

router.put("/perfil", verificarToken, controllerUusuario.actualizarPerfil);
router.put("/deseos/toggle", verificarToken, controllerUusuario.actualizarListaDeseos);
router.get("/deseos", verificarToken, controllerUusuario.listarDeseos);
router.put("/cambiar-password", verificarToken, controllerUusuario.cambiarPassword);

// ==========================================
// HISTORIAL DE COMPRAS Y DESCARGA GRATUITA
// ==========================================
router.get("/compras", verificarToken, controllerUusuario.listarCompras);
router.post("/compras",verificarToken, controllerUusuario.compraSimulada);
router.get("/descargas-gratuitas",verificarToken, controllerUusuario.listarDescargasGratuitas);
router.post("/registrar-descarga-gratuita", verificarToken, controllerUusuario.registrarDescargasGratuitas);
router.post("/interaccion", verificarToken, controllerUusuario.registrarInteraccionYSumarAfinidad);


// ==========================================
//  ADMINISTRACIÓN (Requieren Token + Admin)
// ==========================================

router.get("/", verificarToken, requireAdmin, adminUsuariosController.obtenerUsuarios);
router.get("/admin/historial", verificarToken, requireAdmin, adminUsuariosController.obtenerHistorialUsuarios);
router.delete("/:id", verificarToken, requireAdmin, adminUsuariosController.eliminarUsuario);
router.put("/:id", verificarToken, requireAdmin,adminUsuariosController.cambiarRolYEditorial);
  


module.exports = router;