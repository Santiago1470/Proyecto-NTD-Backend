const mongoose = require('mongose');
//Se crea un esquema para tener los pedidos, es decir los pedidos que cada persona tenga y su estado
//Asi para poder utilizar un GET(Ver platos), POST(Pedir comida) y PUT/DELETE(Gestionar Pedidos)
const pedidosSquema = new mongoose.Schema({
    platos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu' //Esto se cambiara luego para poner de referencia al esquema de los platos
    }],
    estado: {
        type: String,
        enum: ['Plato en preparación', 'Plato en camino', 'Plato entregado']//Estos de los platos pedidos, para saber en que fase andan, similar al de mercado libre cuando uno pide algo
    }
})
module.exports = mongoose.model('Pedidos', pedidosSquema)