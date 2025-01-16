const express = require('express');
const userController = require('../../controllers/userController');

const router = express.Router();

// Ruta para crear un usuario
router.post('/create', userController.createUser);

// // Ruta para obtener todos los usuarios
// router.get('/', userController.getUsers);

// Ruta para login
router.post('/login', userController.loginUser);


module.exports = router;
