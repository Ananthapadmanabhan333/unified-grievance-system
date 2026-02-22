const auditService = require('../services/AuditService');

/**
 * Middleware to automatically log all requests
 */
const auditLogger = (req, res, next) => {
    // Capture response
    const originalSend = res.send;

    res.send = function (data) {
        res.send = originalSend; // Restore original send

        // Log after response is sent
        setImmediate(() => {
            if (req.user) {
                auditService.logRequest(req, res, req.user.id, req.user.role);
            }
        });

        return res.send(data);
    };

    next();
};

/**
 * Middleware to log specific entity changes
 */
const logEntityChange = (entityType) => {
    return async (req, res, next) => {
        // Store original data for comparison
        req.auditContext = {
            entityType,
            startTime: Date.now()
        };
        next();
    };
};

module.exports = {
    auditLogger,
    logEntityChange
};
