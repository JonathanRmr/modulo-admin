const router = require('express').Router();
const auth = require('../middlewares/auth');
const soloAdmin = require('../middlewares/soloAdmin');
const ctrl = require('../controllers/horariosController');

// ── Ruta pública (sin token) ──────────────────────────────
router.get('/barberos/lista', ctrl.listarBarberos);



// Todas las rutas requieren auth + admin
router.use(auth, soloAdmin);

// ── Horarios de barberos ──────────────────────────────
router.get('/barberos', ctrl.listarHorariosBarberos);
router.get('/barberos/:id', ctrl.obtenerHorarioBarbero);
router.post('/barberos', ctrl.crearHorarioBarbero);
router.put('/barberos/:id', ctrl.actualizarHorarioBarbero);
router.delete('/barberos/:id', ctrl.eliminarHorarioBarbero);

// ── Horarios generales de la barbería ─────────────────
router.get('/barberia', ctrl.listarHorariosBarberia);
router.get('/barberia/:id', ctrl.obtenerHorarioBarberia);
router.post('/barberia', ctrl.crearHorarioBarberia);
router.put('/barberia/:id', ctrl.actualizarHorarioBarberia);
router.delete('/barberia/:id', ctrl.eliminarHorarioBarberia);
router.post('/barberia/inicializar', ctrl.inicializarHorariosBarberia);

module.exports = router;
