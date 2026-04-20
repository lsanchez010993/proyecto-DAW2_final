require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes'); // [NUEVO]

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a BD
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Base de datos MongoDB conectada correctamente'))
    .catch((error) => console.error('❌ Error conectando a MongoDB:', error));

// Rutas
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/recomendaciones', require('./routes/recomendacionesRoutes')); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});