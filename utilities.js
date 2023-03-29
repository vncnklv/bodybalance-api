const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function generateToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    try {
        const userData = jwt.verify(token, secret);
        return userData.userId;
    } catch {
        return undefined;
    }

}

module.exports = { generateToken, verifyToken };