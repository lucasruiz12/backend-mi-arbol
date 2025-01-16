const Stripe = require('stripe');
const { config } = require('dotenv');

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = { stripe };