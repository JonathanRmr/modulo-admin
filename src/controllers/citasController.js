const { citas } = require('../services/httpClient');

const getToken = (req) => req.headers.authorization?.split(' ')[1];

// GET /api/admin/citas
const listarCitas = async (req, res) => {
  try {
    const { data } = await citas.listar(getToken(req), req.query);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'listar citas');
  }
};

// GET /api/admin/citas/:id
const obtenerCita = async (req, res) => {
  try {
    const { data } = await citas.obtener(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'obtener cita');
  }
};

// POST /api/admin/citas
const crearCita = async (req, res) => {
  try {
    const { data } = await citas.crear(getToken(req), req.body);
    return res.status(201).json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'crear cita');
  }
};

// PUT /api/admin/citas/:id
const actualizarCita = async (req, res) => {
  try {
    const { data } = await citas.actualizar(getToken(req), req.params.id, req.body);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'actualizar cita');
  }
};

// DELETE /api/admin/citas/:id
const eliminarCita = async (req, res) => {
  try {
    const { data } = await citas.eliminar(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'eliminar cita');
  }
};

// PATCH /api/admin/citas/:id/confirmar
const confirmarCita = async (req, res) => {
  try {
    const { data } = await citas.confirmar(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'confirmar cita');
  }
};

// PATCH /api/admin/citas/:id/cancelar
const cancelarCita = async (req, res) => {
  try {
    const { data } = await citas.cancelar(getToken(req), req.params.id, req.body);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'cancelar cita');
  }
};

// PATCH /api/admin/citas/:id/completar
const completarCita = async (req, res) => {
  try {
    const { data } = await citas.completar(getToken(req), req.params.id);
    return res.json(data);
  } catch (error) {
    return manejarErrorProxy(res, error, 'completar cita');
  }
};

function manejarErrorProxy(res, error, operacion) {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      ok: false,
      mensaje: `Módulo de citas no disponible al intentar ${operacion}`,
    });
  }
  return res.status(500).json({ ok: false, mensaje: `Error al ${operacion}`, error: error.message });
}

module.exports = {
  listarCitas,
  obtenerCita,
  crearCita,
  actualizarCita,
  eliminarCita,
  confirmarCita,
  cancelarCita,
  completarCita,
};
