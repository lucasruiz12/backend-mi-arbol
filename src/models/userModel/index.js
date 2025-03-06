const db = require('../../../db');
const bcrypt = require('bcryptjs');


const getUserByEmail = async (email) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            const [bySub] = await db.execute('SELECT * FROM users WHERE sub = ?', [email]);
            return bySub;
        };
        return rows;
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        throw error;
    };
};

const createUser = async (name, email, password, carbonPoints, categoryPoints, sub) => {
    try {
        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, carbonPoints, categoryPoints, sub) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, carbonPoints, categoryPoints, sub ?? null]
        );
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    };
};

const updateUser = async (userId, fields) => {
    try {
        // Construimos la query dinámica
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        const updates = keys.map((key) => `${key} = ?`).join(', ');

        // Actualizamos al usuario
        const [result] = await db.execute(
            `UPDATE users SET ${updates} WHERE id = ?`,
            [...values, userId]
        );
        return result;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    };
};

const getUserById = async (userId) => {
    try {
        const [result] = await db.execute(`SELECT * FROM users WHERE id = "${userId}"`);
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    };
};

const getUsers = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    };
};

module.exports = { createUser, updateUser, getUsers, getUserById, getUserByEmail };
