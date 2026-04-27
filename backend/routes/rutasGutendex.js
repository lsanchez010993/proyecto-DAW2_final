const express = require("express");
const router = express.Router();
const axios = require("axios");
const LibroGratuito = require("../models/LibroGratuito");
const verificarToken = require("../middleware/auth");
const MESSAGES = require("../constants/messages");
const adminGutendex = require("../controllers/adminGutendex");

const requireAdmin = (req, res, next) => {
  if (req?.usuario?.rol !== "admin") {
    return res.status(403).json({ message: MESSAGES.USUARIOS.UNAUTHORIZED });
  }
  next();
};


// ==========================================
// RUTA MAESTRA: IMPORTAR LIBROS (ESTABLE Y OPTIMIZADA)
// ==========================================
router.post("/sincronizar-gutendex",  verificarToken, requireAdmin, adminGutendex.sincronizarGutendex);

// ==========================================
// RUTA: OBTENER LISTADO (CON FILTROS PARA EL MODAL)
// ==========================================
router.get("/libros-gratuitos", adminGutendex.obtenerLibrosGratuitos);
 
module.exports = router;