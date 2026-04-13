const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  autor: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true, 
  },
  editorial: {
    type: String,
    required: true 
  },
  sinopsis: {
    type: String,
  },
  portada_url: {
    type: String,
  },
  precio: {
    fisico: { type: Number, default: 0 },
    digital: { type: Number, default: 0 },
  },
  stock: {
    type: Number,
    default: 0,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  contenido_gratuito: {
    disponible: { type: Boolean, default: false },
    enlace_descarga: { type: String }, 
  },
  fecha_publicacion: {
    type: Date,
    default: Date.now,
  },
  categorias: {
    type: [String], 
    default: [],
  },
});
// Índices de búsqueda para optimizar el rendimiento 

libroSchema.index({ titulo: 1 });
libroSchema.index({ autor: 1 });
libroSchema.index({ editorial: 1 });
libroSchema.index({ categorias: 1 }); 

// 2. Índice Compuesto (Para cuando se cruzan filtros, ej: Fantasía + Libros Polvorientos)
libroSchema.index({ categorias: 1, editorial: 1 });

module.exports = mongoose.model("Libro", libroSchema);