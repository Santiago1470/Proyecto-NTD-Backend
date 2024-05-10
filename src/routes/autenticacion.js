const express = require('express');
const router = express.Router();
const usuarios = require('../models/usuarioSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup", async (req, res) => {
    const { usuario, nombre, correoElectronico, contraseña, rol, carrito } = req.body;
    const user = new usuarios({
        usuario: usuario,
        nombre: nombre,
        correoElectronico: correoElectronico,
        contraseña: contraseña,
        rol:rol,
        carrito:carrito
    });
    user.contraseña = await user.encryptClave(user.contraseña);
    await user.save(); 
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.json({
        auth: true,
        token,
    });
});
router.post("/login", async (req, res) => {
    const { error } = usuarios.validate(req.body.correoElectronico, req.body.contraseña);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const user = await usuarios.findOne({ correoElectronico: req.body.correoElectronico });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const validPassword = await bcrypt.compare(req.body.contraseña, user.contraseña);
    if (!validPassword)
        return res.status(400).json({ error: "Clave no válida" });
    res.json({
        error: null,
        data: "Bienvenido(a)",
    });
});
module.exports = router;