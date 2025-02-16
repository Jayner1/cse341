const { body, param, validationResult } = require('express-validator');

// Validation schema for creating and updating tasks
const taskValidation = [
  body('title')
    .isString()
    .withMessage('Title should be a string')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title should be between 3 and 100 characters long')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .isString()
    .withMessage('Description should be a string')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description should be between 5 and 500 characters long')
    .notEmpty()
    .withMessage('Description is required'),

  body('dueDate')
    .isISO8601()
    .withMessage('Due Date must be a valid date')
    .notEmpty()
    .withMessage('Due Date is required'),

  body('status')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed')
    .notEmpty()
    .withMessage('Status is required'),
];

// Validation for task ID in GET and DELETE routes
const validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format')
];

// Function to check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { taskValidation, validateTaskId, handleValidationErrors };
