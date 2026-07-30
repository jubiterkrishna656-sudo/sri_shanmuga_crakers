const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, adminLogin } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerRules, loginRules, adminLoginRules, profileUpdateRules } = require('../middleware/validate');

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/admin-login', adminLoginRules, adminLogin);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, profileUpdateRules, updateProfile);

module.exports = router;