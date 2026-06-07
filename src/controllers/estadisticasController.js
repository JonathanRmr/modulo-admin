const Ingreso = require('../models/Ingreso');
const Gasto = require('../models/Gasto');
const { citas, productos } = require('../services/httpClient');

const getToken = (req) => req.headers.authorization?.split(' ')[1];

// ══════════════════════════════════════════════════════════
//  CRUD INGRESOS (dinero que entra)
// ══════════════════════════════════════════════════════════

const crearIngreso = async (req, res) => {
  try {
    const ingreso = await Ingreso.create(req.body);
    return res.status(201).json({ ok: true, data: ingreso });
  } catch (error) {
    return res.status(400).json({ ok: false, mensaje: 'Error al registrar ingreso', error: error.message });
  }
};

const listarIngresos = async (req, res) => {
  try {
    const { desde, hasta, origen, barberoId, page = 1, limit = 20 } = req.query;
    const filtro = {};

    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }
    if (origen) filtro.origen = origen;
    if (barberoId) filtro.barberoId = barberoId;

    const total = await Ingreso.countDocuments(filtro);
    const ingresos = await Ingreso.find(filtro)
      .sort({ fecha: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      ok: true,
      data: ingresos,
      paginacion: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPaginas: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al listar ingresos', error: error.message });
  }
};

const eliminarIngreso = async (req, res) => {
  try {
    const ingreso = await Ingreso.findByIdAndDelete(req.params.id);
    if (!ingreso) return res.status(404).json({ ok: false, mensaje: 'Ingreso no encontrado' });
    return res.json({ ok: true, mensaje: 'Ingreso eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al eliminar ingreso', error: error.message });
  }
};

// ══════════════════════════════════════════════════════════
//  CRUD GASTOS (dinero que sale)
// ══════════════════════════════════════════════════════════

const crearGasto = async (req, res) => {
  try {
    const gasto = await Gasto.create(req.body);
    return res.status(201).json({ ok: true, data: gasto });
  } catch (error) {
    return res.status(400).json({ ok: false, mensaje: 'Error al registrar gasto', error: error.message });
  }
};

const listarGastos = async (req, res) => {
  try {
    const { desde, hasta, categoria, page = 1, limit = 20 } = req.query;
    const filtro = {};

    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }
    if (categoria) filtro.categoria = categoria;

    const total = await Gasto.countDocuments(filtro);
    const gastos = await Gasto.find(filtro)
      .sort({ fecha: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      ok: true,
      data: gastos,
      paginacion: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPaginas: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al listar gastos', error: error.message });
  }
};

const eliminarGasto = async (req, res) => {
  try {
    const gasto = await Gasto.findByIdAndDelete(req.params.id);
    if (!gasto) return res.status(404).json({ ok: false, mensaje: 'Gasto no encontrado' });
    return res.json({ ok: true, mensaje: 'Gasto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al eliminar gasto', error: error.message });
  }
};

// ══════════════════════════════════════════════════════════
//  REPORTES Y ESTADÍSTICAS
// ══════════════════════════════════════════════════════════

// GET /api/admin/estadisticas/resumen?desde=...&hasta=...
// Retorna: dinero ingresado, dinero que sale, ganancias netas
const resumenFinanciero = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtroFecha = {};

    if (desde || hasta) {
      filtroFecha.fecha = {};
      if (desde) filtroFecha.fecha.$gte = new Date(desde);
      if (hasta) filtroFecha.fecha.$lte = new Date(hasta);
    }

    const [totalIngresos] = await Ingreso.aggregate([
      { $match: filtroFecha },
      { $group: { _id: null, total: { $sum: '$monto' }, cantidad: { $sum: 1 } } },
    ]);

    const [totalGastos] = await Gasto.aggregate([
      { $match: filtroFecha },
      { $group: { _id: null, total: { $sum: '$monto' }, cantidad: { $sum: 1 } } },
    ]);

    const ingresos = totalIngresos?.total || 0;
    const gastos = totalGastos?.total || 0;

    return res.json({
      ok: true,
      data: {
        dineroIngresado: ingresos,
        cantidadIngresos: totalIngresos?.cantidad || 0,
        dineroQueSale: gastos,
        cantidadGastos: totalGastos?.cantidad || 0,
        gananciasnetas: ingresos - gastos,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al generar resumen', error: error.message });
  }
};

// GET /api/admin/estadisticas/ingresos-por-origen?desde=...&hasta=...
const ingresosPorOrigen = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const match = {};

    if (desde || hasta) {
      match.fecha = {};
      if (desde) match.fecha.$gte = new Date(desde);
      if (hasta) match.fecha.$lte = new Date(hasta);
    }

    const resultado = await Ingreso.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$origen',
          total: { $sum: '$monto' },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return res.json({ ok: true, data: resultado });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error', error: error.message });
  }
};

// GET /api/admin/estadisticas/gastos-por-categoria?desde=...&hasta=...
const gastosPorCategoria = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const match = {};

    if (desde || hasta) {
      match.fecha = {};
      if (desde) match.fecha.$gte = new Date(desde);
      if (hasta) match.fecha.$lte = new Date(hasta);
    }

    const resultado = await Gasto.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$categoria',
          total: { $sum: '$monto' },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return res.json({ ok: true, data: resultado });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error', error: error.message });
  }
};

