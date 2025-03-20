const seedModel = require('../../models/seedModel');
// const { formatDate, generateToken } = require('../../utils/functions');
// const bcrypt = require('bcryptjs');
// const db = require('../../../db');

const getAllSeeds = async (req, res) => {
    try {
        const seeds = await seedModel.getSeeds(); // Llamamos al modelo para obtener los usuarios
        return res.status(200).json({
            success: true,
            message: 'Semillas obtenidas correctamente',
            data: seeds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener semillas',
            error: error.message
        });
    }
};

const getSeedsByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }

    try {
        const seeds = await seedModel.getSeedsByUserId(user_id);
        return res.status(200).json({
            success: true,
            message: 'Semillas obtenidas correctamente',
            data: seeds,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener semillas', error: error.message });
    }
};

// Crear un usuario
const createSeed = async (req, res) => {
    const { user_id, google_coordinates_lat, google_coordinates_lng } = req.body;

    if (!user_id || !google_coordinates_lat || !google_coordinates_lng) {
        return res.status(400).json({ success: false, message: 'Faltan datos' });
    };

    try {
        const result = await seedModel.createSeed(user_id, google_coordinates_lat, google_coordinates_lng);
        return res.status(201).json({ success: true, message: 'Semilla creada', seed: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear semilla', error });
    };
};

// const updateSeed = async (req, res) => {
//     const { userId, email } = req.body;

//     if (!userId || !email) {
//         return res.status(400).json({ success: false, message: 'Faltan datos' });
//     }

//     try {
//         // Verifica si el usuario existe
//         const user = await seedModel.getUserById(userId);
//         if (!user.length) {
//             return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
//         }

//         // Actualiza el correo del usuario
//         await seedModel.updateUser(userId, { email });

//         return res.status(200).json({ success: true, message: 'Correo actualizado correctamente' });
//     } catch (error) {
//         console.error('Error al actualizar el correo del usuario:', error);
//         return res.status(500).json({ success: false, message: 'Error al actualizar usuario', error });
//     }
// };

module.exports = { getAllSeeds, createSeed, getSeedsByUserId /*updateSeed*/ };
