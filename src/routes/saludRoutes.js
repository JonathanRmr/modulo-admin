const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ ok: true, servicio: 'modulo-admin', estado: 'activo' });
});

module.exports = router;
