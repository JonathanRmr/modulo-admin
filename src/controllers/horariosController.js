const HorarioBarbero = require('../models/HorarioBarbero');
const HorarioBarberia = require('../models/HorarioBarberia');

// ══════════════════════════════════════════════════════════
//  HORARIOS DE BARBEROS
// ══════════════════════════════════════════════════════════




// GET /api/admin/horarios/barberos/lista
// Devuelve los barberos únicos que tienen al menos un horario registrado.
// No requiere autenticación (lo usan los clientes para ver disponibilidad).
const listarBarberos = async (req, res) => {
  try {
    const barberos = await HorarioBarbero.aggregate([
      {
        $group: {
          _id: "$barberoId",
          nombreBarbero: { $first: "$nombreBarbero" },
        },
      },
      { $sort: { nombreBarbero: 1 } },
    ]);

    return res.json({
      ok: true,
      data: barberos.map((b) => ({
        _id:          b._id,
        nombreBarbero: b.nombreBarbero,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error al listar barberos",
      error: error.message,
    });
  }
};

// GET /api/admin/horarios/barberos
const listarHorariosBarberos = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.barberoId) filtro.barberoId = req.query.barberoId;
    if (req.query.diaSemana !== undefined) filtro.diaSemana = Number(req.query.diaSemana);
    if (req.query.activo !== undefined) filtro.activo = req.query.activo === 'true';

    const horarios = await HorarioBarbero.find(filtro).sort({ barberoId: 1, diaSemana: 1 });

    return res.json({ ok: true, data: horarios });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al listar horarios', error: error.message });
  }
};

// GET /api/admin/horarios/barberos/:id
const obtenerHorarioBarbero = async (req, res) => {
  try {
    const horario = await HorarioBarbero.findById(req.params.id);
    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }
    return res.json({ ok: true, data: horario });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener horario', error: error.message });
  }
};

// POST /api/admin/horarios/barberos
const crearHorarioBarbero = async (req, res) => {
  try {
    const { barberoId, nombreBarbero, diaSemana, horaInicio, horaFin, descansos, activo } = req.body;

    const horario = await HorarioBarbero.create({
      barberoId,
      nombreBarbero,
      diaSemana,
      horaInicio,
      horaFin,
      descansos: descansos || [],
      activo: activo !== undefined ? activo : true,
    });

    return res.status(201).json({ ok: true, data: horario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Este barbero ya tiene un horario asignado para ese día',
      });
    }
    return res.status(400).json({ ok: false, mensaje: 'Error al crear horario', error: error.message });
  }
};

// PUT /api/admin/horarios/barberos/:id
const actualizarHorarioBarbero = async (req, res) => {
  try {
    const horario = await HorarioBarbero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }

    return res.json({ ok: true, data: horario });
  } catch (error) {
    return res.status(400).json({ ok: false, mensaje: 'Error al actualizar horario', error: error.message });
  }
};

// DELETE /api/admin/horarios/barberos/:id
const eliminarHorarioBarbero = async (req, res) => {
  try {
    const horario = await HorarioBarbero.findByIdAndDelete(req.params.id);
    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }
    return res.json({ ok: true, mensaje: 'Horario de barbero eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al eliminar horario', error: error.message });
  }
};

// ══════════════════════════════════════════════════════════
//  HORARIOS GENERALES DE LA BARBERÍA
// ══════════════════════════════════════════════════════════

// GET /api/admin/horarios/barberia
const listarHorariosBarberia = async (req, res) => {
  try {
    const horarios = await HorarioBarberia.find().sort({ diaSemana: 1 });
    return res.json({ ok: true, data: horarios });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al listar horarios', error: error.message });
  }
};

// GET /api/admin/horarios/barberia/:id
const obtenerHorarioBarberia = async (req, res) => {
  try {
    const horario = await HorarioBarberia.findById(req.params.id);
    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }
    return res.json({ ok: true, data: horario });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener horario', error: error.message });
  }
};

// POST /api/admin/horarios/barberia
const crearHorarioBarberia = async (req, res) => {
  try {
    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const { diaSemana, horaApertura, horaCierre, abierto } = req.body;

    const horario = await HorarioBarberia.create({
      diaSemana,
      nombreDia: DIAS[diaSemana],
      horaApertura,
      horaCierre,
      abierto: abierto !== undefined ? abierto : true,
    });

    return res.status(201).json({ ok: true, data: horario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ya existe un horario para ese día de la semana',
      });
    }
    return res.status(400).json({ ok: false, mensaje: 'Error al crear horario', error: error.message });
  }
};

// PUT /api/admin/horarios/barberia/:id
const actualizarHorarioBarberia = async (req, res) => {
  try {
    const horario = await HorarioBarberia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }

    return res.json({ ok: true, data: horario });
  } catch (error) {
    return res.status(400).json({ ok: false, mensaje: 'Error al actualizar horario', error: error.message });
  }
};

// DELETE /api/admin/horarios/barberia/:id
const eliminarHorarioBarberia = async (req, res) => {
  try {
    const horario = await HorarioBarberia.findByIdAndDelete(req.params.id);
    if (!horario) {
      return res.status(404).json({ ok: false, mensaje: 'Horario no encontrado' });
    }
    return res.json({ ok: true, mensaje: 'Horario de barbería eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al eliminar horario', error: error.message });
  }
};

// POST /api/admin/horarios/barberia/inicializar — crea los 7 días de una vez
const inicializarHorariosBarberia = async (req, res) => {
  try {
    const existentes = await HorarioBarberia.countDocuments();
    if (existentes > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Los horarios ya están inicializados. Usa PUT para modificar.',
      });
    }

    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horariosPorDefecto = DIAS.map((nombre, i) => ({
      diaSemana: i,
      nombreDia: nombre,
      horaApertura: i === 0 ? '00:00' : '08:00', // Domingo cerrado
      horaCierre: i === 0 ? '00:00' : '20:00',
      abierto: i !== 0, // Domingo cerrado por defecto
    }));

    const creados = await HorarioBarberia.insertMany(horariosPorDefecto);
    return res.status(201).json({ ok: true, data: creados, mensaje: 'Horarios inicializados' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error al inicializar', error: error.message });
  }
};

module.exports = {
  // Barberos
  listarBarberos, 
  listarHorariosBarberos,
  obtenerHorarioBarbero,
  crearHorarioBarbero,
  actualizarHorarioBarbero,
  eliminarHorarioBarbero,
  // Barbería
  listarHorariosBarberia,
  obtenerHorarioBarberia,
  crearHorarioBarberia,
  actualizarHorarioBarberia,
  eliminarHorarioBarberia,
  inicializarHorariosBarberia,
};
