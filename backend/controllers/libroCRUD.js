const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");
const Libro = require("../models/Libro");

const Usuario = require("../models/Usuario");
const cache = require("../utils/cache");
const MESSAGES = require("../constants/messages");

// ==========================================
// RUTA 3: Crear libro (PROTEGIDA)
// ==========================================

async function crearLibro(req, res) {
  try {
    const {
      titulo,
      autor,
      isbn,
      sinopsis,
      precio_fisico,
      precio_digital,
      stock,
      categorias,
      editorial: editorialBody,
    } = req.body;
    const usuarioCreador = await Usuario.findById(req.usuario.id);
    let categoriasArray = [];
    if (categorias) {
      categoriasArray = JSON.parse(categorias);
    }

    const precioFisicoNum = parseFloat(precio_fisico) || 0;
    const precioDigitalNum = parseFloat(precio_digital) || 0;
    const stockNum = parseInt(stock) || 0;

    if (!isbn || isbn.trim() === "") {
      return res.status(400).json({ message: MESSAGES.LIBROS.ISBN_REQUIRED });
    }

    const esAdmin = req?.usuario?.rol === "admin";
    const editorialAsignada = esAdmin
      ? (editorialBody || "").trim() || "Editorial Independiente"
      : (usuarioCreador?.nombre_editorial || "").trim() || "Editorial Independiente";

    const nuevoLibro = new Libro({
      titulo,
      autor,
      isbn,
      sinopsis,
      editorial: editorialAsignada,
      categorias: categoriasArray,
      portada_url: req.file ? req.file.path : "https://via.placeholder.com/300",
      precio: {
        fisico: precioFisicoNum,
        digital: precioDigitalNum,
      },
      stock: stockNum,
      usuario: req.usuario.id,
    });

    const libroGuardado = await nuevoLibro.save();
    cache.directorioAutores = null;
    cache.librosPorCategoria = {}
    res.status(201).json(libroGuardado);
  } catch (error) {
    console.error("Error al crear libro:", error);
    if (error.code === 11000)
      return res.status(400).json({ message: MESSAGES.LIBROS.ISBN_DUPLICATE });
    res
      .status(400)
      .json({ message: "Error al crear libro", error: error.message });
  }
}

async function actualizarLibro(req, res) {
  try {
    const {
      titulo,
      autor,
      isbn,
      sinopsis,
      precio_fisico,
      precio_digital,
      stock,
      categorias,
      editorial: editorialBody,
    } = req.body;

    const usuarioCreador = await Usuario.findById(req.usuario.id);
    // 2. Buscar libro original
    const libroOriginal = await Libro.findById(req.params.id);
    if (!libroOriginal)
      return res.status(404).json({ message: MESSAGES.LIBROS.NOT_FOUND });

    const esDueño =
      libroOriginal.usuario &&
      libroOriginal.usuario.toString() === req.usuario.id;
    const esAdmin = req.usuario.rol === "admin";

    if (!esDueño && !esAdmin) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este libro." });
    }

    // 4. PREPARAR DATOS

    const pFisico = parseFloat(precio_fisico);
    const pDigital = parseFloat(precio_digital);
    const stockNum = parseInt(stock);

    const datosAActualizar = {
      titulo,
      autor,
      isbn,
      sinopsis,
      editorial: esAdmin
        ? ((editorialBody || "").trim() || libroOriginal.editorial || "Editorial Independiente")
        : (usuarioCreador?.nombre_editorial || "").trim() || "Editorial Independiente",
      categorias: categorias ? JSON.parse(categorias) : [],
      precio: {
        fisico: isNaN(pFisico) ? 0 : pFisico,
        digital: isNaN(pDigital) ? 0 : pDigital,
      },
      stock: isNaN(stockNum) ? 0 : stockNum,
      portada_url: req.file ? req.file.path : libroOriginal.portada_url,
    };

    // 5. ACTUALIZAR
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      datosAActualizar,
      { new: true, runValidators: true },
    );
    cache.directorioAutores = null;
    cache.librosPorCategoria = {};
    console.log("¡ÉXITO! Libro actualizado.");
    res.json(libroActualizado);
  } catch (error) {
    console.error("Error backend:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Error: Ese ISBN ya pertenece a otro libro." });
    }

    res.status(500).json({
      message: MESSAGES.GENERAL.SERVER_ERROR,
      error: error.message,
    });
  }
}
async function eliminarLibro(req, res) {
   
        try {
          const libro = await Libro.findById(req.params.id);
          if (!libro) return res.status(404).json({ message: MESSAGES.LIBROS.NOT_FOUND });
      
          //  DUEÑO O ADMIN
          const esDueño =
            libro.usuario && libro.usuario.toString() === req.usuario.id;
          const esAdmin = req.usuario.rol === "admin";
      
          if (!esDueño && !esAdmin) {
            return res
              .status(403)
              .json({ message: "No puedes borrar libros que no son tuyos." });
          }
      
          await Libro.findByIdAndDelete(req.params.id);
          cache.directorioAutores = null;
          cache.librosPorCategoria = {}
          res.json({ message: MESSAGES.LIBROS.DELETE_SUCCESS });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }


module.exports = {
  crearLibro,
  actualizarLibro,
  eliminarLibro
};
