const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema(
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
    categoria: {
      type: String,
      default: 'general',
      enum: ['nomina', 'insumos', 'arriendo', 'servicios_publicos', 'mantenimiento', 'general', 'otro'],
    },
    barberoId: {
      type: String,
      default: null, // si es pago a barbero
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

gastoSchema.index({ fecha: -1 });
gastoSchema.index({ categoria: 1 });

module.exports = mongoose.model('Gasto', gastoSchema);
