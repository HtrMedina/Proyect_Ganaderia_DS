import mongoose from "mongoose";

const tratamientoSchema = new mongoose.Schema({
  numeroArete: {
    type: String,
    required: true, // El número de arete es obligatorio
    trim: true      // Elimina los espacios en blanco al inicio y al final
  },
  tipoTratamiento: {
    type: String,
    enum: ['Preventivo', 'Curativo'], // Definimos los tipos posibles de tratamiento
    required: true
  },
  proposito: {
    type: String,
    required: true, // El propósito es obligatorio
    trim: true
  },
  nombreMedicamento: {
    type: String,
    required: true, // El nombre del medicamento es obligatorio
    trim: true
  },
  fechaColocacion: {
    type: Date,
    required: true, // La fecha de colocación es obligatoria
    default: Date.now // Por defecto, si no se especifica, la fecha será la actual
  },
  quienColoco: {
    type: String,
    required: true, // El nombre de la persona que colocó el tratamiento es obligatorio
    trim: true
  }
}, {
  timestamps: true // Esto agregará los campos "createdAt" y "updatedAt"
});

export default mongoose.model("Tratamiento", tratamientoSchema);
