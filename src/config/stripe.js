const Stripe = require('stripe');
const { config } = require('dotenv');

config(); // Para leer las variables de entorno

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = { stripe };