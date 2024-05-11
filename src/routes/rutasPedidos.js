const express = require('express');
const router = express.Router();
const pedidos = require('../models/pedidosSchema');
const usuarios = require('../models/usuarioSchema');
const platos = require('../models/platosSchema');
const verifyToken = require('./tokenValidacion');


router.get('/carrito/mis-pedidos', verifyToken, async (req, res) => {
    const usuarioId = req.userId;
    try {
        const misPedidos = await pedidos.find({ usuario: usuarioId }).populate('platos');
        res.json(misPedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos del usuario' });
    }
});

// Obtener todos los pedidos (para administradores)
router.get('/carrito', verifyToken, async (req, res) => {
    try {
        const todosPedidos = await pedidos.find().populate('platos');
        res.json(todosPedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener todos los pedidos' });
    }
});

// Agregar un pedido al carrito del usuario
router.post('/carrito/agregar', verifyToken, async (req, res) => {
    const { usuarioId, platos } = req.body;
    try {
        const usuario = await usuarios.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }
        const platosIds = platos.map(plato => plato.plato);
        const platosExisten = await platos.find({ _id: { $in: platosIds } });
        if (platosExisten.length !== platos.length) {
            return res.status(404).json({ error: 'Algunos platos no existen' });
        }
        const pedido = new pedidos({
            usuario: usuarioId,
            platos: platos.map(({ plato, estado }) => ({ plato, estado }))
        });
        const nuevoPedido = await pedido.save();
        usuario.carrito.push(nuevoPedido._id);
        await usuario.save();
        res.status(200).json({ message: 'Pedido agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el pedido al carrito' });
    }
});

// Eliminar un plato del carrito del usuario
router.delete('/carrito/:pedidoId/plato/:platoId', verifyToken, async (req, res) => {
    const pedidoId = req.params.pedidoId;
    const platoId = req.params.platoId;
    try {
        const pedido = await pedidos.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe' });
        }
        const platoIndex = pedido.platos.findIndex(plato => plato.plato == platoId);
        if (platoIndex !== -1) {
            pedido.platos.splice(platoIndex, 1);
            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ message: "El plato no se encontró en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plato del carrito' });
    }
});

// Actualizar el estado de un plato en el carrito del usuario
router.put('/carrito/:pedidoId/plato/:platoId', verifyToken, async (req, res) => {
    const pedidoId = req.params.pedidoId;
    const platoId = req.params.platoId;
    const nuevoEstado = req.body.estado;
    try {
        const pedido = await pedidos.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe' });
        }
        const plato = pedido.platos.find(plato => plato.plato == platoId);
        if (plato) {
            plato.estado = nuevoEstado;
            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ message: "El plato no se encontró en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del plato en el carrito' });
    }
});
module.exports = router;