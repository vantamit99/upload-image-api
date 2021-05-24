const jwt = require('jsonwebtoken');

module.exports.generateToken = (payload) => {
    return jwt.sign(payload, 'secret')
}

module.exports.verifyToken = (token) => {
    return jwt.verify(token, 'secret');
}