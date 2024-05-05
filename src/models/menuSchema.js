const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Festivo'],
        required: false
    },
    platos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Platos' // Esto se cambiara luego para poner de referencia al esquema de los platos
    },
    descripcion: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model("Menu", menuSchema);