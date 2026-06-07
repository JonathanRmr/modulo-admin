const router = require('express').Router();
const auth = require('../middlewares/auth');
const soloAdmin = require('../middlewares/soloAdmin');
const ctrl = require('../controllers/estadisticasController');

router.use(auth, soloAdmin);

// ── CRUD Ingresos ────────────────────────────────────
router.get('/ingresos', ctrl.listarIngresos);
router.post('/ingresos', ctrl.crearIngreso);
router.delete('/ingresos/:id', ctrl.eliminarIngreso);

// ── CRUD Gastos ──────────────────────────────────────
router.get('/gastos', ctrl.listarGastos);
router.post('/gastos', ctrl.crearGasto);
router.delete('/gastos/:id', ctrl.eliminarGasto);

// ── Reportes ─────────────────────────────────────────
router.get('/resumen', ctrl.resumenFinanciero);
router.get('/ingresos-por-origen', ctrl.ingresosPorOrigen);
router.get('/gastos-por-categoria', ctrl.gastosPorCategoria);
router.get('/barberos', ctrl.analisisBarberos);
router.get('/proyeccion-sueldos', ctrl.proyeccionSueldos);
router.get('/productos', ctrl.analisisProductos);

module.exports = router;
