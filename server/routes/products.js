const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productRules } = require('../middleware/validate');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', adminAuth, upload.single('image'), productRules, createProduct);
router.put('/:id', adminAuth, upload.single('image'), productRules, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;