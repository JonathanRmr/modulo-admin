const soloAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.tipoUsuario !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = soloAdmin;
