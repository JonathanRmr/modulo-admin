const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Rutas
const saludRoutes = require('./routes/saludRoutes');
const productosRoutes = require('./routes/productosRoutes');
const horariosRoutes = require('./routes/horariosRoutes');
const citasRoutes = require('./routes/citasRoutes');
const estadisticasRoutes = require('./routes/estadisticasRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/salud', saludRoutes);
app.use('/api/admin/productos', productosRoutes);
app.use('/api/admin/horarios', horariosRoutes);
app.use('/api/admin/citas', citasRoutes);
app.use('/api/admin/estadisticas', estadisticasRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor', error: err.message });
});

module.exports = app;
