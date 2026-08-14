const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByPhone, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const { placeOrderRules } = require('../middleware/validate');

router.post('/', optionalAuth, placeOrderRules, placeOrder);
router.get('/phone/:phone', optionalAuth, getOrdersByPhone);
router.get('/myorders', auth, getMyOrders);
router.get('/all', adminAuth, getAllOrders);
router.put('/status/:id', adminAuth, updateOrderStatus);

module.exports = router;