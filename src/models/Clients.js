import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String, 
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Asegura que el teléfono tenga 10 dígitos
            },
            message: props => `${props.value} no es un número de teléfono válido!`
        }
    }
});

export default mongoose.model('Client', clientSchema);
