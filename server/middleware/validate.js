const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
  body('pincode').optional().isLength({ min: 6, max: 6 }).matches(/^[0-9]+$/).withMessage('Valid 6-digit pincode is required'),
  body('address').optional().trim(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const adminLoginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const profileUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
  body('address').optional().trim(),
  body('pincode').optional().isLength({ min: 6, max: 6 }).matches(/^[0-9]+$/).withMessage('Valid 6-digit pincode is required'),
  handleValidation
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional().isFloat({ min: 0 }).withMessage('Discount price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation
];

const placeOrderRules = [
  body('address').trim().notEmpty().withMessage('Delivery address is required'),
  handleValidation
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  handleValidation
];

module.exports = { registerRules, loginRules, adminLoginRules, profileUpdateRules, productRules, placeOrderRules, reviewRules };