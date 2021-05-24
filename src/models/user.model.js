const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    _role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    firstname: String,
    lastname: String,
    email: String,
    password: String
})
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;