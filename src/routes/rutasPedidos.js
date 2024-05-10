const express = require('express');
const router = express.Router();
const pedidos = require('../models/pedidosSchema');
const platos = require('../models/platosSchema');
//Se pone el token de validacion para que cualquiera que no este con la sesion iniciada no pueda entrar y pedir platos
const verifyToken = require('./tokenValidacion');
const { default: mongoose } = require('mongoose');
//GEt para los platos pedidos por un usuario con el webtoken
router.get('/carrito', verifyToken, (req, res) => {
    const usuarioId = req.userId;
    const pedido = { userID: usuarioId };
    pedidos.find({ usuario: usuarioId }).populate('platos')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
//GET para todos los pedidos que existan independiente del usuario
router.get("/carrito", (req, res) => {
    pedidos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.post('/carrito/', verifyToken, (req, res) => {
    let {platoId, estado} = req.body
    const plato =  platos.findById(platoId)
        .then(
            pedidos.platos.push(platoId),
             pedidos.save()
                .then((data) => res.json(data))
                .catch((error) => res.json({ message: "No se pudo almacenar el plato" }))
        )
        .catch((error) => res.json({ message: "No existe ese plato" }))
});


router.delete("/carrito/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    pedidos.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;