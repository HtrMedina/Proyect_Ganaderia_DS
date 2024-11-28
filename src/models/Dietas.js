// models/Dietas.js
import mongoose from 'mongoose';

const dietaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  ingredientes: [{
    ingrediente: {
      type: String, // Aquí se guarda el nombre del ingrediente (por ejemplo: 'Tomate')
      required: true,
    },
    cantidad: {
      type: Number, // La cantidad del ingrediente (por ejemplo: 500, para 500 gramos)
      required: true,
    }
  }],
  fechaModificacion: {
    type: Date,
    default: Date.now, // Fecha de modificación, se actualiza automáticamente
  }
});

export default mongoose.model('Dieta', dietaSchema);
