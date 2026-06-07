const router = require('express').Router();
const auth = require('../middlewares/auth');
const soloAdmin = require('../middlewares/soloAdmin');
const ctrl = require('../controllers/citasController');

router.use(auth, soloAdmin);

router.get('/', ctrl.listarCitas);
router.get('/:id', ctrl.obtenerCita);
router.post('/', ctrl.crearCita);
router.put('/:id', ctrl.actualizarCita);
router.delete('/:id', ctrl.eliminarCita);

// Acciones de estado
router.patch('/:id/confirmar', ctrl.confirmarCita);
router.patch('/:id/cancelar', ctrl.cancelarCita);
router.patch('/:id/completar', ctrl.completarCita);

module.exports = router;
