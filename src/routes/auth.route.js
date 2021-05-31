const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const { upload } = require('../middleware/upload.middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout); 
router.get('/profile', auth.profileGet);
router.post('/profile', upload.any(), auth.profilePut);

module.exports = router;