const administrador = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta.' });
    }
}
module.exports = administrador;
