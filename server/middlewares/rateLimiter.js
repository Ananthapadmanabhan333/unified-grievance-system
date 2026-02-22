const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true // Don't count successful logins
});

// OTP request limiter
const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Max 3 OTP requests per minute
    message: 'Too many OTP requests, please wait before requesting again.'
});

// Grievance submission limiter
const grievanceLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Max 10 grievances per hour per IP
    message: 'Grievance submission limit reached. Please try again later.'
});

module.exports = {
    apiLimiter,
    authLimiter,
    otpLimiter,
    grievanceLimiter
};

