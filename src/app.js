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

// CORS con variable de entorno
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : '*';

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Morgan solo en desarrollo para no saturar los logs de Render
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('tiny'));
}

app.use(express.json());

// Health check — Render lo requiere en /health
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Admin API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        servicios: {
            usuarios: process.env.USUARIOS_URL || 'no configurado',
            servicios: process.env.SERVICIOS_URL || 'no configurado',
            citas: process.env.CITAS_URL || 'no configurado',
        },
    });
});

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

// Error handler global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor', error: err.message });
});

module.exports = app;