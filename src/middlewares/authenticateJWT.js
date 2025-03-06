const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']; // Obtenemos el token del encabezado Authorization

    if (!token) {
        return res.status(403).json({ success: false, message: 'Sin autorización' });
    };

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Autorización incorrecta' });
        };
        req.user = user; // Agregamos la información del usuario al objeto request
        next(); // Llamamos al siguiente middleware o controlador
    });
};

module.exports = authenticateJWT;