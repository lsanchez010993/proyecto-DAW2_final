const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");
const verificarToken = require("../middleware/auth");

const libroController = require("../controllers/libroController");
const libroCRUD = require("../controllers/libroCRUD");



router.get("/", libroController.obtenerLibros);

router.get("/categoria/:nombreCategoria", libroController.buscarPorCategoria);

router.get("/autor/:nombreAutor", libroController.buscarPorAutor);

router.get("/autores/todos", libroController.obtenerAutores);

router.get("/autores/buscar", libroController.buscarAutoresPorNombre);

router.get("/editoriales/unicas", libroController.obtenerEditorialesUnicas);

router.get("/:id", libroController.obtenerLibroPorId);


// ==========================================
// CRUD
// ==========================================

// POST: Crear un libro

router.post("/", verificarToken, uploadCloud.single("imagen"), libroCRUD.crearLibro);

// PUT: Actualizar un libro 

router.put("/:id", verificarToken, uploadCloud.single("imagen"), libroCRUD.actualizarLibro);

// DELETE: Eliminar un libro

router.delete("/:id", verificarToken, libroCRUD.eliminarLibro);

module.exports = router;
