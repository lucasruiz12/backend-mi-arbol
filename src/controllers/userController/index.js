// src/controllers/userController.js

const userModel = require('../../models/userModel');

// Crear un usuario
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const result = await userModel.createUser(name, email, password);
    return res.status(201).json({ message: 'Usuario creado', userId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

module.exports = { createUser, getUsers };
