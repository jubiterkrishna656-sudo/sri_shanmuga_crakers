const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { placeOrder, getOrdersByPhone, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const { placeOrderRules } = require('../middleware/validate');

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many orders. Please try again later.' }
});

router.post('/', optionalAuth, orderLimiter, placeOrderRules, placeOrder);
router.get('/phone/:phone', optionalAuth, getOrdersByPhone);
router.get('/myorders', auth, getMyOrders);
router.get('/all', adminAuth, getAllOrders);
router.put('/status/:id', adminAuth, updateOrderStatus);
router.delete('/:id', adminAuth, deleteOrder);

module.exports = router;