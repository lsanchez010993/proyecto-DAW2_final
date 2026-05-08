const mongoose = require("mongoose");

const resenaLibroSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    libro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Libro",
      required: true,
    },
    puntuacion: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "La puntuacion debe ser un numero entero entre 1 y 5.",
      },
    },
    resena: {
      type: String,
      trim: true,
      maxlength: 1000,
      validate: {
        validator: (value) => value === undefined || value.length > 0,
        message: "La resena no puede estar vacia.",
      },
    },
  },
  {
    timestamps: true,
  },
);

resenaLibroSchema.index({ usuario: 1, libro: 1 }, { unique: true });

module.exports = mongoose.model("ResenaLibro", resenaLibroSchema);
