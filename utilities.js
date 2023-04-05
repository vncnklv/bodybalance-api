const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const mongoose = require('mongoose');

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

function areEqualObjectIds(id1, id2) {
    return id1.equals(id2);
}

module.exports = { generateToken, verifyToken, areEqualObjectIds };