const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");
const Libro = require("../models/Libro");
const verificarToken = require("../middleware/auth");

// ==========================================
// RUTA 1: Obtener libros CON PAGINACIÓN
// ==========================================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const totalLibros = await Libro.countDocuments();

    const libros = await Libro.find().skip(skip).limit(limit);

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
});

// ==========================================
// RUTA 2: Obtener un libro por ID
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// RUTA 3: Crear libro (PROTEGIDA)
// ==========================================
router.post(
  "/",
  verificarToken,
  uploadCloud.single("imagen"),
  async (req, res) => {
    try {
      const {
        titulo,
        autor,
        isbn,
        sinopsis,
        precio_fisico,
        precio_digital,
        stock,
      } = req.body;

      const precioFisicoNum = parseFloat(precio_fisico) || 0;
      const precioDigitalNum = parseFloat(precio_digital) || 0;
      const stockNum = parseInt(stock) || 0;

      if (!isbn || isbn.trim() === "") {
        return res
          .status(400)
          .json({ message: "El campo ISBN es obligatorio." });
      }

      const nuevoLibro = new Libro({
        titulo,
        autor,
        isbn,
        sinopsis,
        portada_url: req.file
          ? req.file.path
          : "https://via.placeholder.com/300",
        precio: {
          fisico: precioFisicoNum,
          digital: precioDigitalNum,
        },
        stock: stockNum,
        usuario: req.usuario.id,
      });

      const libroGuardado = await nuevoLibro.save();
      res.status(201).json(libroGuardado);
    } catch (error) {
      console.error("Error al crear libro:", error);
      if (error.code === 11000)
        return res.status(400).json({ message: "Error: ISBN duplicado." });
      res
        .status(400)
        .json({ message: "Error al crear libro", error: error.message });
    }
  },
);

// ==========================================
// RUTA 4: Actualizar un libro (PROTEGIDA)
// ==========================================
router.put(
  "/:id",
  verificarToken,
  uploadCloud.single("imagen"),
  async (req, res) => {
    try {
      
      const {
        titulo,
        autor,
        isbn,
        sinopsis,
        precio_fisico,
        precio_digital,
        stock,
      } = req.body;

      // 2. Buscar libro original
      const libroOriginal = await Libro.findById(req.params.id);
      if (!libroOriginal)
        return res.status(404).json({ message: "Libro no encontrado" });
      
      const esDueño =
        libroOriginal.usuario &&
        libroOriginal.usuario.toString() === req.usuario.id;
      const esAdmin = req.usuario.rol === "admin";

    
      if (!esDueño && !esAdmin) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para editar este libro." });
      }

      // 3. SEGURIDAD: Verificar propiedad
     
      if (
        libroOriginal.usuario &&
        libroOriginal.usuario.toString() !== req.usuario.id
      ) {
        return res
          .status(403)
          .json({
            message: "No tienes permiso para editar este libro (no es tuyo).",
          });
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

      console.log("✅ ¡ÉXITO! Libro actualizado.");
      res.json(libroActualizado);
    } catch (error) {
      console.error("Error backend:", error);

      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Error: Ese ISBN ya pertenece a otro libro." });
      }

      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },
);

// ==========================================
// RUTA 5: Eliminar un libro 
// ==========================================
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });

        //  DUEÑO O ADMIN 
        const esDueño = libro.usuario && libro.usuario.toString() === req.usuario.id;
        const esAdmin = req.usuario.rol === 'admin';

        if (!esDueño && !esAdmin) {
            return res.status(403).json({ message: "No puedes borrar libros que no son tuyos." });
        }
        

        await Libro.findByIdAndDelete(req.params.id);
        res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;