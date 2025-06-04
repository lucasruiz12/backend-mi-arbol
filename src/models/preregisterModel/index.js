const db = require('../../../db');

const getPreregisterByEmail = async (email) => {
    try {
        const [rows] = await db.execute('SELECT * FROM preregister WHERE email = ?', [email]);
        return rows;
    } catch (error) {
        console.error('Error al verificar preregistro con correo:', error);
        throw error;
    };
};

const createPreregister = async (name, email, carbonPoints, categoryPoints) => {
    try {
        await db.execute(
            'INSERT INTO preregister (name, email, carbonPoints, categoryPoints) VALUES (?, ?, ?, ?)',
            [name, email, carbonPoints, categoryPoints]
        );
    } catch (error) {
        console.error('Error al realizar el preregistro de usuario:', error);
        throw error;
    };
};

const getPreregisters = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM preregister');
        return rows;
    } catch (error) {
        console.error('Error al obtener preregistros:', error);
        throw error;
    };
};

module.exports = { createPreregister, getPreregisters, getPreregisterByEmail };
