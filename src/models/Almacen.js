import mongoose from "mongoose";

const almacenSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del producto (por ejemplo, Maíz, medicamento)
  quantity: { type: Number, required: true }, // Cantidad disponible en inventario
  unit: { type: String, enum: ['kg', 'pza', 'litro', 'saco'], required: true },
  priceUnit: { type: Number, required: true }, // Precio por unidad
  investment: { type: Number}, // Inversión total
  category: { 
    type: String, 
    enum: ['Ingrediente', 'Medicamento', 'Suministro'], 
    required: true 
  }, // Categoría del producto (Ingrediente, Medicamento, Suministro)
  ingresoDate: { type: Date, default: Date.now }, // Fecha de creación del registro
});

// Middleware para actualizar el campo ingresoDate cada vez que se guarde el documento
almacenSchema.pre('save', function(next) {
    this.ingresoDate = Date.now(); // Actualiza la fecha de ingreso cada vez que se guarda
    next();
  });

export default mongoose.model("Almacen", almacenSchema);
