const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");
const Interaccion = require("../models/Interaccion");

// ==========================================
// RUTA:  Escaparate Público
// ==========================================
router.get("/publicas", async (req, res) => {
  try {
    // 1. NOVEDADES (Los 15 más recientes)
   
    const novedades = await Libro.find()
      .sort({ _id: -1 }) 
      .limit(15);

    // 2. TOP VENTAS (Los 15 con el contador más alto)
    const topVentas = await Libro.find()
      .sort({ ventas: -1 })
      .limit(15);

    // 3. TENDENCIAS DE LA SEMANA 
 
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

    // Aggregation Pipeline de MongoDB para los filtros
    const tendencias = await Interaccion.aggregate([
      // Últimos 7 días
      { $match: { fecha: { $gte: haceUnaSemana } } },
      
      // B. Agrupar por ID del libro 
      { $group: { _id: "$libro", totalClics: { $sum: 1 } } },
      
      // C. Ordenar del más clicado al menos
      { $sort: { totalClics: -1 } },
      
      // D. El Top 15
      { $limit: 15 },
      
      // E. Info completa del libro 
      { $lookup: { from: "libros", localField: "_id", foreignField: "_id", as: "libroInfo" } },
      
      // F. Limpiar el formato para que devuelva objetos de libros normales
      { $unwind: "$libroInfo" },
      { $replaceRoot: { newRoot: "$libroInfo" } }
    ]);

    // Devolver los 3 arrays empaquetados en un solo envío
    res.json({
      novedades,
      topVentas,
      tendencias
    });

  } catch (error) {
    console.error("Error al cargar recomendaciones públicas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;