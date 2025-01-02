const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config();

// Crear la conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Exportar la conexión para usar en otras partes
module.exports = pool.promise();
