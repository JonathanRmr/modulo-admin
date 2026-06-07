const mongoose = require('mongoose');

const horarioBarberiaSchema = new mongoose.Schema(
  {
    diaSemana: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      unique: true,
    },
    nombreDia: {
      type: String,
      required: true,
      enum: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    },
    horaApertura: {
      type: String, // "HH:mm"
      required: [true, 'La hora de apertura es obligatoria'],
    },
    horaCierre: {
      type: String,
      required: [true, 'La hora de cierre es obligatoria'],
    },
    abierto: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HorarioBarberia', horarioBarberiaSchema);
