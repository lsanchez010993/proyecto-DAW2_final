const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");
const Libro = require("../models/Libro");
const verificarToken = require("../middleware/auth");
const Usuario = require("../models/Usuario");
const cache = require("../utils/cache");
const MESSAGES = require("../constants/messages");

async function obtenerLibros(req, res) {
  try {
    // El req.query es un objeto que captura todas las variables que viajan en la URL después del signo de interrogación ?
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const editorialesQuery = req.query.editoriales;
    const categoriasQuery = req.query.categorias;
    const autorQuery = req.query.autor;
    const tituloQuery = req.query.titulo;

    const esPeticionEnFila =
      categoriasQuery &&
      !editorialesQuery &&
      !autorQuery &&
      !tituloQuery &&
      limit === 15 &&
      page === 1;

    if (esPeticionEnFila && cache.librosPorCategoria[categoriasQuery]) {
      // console.log(`Estantería  [${categoriasQuery}] cargada desde Caché`);
      return res.json({
        data: cache.librosPorCategoria[categoriasQuery],
        paginacion: {
          totalLibros: 15,
          totalPaginas: 1,
          paginaActual: 1,
          librosPorPagina: 15,
        },
      });
    }

    let filtroBusqueda = {};

    if (editorialesQuery) {
      const arrayEditoriales = editorialesQuery.split(",");
      filtroBusqueda.editorial = { $in: arrayEditoriales };
    }
    if (categoriasQuery) {
      const arrayCategorias = categoriasQuery.split(",");
      filtroBusqueda.categorias = { $in: arrayCategorias };
    }
    if (autorQuery) {
      filtroBusqueda.autor = autorQuery;
    }
    if (tituloQuery) {
      filtroBusqueda.titulo = { $regex: new RegExp(tituloQuery, "i") };
    }

    const totalLibros = await Libro.countDocuments(filtroBusqueda);
    const libros = await Libro.find(filtroBusqueda).skip(skip).limit(limit);

    if (esPeticionEnFila) {
      // console.log(`Estantería de [${categoriasQuery}] guardada en Caché `);
      cache.librosPorCategoria[categoriasQuery] = libros;
    }

    res.json({
      data: libros,
      paginacion: {
        totalLibros,
        totalPaginas: Math.ceil(totalLibros / limit),
        paginaActual: page,
        librosPorPagina: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function buscarPorCategoria(req, res) {
  try {
    const { nombreCategoria } = req.params;

    const libros = await Libro.find({
      categorias: { $in: [nombreCategoria] },
    });

    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: MESSAGES.LIBROS.CATEGORY_ERROR });
  }
}

async function buscarPorAutor(req, res) {
  try {
    const { nombreAutor } = req.params;

    // Buscamos libros que coincidan con el autor (ignorando mayúsculas/minúsculas)
    const libros = await Libro.find({
      autor: { $regex: new RegExp("^" + nombreAutor + "$", "i") },
    });

    if (!libros || libros.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron libros de este autor" });
    }

    res.json(libros);
  } catch (error) {
    console.error("Error al buscar por autor:", error);
    res.status(500).json({ mensaje: MESSAGES.GENERAL.SERVER_ERROR });
  }
}

async function obtenerAutores(req, res) {
  try {
    // 1. Comprueba si la lsita esta en la memoria de Node.js
    if (cache.directorioAutores !== null) {
      // Si existe, la devuelve
      // console.log("Devolviendo autores desde la Caché");
      return res.json(cache.directorioAutores);
    }

    // 2. Si la caché está vacía hace la consulta a mongoDB
    // console.log("Consultando autores a MongoDB");
    const autores = await Libro.distinct("autor"); // Esto extrae los valores únicos

    // Limpiamos los nulos y ordenamos alfabéticamente
    const autoresOrdenados = autores
      .filter((autor) => autor && autor.trim() !== "")
      .sort();

        cache.directorioAutores = autoresOrdenados;

    res.json(cache.directorioAutores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: MESSAGES.LIBROS.AUTHOR_DIR_ERROR });
  }
}

async function buscarAutoresPorNombre(req, res) {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    // expresión regular para buscar coincidencias
    const regex = new RegExp(query, "i");

    // Extraer nombres de autor que coincidan con la búsqueda
    const autores = await Libro.distinct("autor", { autor: regex });

    res.json(autores.sort()); // devolver lista ordenada alfabéticamente
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar autores", error: error.message });
  }
}

async function buscarAutoresPorLetra(req, res) {
  try {
    const letra = req.query.l;
    if (!letra) return res.json([]);

    const regex = new RegExp(`^${letra}`, "i");

    const autores = await Libro.distinct("autor", { autor: regex });

    res.json(autores.sort());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar por letra", error: error.message });
  }
}
async function obtenerLibroPorId(req, res) {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: "Libro no encontrado" });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libro", error: error.message });
  }
}


async function obtenerEditorialesUnicas(req, res) {
  try {
    const editoriales = await Libro.distinct("editorial");

    const editorialesLimpias = editoriales.filter(
      (ed) => ed && ed.trim() !== "",
    );

    res.json(editorialesLimpias);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las editoriales",
      error: error.message,
    });
  }
}

module.exports = {
  obtenerLibros,
  buscarPorCategoria,
  buscarPorAutor,
  obtenerAutores,
  buscarAutoresPorNombre,
  buscarAutoresPorLetra,
  obtenerLibroPorId,
  obtenerEditorialesUnicas
};
