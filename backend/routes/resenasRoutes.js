const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/auth");
const resenasController = require("../controllers/resenasController");

router.get("/libro/:libroId", resenasController.listarResenasPorLibro);
router.get("/libro/:libroId/permiso", verificarToken, resenasController.puedeResenar);
router.put("/libro/:libroId", verificarToken, resenasController.upsertResena);

module.exports = router;
