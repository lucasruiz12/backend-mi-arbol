const express = require('express');
const stripeController = require('../../controllers/stripeController');
const { validateCheckoutRequest } = require('../../middlewares/validateRequest');

const router = express.Router();

// Crear una sesión de pago
router.post('/checkout', validateCheckoutRequest, stripeController.createCheckoutSession);
router.post('/verifyPayment', stripeController.verifyPayment);

// Webhook de Stripe (usa `express.raw` para procesar el cuerpo como buffer)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.stripeWebhook);

module.exports = router;
