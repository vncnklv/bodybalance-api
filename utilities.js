const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function generateToken(data) {
    return jwt.sign(data, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
    try {
        const data = jwt.verify(token, secret);
        return data;
    } catch {
        return undefined;
    }

}

function areEqualObjectIds(id1, id2) {
    return id1.equals(id2);
}

module.exports = { generateToken, verifyToken, areEqualObjectIds };