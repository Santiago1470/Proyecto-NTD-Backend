const express = require('express');
const router = express.Router();
const platos = require('../models/platosSchema');
const verifyToken = require('./tokenValidacion');

router.post("/platos", verifyToken, (req, res) => {
    let plato = platosSchema(req.body);
    plato.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.get("/platos", (req, res) => {
    platos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.get("/platos/:id", (req, res) => {
    const {id} = req.params;
    platos.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.put("/platos/:id", verifyToken, (req, res) => {
    const {id} = req.params;
    const {nombre, descripcion, precio, categoria, ingredientes, imagen} = req.body;
    platos.updateOne({_id: id}, {
        $set: {nombre, descripcion, precio, categoria, ingredientes, imagen}
    }).then((data) => res.json(data))
        .catch((data) => res.json({message: error}));
});

router.delete("/platos/:id", verifyToken, (req, res) => {
    const {id} = req.params;
    platos.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

module.exports = router;