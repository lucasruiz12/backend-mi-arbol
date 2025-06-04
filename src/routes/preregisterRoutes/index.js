const express = require('express');
const authenticateJWT = require('../../middlewares/authenticateJWT');
const preregisterController = require('../../controllers/preregisterController');

const router = express.Router();

// Ruta para crear un preregistro
router.post('/create', preregisterController.createPreregister);

// Ruta para obtener todos los preregistros
router.get('/', authenticateJWT, preregisterController.getAllPreregisters);


module.exports = router;