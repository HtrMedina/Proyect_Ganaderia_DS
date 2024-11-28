import mongoose from 'mongoose';

// Definir el esquema del ganadero
const ganaderoSchema = new mongoose.Schema({
  psg: { type: String, required: true },  // ID del ganadero
  nombre: { type: String, required: true },  // Nombre del ganadero
  razonSocial: { type: String, required: true },  // Razón Social
  domicilio: { type: String, required: true },  // Domicilio
  localidad: { type: String, required: true },  // Localidad
  municipio: { type: String, required: true },  // Municipio
  estado: { type: String, required: true },  // Estado
});

// Exportar el modelo de Ganadero
export const Ganadero = mongoose.model('Ganadero', ganaderoSchema);
