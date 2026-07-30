const express = require('express');
const router = express.Router();
const { getUsers, toggleBlock } = require('../controllers/userController');
const { adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getUsers);
router.put('/block/:id', adminAuth, toggleBlock);

module.exports = router;
