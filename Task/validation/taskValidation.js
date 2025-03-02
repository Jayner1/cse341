const { body, param, validationResult } = require('express-validator');

const taskValidation = [
  body('title')
    .isString()
    .withMessage('Title should be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title should be between 3 and 100 characters long')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .isString()
    .withMessage('Description should be a string')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description should be between 5 and 500 characters long')
    .notEmpty()
    .withMessage('Description is required'),

  body('dueDate')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Due Date must be in YYYY-MM-DD format (e.g., 2025-03-20)')
    .custom((value) => {
      const dueDate = new Date(value); // Converts "2025-03-20" to Date
      if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid date format');
      }
      const now = new Date();
      // Strip time for comparison
      dueDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      if (dueDate < now) {
        throw new Error('Due Date must be today or in the future');
      }
      return true;
    }),

  body('status')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed')
    .notEmpty()
    .withMessage('Status is required'),
];

const validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format')
];

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