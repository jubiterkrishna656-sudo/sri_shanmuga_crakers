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
  body('price').exists({ checkFalsy: true }).withMessage('Price is required').customSanitizer(val => Number(val)).isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional({ values: 'falsy' }).customSanitizer(val => Number(val)).isFloat({ min: 0 }).withMessage('Discount price must be a positive number')
    .custom((val, { req }) => {
      const price = Number(req.body.price);
      if (val && price && val >= price) {
        throw new Error('Discount price must be less than the original price');
      }
      return true;
    }),
  body('stock').optional({ values: 'falsy' }).customSanitizer(val => Number(val)).isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured').customSanitizer(val => val === 'true' || val === true),
  handleValidation
];

const productUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Product name is required'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('price').optional().customSanitizer(val => Number(val)).isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional({ values: 'falsy' }).customSanitizer(val => Number(val)).isFloat({ min: 0 }).withMessage('Discount price must be a positive number')
    .custom((val, { req }) => {
      const price = Number(req.body.price);
      if (val && price && val >= price) {
        throw new Error('Discount price must be less than the original price');
      }
      return true;
    }),
  body('stock').optional({ values: 'falsy' }).customSanitizer(val => Number(val)).isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured').customSanitizer(val => val === 'true' || val === true),
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