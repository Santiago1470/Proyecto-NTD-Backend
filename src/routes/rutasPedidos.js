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
    pedidos.find({ usuario: usuarioId }).populate('Platos')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
//GET para todos los pedidos que existan independiente del usuario
router.get("/carrito", (req, res) => {
    pedidos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
//Aqui el estado y plato se ponen el el body
router.post('/carrito/', verifyToken, (req, res) => {
    let { platoId, estado } = req.body
    const plato = platos.findById(platoId)
    if (plato) {
        pedidos.platos.push({ plato: platoId, estado });
        pedidos.save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    }else {
        res.status(404).json({ message: "No existe ese plato" });
    }
});

//Elimina el plato del carrito, mediante el id del plato que ya haya sido ingresado
router.delete('/carrito/:platoId', verifyToken, (req, res) => {
    const platoId = req.params.platoId;
    const platoIndex = pedidos.platos.findIndex(plato => plato.plato == platoId);
    if (platoIndex !== -1) {
        pedidos.platos.splice(platoIndex, 1);
        pedidos.save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } else {
        res.status(404).json({ message: "El plato no se encontró en el carrito" });
    }
});
//Solo cambia el estado del plato, por lo que no cambia ni el plato ni el usuario
router.put('/carrito/:platoId', verifyToken, (req, res) => {
    const platoId = req.params.platoId;
    const nuevoEstado = req.body.estado;

    const platoIndex = pedidos.platos.findIndex(plato => plato.plato == platoId);
    if (platoIndex !== -1) {
        pedidos.platos[platoIndex].estado = nuevoEstado;
        pedidos.save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } else {
        res.status(404).json({ message: "El plato no se encontró en el carrito" });
    }
});

module.exports = router;