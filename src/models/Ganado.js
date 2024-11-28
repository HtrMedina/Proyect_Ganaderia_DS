import mongoose from 'mongoose';

const ganadoSchema = new mongoose.Schema({
  reemo: { type: String, required: true}, // Consecutivo
  motivo: {type: String, enum: ['Cria', 'Engorda', 'Sacrificio'], required: true}, //Motivo de recepcion
  arrivalDate: { type: Date, default: Date.now },
  origin: { type: String }, // Origen del ganado (PSG, Nombre, etc.)
  destino: { type: String }, // Destino del ganado (PSG, Nombre, etc.)
  ganado:[{
  earTag: { type: String, required: true}, // Número de arete
  sex: { type: String, enum: ['Toro', 'Vaca'], required: true }, // Sexo
  age: { type: Number, required: true }, // Edad en meses
  classification: {
    type: String,
    enum: ['Becerro/Becerra', 'Torete/Vacona', 'Toro/Vaca'],
    required: true,
  },
  weight: { type: Number }, // Peso
  price: { type: Number }, // Precio de compra
  healthStatus: {
    type: String,
    enum: ['Sano', 'Enfermo', 'Herido'],
    default: 'Sano',
  }, // Estado de salud
}],
});

export const Ganado = mongoose.model('Ganado', ganadoSchema);
