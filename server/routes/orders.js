const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');
const { placeOrderRules } = require('../middleware/validate');

router.post('/', auth, placeOrderRules, placeOrder);
router.get('/myorders', auth, getMyOrders);
router.get('/all', adminAuth, getAllOrders);
router.put('/status/:id', adminAuth, updateOrderStatus);

module.exports = router;