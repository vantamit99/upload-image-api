const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');

router.get('/manager', user.manager)

module.exports = router;