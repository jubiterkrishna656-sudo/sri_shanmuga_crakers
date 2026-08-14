const express = require('express');
const router = express.Router();
const { getDashboard, getReports } = require('../controllers/userController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboard);
router.get('/reports', adminAuth, getReports);

module.exports = router;
