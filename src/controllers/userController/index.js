const paymentModel = require('../../models/paymentModel');
const userModel = require('../../models/userModel');
const { formatDate } = require('../../utils/functions');
// const db = require('../../../db');

// Crear un usuario
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos' });
    };

    try {
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede usar este correo',
            });
        };

        const result = await userModel.createUser(name, email, password);
        const [user] = await userModel.getUserById(result.insertId);
        return res.status(201).json({ success: true, message: 'Usuario creado', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear usuario', error });
    };
};

const loginOrRegisterUser = async ({ name, email, password }) => {
    if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
    };

    // Buscar usuario por email
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser.length > 0) {
        const user = existingUser[0];

        // Validar contraseña
        if (user.password !== password) {
            throw new Error('Credenciales inválidas');
        };

        // Buscar la suscripción del usuario
        const subscription = await paymentModel.getPaymentByUserId(user.id);

        // Retornar el usuario logueado con la información de la suscripción
        return { user, subscription, isNewUser: false };
    };

    // Crear nuevo usuario
    if (!name) {
        throw new Error('Credenciales inválidas');
    };

    const result = await userModel.createUser(name, email, password);
    const [newUser] = await userModel.getUserById(result.insertId);

    // Retornar el nuevo usuario creado sin suscripción
    return { user: newUser, subscription: null, isNewUser: true };
};

const loginUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    };

    try {
        const { user, subscription, isNewUser } = await loginOrRegisterUser({ name, email, password });

        if (!subscription) {
            return res.status(200).json({
                success: true,
                message: isNewUser ? 'Usuario creado y logueado' : 'Login exitoso',
                user,
                subscription,
            });
        };

        const { amount, created_at, currency, status } = subscription;
        return res.status(200).json({
            success: true,
            message: isNewUser ? 'Usuario creado y logueado' : 'Login exitoso',
            user,
            subscription: { amount, created_at: formatDate(created_at), currency, status },
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createUser, loginUser };
