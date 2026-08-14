const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { getProductReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { processImage } = upload;
const { productRules, productUpdateRules, reviewRules } = require('../middleware/validate');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', auth, reviewRules, addReview);
router.delete('/:id/reviews/:reviewId', auth, deleteReview);
router.get('/:id', getProduct);
router.post('/', adminAuth, upload.single('image'), processImage, productRules, createProduct);
router.put('/:id', adminAuth, upload.single('image'), processImage, productUpdateRules, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
