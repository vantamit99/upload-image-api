const mongoose = require('mongoose');
const uploadSchema = mongoose.Schema({
    cloudinary_id: String,
    image: String,
    title: String,
    created_at: Date,
    isLike: { type: Boolean, default: false }
})
const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;