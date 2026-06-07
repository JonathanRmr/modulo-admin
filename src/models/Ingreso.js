const mongoose = require('mongoose');

const ingresoSchema = new mongoose.Schema(
  {
    concepto: {
      type: String,
      required: [true, 'El concepto es obligatorio'],
      trim: true,
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    origen: {
      type: String,
      default: 'servicio',
      enum: ['servicio', 'producto', 'otro'],
    },
    referenciaId: {
      type: String,
      default: null, // ID de cita o producto asociado
    },
    barberoId: {
      type: String,
      default: null,
    },
    nombreBarbero: {
      type: String,
      default: null,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    descripcion: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

ingresoSchema.index({ fecha: -1 });
ingresoSchema.index({ origen: 1 });
ingresoSchema.index({ barberoId: 1 });

module.exports = mongoose.model('Ingreso', ingresoSchema);
