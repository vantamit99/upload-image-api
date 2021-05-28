const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    _role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    image: {type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png'}
})
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;