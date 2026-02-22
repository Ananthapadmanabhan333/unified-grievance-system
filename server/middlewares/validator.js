const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

/**
 * Grievance creation validation rules
 */
const validateGrievanceCreate = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20, max: 5000 }).withMessage('Description must be between 20 and 5000 characters'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
    body('location')
        .optional()
        .isObject().withMessage('Location must be an object'),
    body('images')
        .optional()
        .isArray().withMessage('Images must be an array'),
    validate
];

/**
 * User registration validation
 */
const validateUserRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    validate
];

/**
 * Login validation
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

/**
 * OTP validation
 */
const validateOTP = [
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .matches(/^[0-9]{6}$/).withMessage('OTP must be 6 digits'),
    validate
];

/**
 * Status update validation
 */
const validateStatusUpdate = [
    param('id')
        .isInt().withMessage('Invalid grievance ID'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Pending', 'In Progress', 'Resolved', 'Escalated', 'Rejected']).withMessage('Invalid status'),
    body('remarks')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Remarks must not exceed 1000 characters'),
    validate
];

/**
 * Pagination validation
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate
];

/**
 * ID parameter validation
 */
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid ID'),
    validate
];

module.exports = {
    validate,
    validateGrievanceCreate,
    validateUserRegistration,
    validateLogin,
    validateOTP,
    validateStatusUpdate,
    validatePagination,
    validateId
};
