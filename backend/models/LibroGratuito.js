const mongoose = require('mongoose');

const libroGratuitoSchema = mongoose.Schema({
  gutendex_id: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  autor: { type: String, default: "Autor clásico" },
  portada_url: { type: String, default: "https://via.placeholder.com/150" },
  enlace_descarga: { type: String }, 
  categoria_tienda: { type: String, required: true }, 
  idioma: { type: String, enum: ['es', 'en'], required: true },
  fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LibroGratuito', libroGratuitoSchema);