const { productos } = require('../services/httpClient');

// Extraer token del request
const getToken = (req) => req.headers.authorization?.split(' ')[1];

// GET /api/admin/productos
const listarProductos = async (req, res) => {
  try {
    const { data } = await productos.listar(getToken(req), req.query);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'listar productos');
  }
};

// GET /api/admin/productos/:id
const obtenerProducto = async (req, res) => {
  try {
    const { data } = await productos.obtener(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'obtener producto');
  }
};

// POST /api/admin/productos
const crearProducto = async (req, res) => {
  try {
    const { data } = await productos.crear(getToken(req), req.body);
    return res.status(201).json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'crear producto');
  }
};

// PUT /api/admin/productos/:id
const actualizarProducto = async (req, res) => {
  try {
    const { data } = await productos.actualizar(getToken(req), req.params.id, req.body);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'actualizar producto');
  }
};

// DELETE /api/admin/productos/:id
const eliminarProducto = async (req, res) => {
  try {
    const { data } = await productos.eliminar(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'eliminar producto');
  }
};

// Helper para errores de proxy
function manejarErrorProxy(res, error, operacion) {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      ok: false,
      mensaje: `Módulo de servicios no disponible al intentar ${operacion}`,
    });
  }
  return res.status(500).json({ ok: false, mensaje: `Error al ${operacion}`, error: error.message });
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
