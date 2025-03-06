const express = require('express');
const authenticateJWT = require('../../middlewares/authenticateJWT');
const validateCheckoutRequest = require('../../middlewares/validateRequest');
const stripeController = require('../../controllers/stripeController');

const router = express.Router();

// Crear una sesión de pago
router.post('/checkout', authenticateJWT, validateCheckoutRequest, stripeController.createCheckoutSession);
router.post('/verifyPayment', stripeController.verifyPayment);

// Webhook de Stripe (usa `express.raw` para procesar el cuerpo como buffer)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.stripeWebhook);

module.exports = router;
