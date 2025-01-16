require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const stripeRoutes = require('./src/routes/stripeRoutes');
// const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


// CREATE TABLE payments (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   stripe_payment_id VARCHAR(255) NOT NULL,
//   amount DECIMAL(10, 2) NOT NULL,
//   currency VARCHAR(10) NOT NULL DEFAULT 'usd',
//   status VARCHAR(50) NOT NULL,
//   user_id INT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );