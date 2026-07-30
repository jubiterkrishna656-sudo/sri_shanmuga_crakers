const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboard);

module.exports = router;
