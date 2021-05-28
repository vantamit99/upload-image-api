const mongoose = require('mongoose');
const listUploadSchema = mongoose.Schema({
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },        
    _upload: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }       
})
const ListUpload = mongoose.model('ListUpload', listUploadSchema);
module.exports = ListUpload;