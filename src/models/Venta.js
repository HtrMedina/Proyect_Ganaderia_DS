import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  reemo: { 
    type: String, // Debe ser un ObjectId, ya que hace referencia a un documento de Ganado
    ref: 'Ganado',  // Relación con la colección Ganado
    required: true
  },
  ganado: [{ 
    type: String,  // Solo almacenamos los números de arete
    required: true
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  }, // Total de la venta
  saleDate: {
    type: Date,
    default: Date.now
  }, // Fecha de la venta
  customer: { 
    type: String, 
    required: true 
  }, // Nombre del cliente o comprador
  status: {
    type: String,
    enum: ['Pagado', 'Pendiente'],
    default: 'Pendiente'
  } // Estado del pago de la venta
});

export const Venta = mongoose.model('Venta', ventaSchema);
