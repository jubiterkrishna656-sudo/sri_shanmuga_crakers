const express = require('express');
const router = express.Router();
const { adminLogin, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { adminLoginRules } = require('../middleware/validate');

router.post('/admin-login', adminLoginRules, adminLogin);
router.get('/profile', auth, getProfile);

module.exports = router;
