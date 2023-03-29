const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function generateToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };