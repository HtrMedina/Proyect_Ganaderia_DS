import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0 // La cantidad no puede ser negativa
    },
    price: {
        type: Number,
        required: true,
        min: 0 // El precio no puede ser negativo
    }
});

export default mongoose.model('Product', productSchema);
