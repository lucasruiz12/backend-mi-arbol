const jwt = require('jsonwebtoken');

const formatDate = (timestamp) => {
    const newDate = new Date(typeof timestamp === "number" ?  timestamp * 1000 : timestamp);

    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear(); // Año

    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate;
};


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

module.exports = { formatDate, generateToken }