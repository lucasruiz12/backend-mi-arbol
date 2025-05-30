const paymentModel = require('../../models/paymentModel');
const userModel = require('../../models/userModel');
const { formatDate, generateToken } = require('../../utils/functions');
const bcrypt = require('bcryptjs');
// const db = require('../../../db');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers(); // Llamamos al modelo para obtener los usuarios
        const data = users.map(el => {
            return {
                id: el.id,
                email: el.email,
                name: el.name,
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos correctamente',
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Crear un usuario
const createUser = async (req, res) => {
    const { name, email, password, carbonPoints, categoryPoints } = req.body;

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
        const result = await userModel.createUser(name, email, password, carbonPoints, categoryPoints);
        const [user] = await userModel.getUserById(result.insertId);
        const token = generateToken(user.id);
        return res.status(201).json({ success: true, message: 'Usuario creado', user, token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear usuario', error });
    };
};

const updateUser = async (req, res) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ success: false, message: 'Faltan datos' });
    }

    try {
        // Verifica si el usuario existe
        const user = await userModel.getUserById(userId);
        if (!user.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Actualiza el correo del usuario
        await userModel.updateUser(userId, { email });

        return res.status(200).json({ success: true, message: 'Correo actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el correo del usuario:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar usuario', error });
    }
};

const loginOrRegisterUser = async ({ name, email, password, carbonPoints, categoryPoints, sub }) => {
    if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
    };

    // Buscar usuario por email
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser.length > 0) {
        const user = existingUser[0];

        // Validar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        };

        // Buscar la suscripción del usuario
        const allSubscriptions = await paymentModel.getPaymentByUserId(user.id);

        // Retornar el usuario logueado con la información de la suscripción
        return { user, subscription: allSubscriptions ? allSubscriptions[allSubscriptions.length - 1] : null, allSubscriptions, isNewUser: false };
    };

    // Crear nuevo usuario
    if (!name) {
        throw new Error('Credenciales inválidas');
    };

    const result = await userModel.createUser(name, email, password, carbonPoints, categoryPoints, sub);
    const [newUser] = await userModel.getUserById(result.insertId);

    // Retornar el nuevo usuario creado sin suscripción
    return { user: newUser, subscription: null, isNewUser: true };
};

const loginUser = async (req, res) => {
    const { name, email, password, carbonPoints, categoryPoints, sub } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    };

    try {
        const { user, subscription, isNewUser, allSubscriptions } = await loginOrRegisterUser({ name, email, password, carbonPoints, categoryPoints, sub });

        const token = generateToken(user.id);

        if (!subscription) {
            return res.status(200).json({
                success: true,
                message: isNewUser ? 'Usuario creado y logueado' : 'Login exitoso',
                user,
                subscription,
                allSubscriptions,
                token,
            });
        };

        const { amount, created_at, currency, status } = subscription;
        return res.status(200).json({
            success: true,
            message: isNewUser ? 'Usuario creado y logueado' : 'Login exitoso',
            user,
            subscription: { amount, created_at: formatDate(created_at), currency, status },
            allSubscriptions,
            token,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAllUsers, createUser, updateUser, loginUser };
