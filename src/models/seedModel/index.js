const db = require('../../../db');
const { cleanBOM } = require('../../utils/functions');

const createSeed = async (user_id, google_coordinates_lat, google_coordinates_lng, address) => {
    try {
        const lat = cleanBOM(google_coordinates_lat);
        const lng = cleanBOM(google_coordinates_lng);
        const [result] = await db.execute(
            'INSERT INTO seeds (user_id, google_coordinates_lat, google_coordinates_lng, address) VALUES (?, ?, ?, ?)',
            [user_id, lat, lng, address]
        );
        return result;
    } catch (error) {
        console.error('Error al crear nueva semilla:', error);
        throw error;
    };
};

// const updateSeed = async (userId, fields) => {
//     try {
//         // Construimos la query dinámica
//         const keys = Object.keys(fields);
//         const values = Object.values(fields);
//         const updates = keys.map((key) => `${key} = ?`).join(', ');

//         // Actualizamos al usuario
//         const [result] = await db.execute(
//             `UPDATE seeds SET ${updates} WHERE id = ?`,
//             [...values, userId]
//         );
//         return result;
//     } catch (error) {
//         console.error('Error al actualizar usuario:', error);
//         throw error;
//     };
// };

const getSeeds = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM seeds');
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    };
};

const getSeedsByUserId = async (user_id) => {
    try {
        const [rows] = await db.execute('SELECT * FROM seeds WHERE user_id = ?', [user_id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener semillas por usuario:', error);
        throw error;
    }
};

module.exports = { createSeed, /*updateSeed,*/ getSeeds, getSeedsByUserId };
