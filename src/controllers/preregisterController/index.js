const preregisterModel = require('../../models/preregisterModel');
const { formatDate, generateToken } = require('../../utils/functions');

const getAllPreregisters = async (req, res) => {
    try {
        const users = await preregisterModel.getPreregisters(); // Llamamos al modelo para obtener los usuarios
        const data = users.map(el => {
            return {
                id: el.id,
                email: el.email,
                name: el.name,
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Preregistros obtenidos correctamente',
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener preregistros',
            error: error.message
        });
    }
};

// Crear un usuario
const createPreregister = async (req, res) => {
    const { name, email, carbonPoints, categoryPoints } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Faltan datos' });
    };

    try {
        const existingUser = await preregisterModel.getPreregisterByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Este correo ya fue preregistrado',
            });
        };
        const result = await preregisterModel.createPreregister(name, email, carbonPoints, categoryPoints);
        return res.status(201).json({ success: true, message: 'Preregistro creado correctamente', result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear preregistro', error });
    };
};

module.exports = { getAllPreregisters, createPreregister};
