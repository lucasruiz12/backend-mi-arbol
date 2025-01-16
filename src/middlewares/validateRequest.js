const validateCheckoutRequest = (req, res, next) => {
    const { amount, userId } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'El monto es obligatorio y debe ser un número positivo.' });
    }

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'El ID de usuario es obligatorio y debe ser una cadena.' });
    }

    // Puedes agregar más validaciones según tu caso (por ejemplo, verificar que el usuario existe en la base de datos)

    next();  // Si todo es válido, continúa con el siguiente middleware o controlador
};

module.exports = { validateCheckoutRequest };
