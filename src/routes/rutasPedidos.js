const express = require('express');
const router = express.Router();
const pedidos = require('../models/pedidosSchema');
//Se pone el token de validacion para que cualquiera que no este con la sesion iniciada no pueda entrar y pedir platos
const verifyToken = require('./tokenValidacion');
const { default: mongoose } = require('mongoose');

router.get('/carrito/:usuarioId', verifyToken, (req, res) => {
    pedidos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.get("/carrito/:id", (req, res) => {
    const {id} = req.params;
    pedidos.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.post('/carrito', verifyToken, (req, res) => {
    let pedido = pedidos(req.body)
    pedido.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.put('/carrito/estado/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let estado = req.body;
    pedidos.update({ _id: id }, { $set: { estado } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.delete("/carrito/:id", verifyToken, (req, res) => {
    const {id} = req.params;
    pedidos.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

module.exports = router;