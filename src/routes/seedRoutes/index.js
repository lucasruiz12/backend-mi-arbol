const express = require('express');
const authenticateJWT = require('../../middlewares/authenticateJWT');
const seedController = require('../../controllers/seedController');

const router = express.Router();

// Ruta para crear semilla
router.post('/create', authenticateJWT, seedController.createSeed);

// Ruta para obtener todas las semillas
router.get('/', authenticateJWT, seedController.getAllSeeds);
router.get('/user/:user_id', authenticateJWT, seedController.getSeedsByUserId);


module.exports = router;