// GET /api/admin/estadisticas/barberos?desde=...&hasta=...
// Análisis de barberos: ingresos generados por cada barbero
const analisisBarberos = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const match = { barberoId: { $ne: null } };

    if (desde || hasta) {
      match.fecha = {};
      if (desde) match.fecha.$gte = new Date(desde);
      if (hasta) match.fecha.$lte = new Date(hasta);
    }

    // Ingresos por barbero
    const ingresosPorBarbero = await Ingreso.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$barberoId',
          nombreBarbero: { $first: '$nombreBarbero' },
          totalIngresos: { $sum: '$monto' },
          totalServicios: { $sum: 1 },
        },
      },
      { $sort: { totalIngresos: -1 } },
    ]);

    // Gastos de nómina por barbero
    const gastoMatch = { barberoId: { $ne: null }, categoria: 'nomina' };
    if (desde || hasta) {
      gastoMatch.fecha = {};
      if (desde) gastoMatch.fecha.$gte = new Date(desde);
      if (hasta) gastoMatch.fecha.$lte = new Date(hasta);
    }

    const gastosPorBarbero = await Gasto.aggregate([
      { $match: gastoMatch },
      {
        $group: {
          _id: '$barberoId',
          totalNomina: { $sum: '$monto' },
        },
      },
    ]);

    // Combinar ingresos y gastos
    const nominaMap = {};
    gastosPorBarbero.forEach((g) => {
      nominaMap[g._id] = g.totalNomina;
    });

    const analisis = ingresosPorBarbero.map((b) => ({
      barberoId: b._id,
      nombreBarbero: b.nombreBarbero,
      totalIngresos: b.totalIngresos,
      totalServicios: b.totalServicios,
      totalNomina: nominaMap[b._id] || 0,
      rentabilidad: b.totalIngresos - (nominaMap[b._id] || 0),
    }));

    return res.json({ ok: true, data: analisis });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error en análisis de barberos', error: error.message });
  }
};

// GET /api/admin/estadisticas/proyeccion-sueldos?mes=6&anio=2026
// Proyección de sueldos basada en historial de nómina
const proyeccionSueldos = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    // Obtener los últimos 3 meses de nómina para proyectar
    const hace3Meses = new Date();
    hace3Meses.setMonth(hace3Meses.getMonth() - 3);

    const historicoNomina = await Gasto.aggregate([
      {
        $match: {
          categoria: 'nomina',
          fecha: { $gte: hace3Meses },
        },
      },
      {
        $group: {
          _id: '$barberoId',
          nombreBarbero: { $first: '$nombreBarbero' },
          promedioMensual: { $avg: '$monto' },
          totalPagado: { $sum: '$monto' },
          cantidadPagos: { $sum: 1 },
        },
      },
      { $sort: { promedioMensual: -1 } },
    ]);

    const totalProyectado = historicoNomina.reduce((acc, b) => acc + b.promedioMensual, 0);

    return res.json({
      ok: true,
      data: {
        mesProyectado: mes ? Number(mes) : new Date().getMonth() + 1,
        anioProyectado: anio ? Number(anio) : new Date().getFullYear(),
        totalProyectado: Math.round(totalProyectado),
        detallePorBarbero: historicoNomina.map((b) => ({
          barberoId: b._id,
          nombreBarbero: b.nombreBarbero,
          promedioMensual: Math.round(b.promedioMensual),
          totalPagado: b.totalPagado,
          cantidadPagos: b.cantidadPagos,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error en proyección', error: error.message });
  }
};

// GET /api/admin/estadisticas/productos
// Análisis de productos: ingresos por venta de productos
const analisisProductos = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const match = { origen: 'producto' };

    if (desde || hasta) {
      match.fecha = {};
      if (desde) match.fecha.$gte = new Date(desde);
      if (hasta) match.fecha.$lte = new Date(hasta);
    }

    const ventasPorProducto = await Ingreso.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$concepto',
          totalVentas: { $sum: '$monto' },
          cantidadVendida: { $sum: 1 },
        },
      },
      { $sort: { totalVentas: -1 } },
    ]);

    const totalProductos = ventasPorProducto.reduce((acc, p) => acc + p.totalVentas, 0);

    // Intentar obtener catálogo actual del módulo de servicios
    let catalogoActual = null;
    try {
      const { data } = await productos.listar(getToken(req), { limit: 100 });
      catalogoActual = {
        totalProductosActivos: data.data?.length || 0,
        valorInventario: data.data?.reduce((acc, p) => acc + p.precio * (p.stock || 0), 0) || 0,
      };
    } catch {
      catalogoActual = { mensaje: 'No se pudo conectar al módulo de servicios' };
    }

    return res.json({
      ok: true,
      data: {
        totalIngresosProductos: totalProductos,
        ventasPorProducto,
        catalogoActual,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error en análisis de productos', error: error.message });
  }
};

module.exports = {
  // CRUD
  crearIngreso,
  listarIngresos,
  eliminarIngreso,
  crearGasto,
  listarGastos,
  eliminarGasto,
  // Reportes
  resumenFinanciero,
  ingresosPorOrigen,
  gastosPorCategoria,
  analisisBarberos,
  proyeccionSueldos,
  analisisProductos,
};
