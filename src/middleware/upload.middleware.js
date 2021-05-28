const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './src/public/assets/uploads/',
    filename: function (req, file, callback) {
        callback(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

module.exports = { upload };