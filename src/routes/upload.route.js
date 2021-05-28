const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { upload } = require('../middleware/upload.middleware');

router.post('/', upload.any(), uploadController.post)

module.exports = router;