const db = require('../../../db');
const { formatDate } = require('../../utils/functions');

// Crear un registro de pago
const createPayment = async (stripePaymentId, amount, currency, status, userId) => {
    try {
        // const [result] = await db.execute(
        //     'INSERT INTO payments (stripe_payment_id, amount, currency, status, user_id) VALUES (?, ?, ?, ?, ?)',
        //     [stripePaymentId, amount, currency, status, userId]
        // );

        const date = new Date();
        // const created_at = formatDate(date);

        const [result] = await db.execute(
            'INSERT INTO payments (stripe_payment_id, amount, currency, status, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [stripePaymentId, amount, currency, status, userId, date]
        );
        return result;
    } catch (error) {
        console.error('Error al registrar el pago:', error);
        throw error;
    }
};

// Obtener un pago por su ID
const getPaymentById = async (paymentId) => {
    try {
        const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [paymentId]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        throw error;
    };
};

// Obtener el pago de un usuario
const getPaymentByUserId = async (userId) => {
    try {
        const [rows] = await db.execute('SELECT * FROM payments WHERE user_id = ?', [userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener los pagos del usuario:', error);
        throw error;
    };
};

module.exports = { createPayment, getPaymentById, getPaymentByUserId };
