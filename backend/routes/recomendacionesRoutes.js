const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");
const Interaccion = require("../models/Interaccion");
const Usuario = require("../models/Usuario");
const verificarToken = require("../middleware/auth");

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


// ==========================================
// Sistema de recomendaciones para usuarios validados
// ==========================================
router.get("/privadas", verificarToken, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await Usuario.findById(usuarioId);

    let librosPorGenero = [];
    let generoReferencia = "";

   
    // 1. Comprobar si el perfil de afinidad existe y tiene puntos
    if (usuario.perfil_afinidad && typeof usuario.perfil_afinidad.entries === 'function') {
      const afinidadArray = Array.from(usuario.perfil_afinidad.entries()).sort((a, b) => b[1] - a[1]);
      
      if (afinidadArray.length > 0) {
        generoReferencia = afinidadArray[0][0]; 
        librosPorGenero = await Libro.find({ 
          categorias: generoReferencia,
          _id: { $nin: usuario.lista_deseos } 
        }).limit(10);
      }
    }

    // 2. Si no tiene puntos aún, porque es un usuario nuevo y no ha navegado, utiliza los gustos que ha elegido en su perfil personal
    if (!generoReferencia && usuario.gustos_literarios && usuario.gustos_literarios.length > 0) {
      generoReferencia = usuario.gustos_literarios[0];
      librosPorGenero = await Libro.find({ categorias: generoReferencia }).limit(10);
    }


   
    let librosPorLibro = [];
    let tituloReferencia = "";
    let libroReferencia = null;

    // 1. Buscar la última interacción 
    const ultimaInteraccion = await Interaccion.findOne({ 
      usuario: usuarioId, 
      tipo_accion: { $in: ["deseo", "carrito", "compra", "vista"] } 
    }).sort({ _id: -1 });

    // 2. Búsqueda manual 
    if (ultimaInteraccion && ultimaInteraccion.libro) {
      libroReferencia = await Libro.findById(ultimaInteraccion.libro);
    } 
    // Lista de deseos antigua
    else if (usuario.lista_deseos && usuario.lista_deseos.length > 0) {
      const ultimoDeseoId = usuario.lista_deseos[usuario.lista_deseos.length - 1];
      libroReferencia = await Libro.findById(ultimoDeseoId);
    }

    // Extraer autor y categoría
    if (libroReferencia) {
      tituloReferencia = libroReferencia.titulo;
      
      librosPorLibro = await Libro.find({
        $or: [
          { autor: libroReferencia.autor },
          { categorias: { $in: libroReferencia.categorias } }
        ],
        _id: { $ne: libroReferencia._id }
      }).limit(10);

      
      if (!generoReferencia && libroReferencia.categorias.length > 0) {
        generoReferencia = libroReferencia.categorias[0];
        librosPorGenero = await Libro.find({ categorias: generoReferencia, _id: { $ne: libroReferencia._id } }).limit(10);
      }
    }

    // Enviar datos
    res.json({
      porLibro: librosPorLibro,
      porGenero: librosPorGenero,
      tituloReferencia: tituloReferencia,
      generoReferencia: generoReferencia
    });

  } catch (error) {
    console.error("Error en recomendaciones privadas:", error);
    res.status(500).json({ message: "Error en recomendaciones privadas" });
  }
});


module.exports = router;