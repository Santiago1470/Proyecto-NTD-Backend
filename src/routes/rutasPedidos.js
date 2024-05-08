const express = require('express');
const routes = express.Router();
const pedidos = require('../models/pedidosSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Se pone el token de validacion para que cualquiera que no este con la sesion iniciada no pueda entrar y pedir platos
const verifyToken = require('./tokenValidacion');

routes.get('/carrito', verifyToken, (req, res) => {
    pedidos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

routes.post('/pedidos', verifyToken, (req, res) => {
    let pedido = pedidos(req.body)
    pedido.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

routes.put('/carrito/estado/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let estado = req.body;
    pedidos.update({ _id: id }, { $set: { estado } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})