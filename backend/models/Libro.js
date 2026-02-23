const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: true, 
        trim: true 
    },
    autor: { 
        type: String, 
        required: true 
    },
    isbn: { 
        type: String, 
        required: true,
        unique: true // No puede haber dos libros con el mismo ISBN
    },
    sinopsis: { 
        type: String 
    },
    portada_url: { 
        type: String 
    },
    genero: { 
        type: String 
    },
    precio: {
        fisico: { type: Number, default: 0 },
        digital: { type: Number, default: 0 }
    },
    stock: { 
        type: Number, 
        default: 0 
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',                       
        required: true                        
    },
  
    contenido_gratuito: {
        disponible: { type: Boolean, default: false },
        enlace_descarga: { type: String } // URL al PDF/ePub
    },
    fecha_publicacion: { 
        type: Date, 
        default: Date.now 
    }
    
});

module.exports = mongoose.model('Libro', libroSchema);