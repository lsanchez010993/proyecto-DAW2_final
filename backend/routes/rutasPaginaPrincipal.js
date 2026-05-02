const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/auth");
const adminRecomendaciones = require("../controllers/paginaPrincipalController");


router.get("/publicas", adminRecomendaciones.cargarRecomendacionesPublicas);
router.get("/privadas", verificarToken, adminRecomendaciones.cargarRecomendacionesPrivadas);


// router.post("/descarga-gratuita", verificarToken, adminRecomendaciones.registrarDescargasGratuitas);
// router.post("/interaccion", verificarToken, adminRecomendaciones.registrarInteraccionYSumarAfinidad);

module.exports = router;