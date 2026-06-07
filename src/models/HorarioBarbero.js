const mongoose = require('mongoose');

const horarioBarberoSchema = new mongoose.Schema(
  {
    barberoId: {
      type: String,
      required: [true, 'El ID del barbero es obligatorio'],
    },
    nombreBarbero: {
      type: String,
      required: [true, 'El nombre del barbero es obligatorio'],
    },
    diaSemana: {
      type: Number,
      required: true,
      min: 0, // 0 = Domingo
      max: 6, // 6 = Sábado
      enum: [0, 1, 2, 3, 4, 5, 6],
    },
    horaInicio: {
      type: String, // formato "HH:mm"
      required: [true, 'La hora de inicio es obligatoria'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
    },
    descansos: [
      {
        inicio: { type: String, required: true },
        fin: { type: String, required: true },
      },
    ],
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Un barbero solo tiene un horario por día
horarioBarberoSchema.index({ barberoId: 1, diaSemana: 1 }, { unique: true });

module.exports = mongoose.model('HorarioBarbero', horarioBarberoSchema);
