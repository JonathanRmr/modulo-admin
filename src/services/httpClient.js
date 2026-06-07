const axios = require('axios');

const SERVICIOS_URL = process.env.SERVICIOS_URL || 'http://localhost:4002';
const CITAS_URL = process.env.CITAS_URL || 'http://localhost:4003';
const USUARIOS_URL = process.env.USUARIOS_URL || 'http://localhost:5000';

// Crea instancia con token del admin para llamadas autenticadas
const crearCliente = (baseURL, token) => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// ─── Servicios (puerto 4002) ──────────────────────────────

const productos = {
  listar: (token, params = {}) =>
    crearCliente(SERVICIOS_URL, token).get('/api/productos', { params }),

  obtener: (token, id) =>
    crearCliente(SERVICIOS_URL, token).get(`/api/productos/${id}`),

  crear: (token, data) =>
    crearCliente(SERVICIOS_URL, token).post('/api/productos', data),

  actualizar: (token, id, data) =>
    crearCliente(SERVICIOS_URL, token).put(`/api/productos/${id}`, data),

  eliminar: (token, id) =>
    crearCliente(SERVICIOS_URL, token).delete(`/api/productos/${id}`),
};

// ─── Citas (puerto 4003) ─────────────────────────────────

const citas = {
  listar: (token, params = {}) =>
    crearCliente(CITAS_URL, token).get('/api/citas', { params }),

  obtener: (token, id) =>
    crearCliente(CITAS_URL, token).get(`/api/citas/${id}`),

  crear: (token, data) =>
    crearCliente(CITAS_URL, token).post('/api/citas', data),

  actualizar: (token, id, data) =>
    crearCliente(CITAS_URL, token).put(`/api/citas/${id}`, data),

  eliminar: (token, id) =>
    crearCliente(CITAS_URL, token).delete(`/api/citas/${id}`),

  confirmar: (token, id) =>
    crearCliente(CITAS_URL, token).patch(`/api/citas/${id}/confirmar`),

  cancelar: (token, id, data = {}) =>
    crearCliente(CITAS_URL, token).patch(`/api/citas/${id}/cancelar`, data),

  completar: (token, id) =>
    crearCliente(CITAS_URL, token).patch(`/api/citas/${id}/completar`),
};

// ─── Usuarios (puerto 5000) ──────────────────────────────

const usuarios = {
  listar: (token, params = {}) =>
    crearCliente(USUARIOS_URL, token).get('/api/usuarios', { params }),

  obtener: (token, id) =>
    crearCliente(USUARIOS_URL, token).get(`/api/usuarios/${id}`),
};

module.exports = { productos, citas, usuarios };
