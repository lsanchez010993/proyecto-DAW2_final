const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    
   
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true // [NUEVO] ¡Ahora el Nick también debe ser único!
    },

    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, default: "cliente", enum: ["cliente", "admin"] },
    avatar: { type: String, default: "" },

    direccion: {
        calle: { type: String, default: "" },
        ciudad: { type: String, default: "" },
        codigo_postal: { type: String, default: "" },
        pais: { type: String, default: "" },
        telefono: { type: String, default: "" }
    },

    gustos_literarios: [{ type: String }],
    autores_favoritos: [{ type: String }],

    biblioteca_digital: [{
        libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
        fecha_compra: { type: Date, default: Date.now }
    }],

    historial_descargas_gratuitas: [{
        libro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
        titulo_guardado: { type: String, required: true },
        fecha_descarga: { type: Date, default: Date.now }
    }],

    compras_realizadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venta' }],
    lista_deseos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);