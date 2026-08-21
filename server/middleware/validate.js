const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

const adminLoginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional().isFloat({ min: 0 }).withMessage('Discount price must be a positive number')
    .custom((val, { req }) => {
      if (val && req.body.price && val >= req.body.price) {
        throw new Error('Discount price must be less than the original price');
      }
      return true;
    }),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation
];

const productUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Product name is required'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional().isFloat({ min: 0 }).withMessage('Discount price must be a positive number')
    .custom((val, { req }) => {
      if (val && req.body.price && val >= req.body.price) {
        throw new Error('Discount price must be less than the original price');
      }
      return true;
    }),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation
];

const placeOrderRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email address is required'),
  body('address').trim().notEmpty().withMessage('Delivery address is required'),
  handleValidation
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  handleValidation
];

module.exports = { adminLoginRules, productRules, productUpdateRules, placeOrderRules, reviewRules };