const mongoose = require('mongoose');
const reservasSchema = mongoose.Schema({
    nombreCliente: {
        type: String,
        required: true
    },
    numeroPersonas: {
        type: Number,
        required: true
    },
    mesa: {
        type: Number,
        required: true,
        max: 20
    },
    fecha: {
        type: Date,
        required: true, 
        unique: true
    },
    hora: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Confirmada', 'Cancelada'],
        required: true
    }
});

module.exports = mongoose.model('Reservas', reservasSchema);