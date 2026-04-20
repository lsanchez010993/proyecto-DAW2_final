const mongoose = require("mongoose");

const interaccionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Libro",
    required: true
  },
  tipo_accion: {
    type: String,
    enum: ["vista", "deseo", "carrito", "compra"], 
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

// Índice para hacer búsquedas rápidas 
interaccionSchema.index({ usuario: 1, fecha: -1 });

module.exports = mongoose.model("Interaccion", interaccionSchema);