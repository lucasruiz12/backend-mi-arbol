const express = require('express');
const authenticateJWT = require('../../middlewares/authenticateJWT');
const userController = require('../../controllers/userController');

const router = express.Router();

// Ruta para crear un usuario
router.post('/create', userController.createUser);
router.post('/update', userController.updateUser);

// Ruta para obtener todos los usuarios
router.get('/', authenticateJWT, userController.getAllUsers);

// Ruta para login
router.post('/login', userController.loginUser);


module.exports = router;
