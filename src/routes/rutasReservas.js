const express = require('express');
const router = express.Router();
const reservas = require('../models/reservasSchema');
const verifyToken = require('./tokenValidacion');
const admin = require('./administrador');

router.post("/reservas", verifyToken, (req, res) => {
    let reserva = reservas(req.body);
    reserva.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
//Del usuario al cual ha iniciado sesion
router.get("/reservas", verifyToken, (req, res) => {
    const usuarioId = req.userId;
    pedidos.find({ usuario: usuarioId }).populate('Reservas')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Todas las reservas disponibles de todos los usuarios
router.get("/reservas", admin, (req, res) => {
    reservas.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Debe tener el token de validación puesto que eso es por cada usuario 
router.get("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    reservas.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.put("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { nombreCliente, numeroPersonas, mesa, fecha, hora, estado } = req.body;
    reservas.updateOne({ _id: id }, {
        $set: { nombreCliente, numeroPersonas, mesa, fecha, hora, estado }
    }).then((data) => res.json(data))
        .catch((data) => res.json({ message: error }));
});

router.delete("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    reservas.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;