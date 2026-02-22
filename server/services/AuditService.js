const { AuditLog } = require('../models');

class AuditService {
    /**
     * Create an audit log entry
     */
    async log(data, transaction = null) {
        const {
            userId,
            userRole,
            action,
            entityType,
            entityId,
            oldValues = null,
            newValues = null,
            ipAddress = null,
            userAgent = null,
            requestMethod = null,
            requestUrl = null,
            statusCode = null,
            errorMessage = null,
            metadata = {}
        } = data;

        try {
            const auditLog = await AuditLog.create({
                userId,
                userRole,
                action,
                entityType,
                entityId,
                oldValues,
                newValues,
                ipAddress,
                userAgent,
                requestMethod,
                requestUrl,
                statusCode,
                errorMessage,
                metadata,
                timestamp: new Date()
            }, transaction ? { transaction } : {});

            return auditLog;
        } catch (error) {
            // Audit logging should never break the main flow
            console.error('Audit log creation failed:', error);
            return null;
        }
    }

    /**
     * Log API request
     */
    async logRequest(req, res, userId, userRole) {
        return await this.log({
            userId,
            userRole,
            action: req.method,
            entityType: 'API_REQUEST',
            entityId: null,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            statusCode: res.statusCode,
            metadata: {
                body: this.sanitizeBody(req.body),
                query: req.query,
                params: req.params
            }
        });
    }

    /**
     * Log authentication events
     */
    async logAuth(userId, action, success, metadata = {}, context = {}) {
        return await this.log({
            userId,
            userRole: metadata.role,
            action: action, // LOGIN, LOGOUT, LOGIN_FAILED, PASSWORD_RESET, etc.
            entityType: 'AUTH',
            entityId: userId,
            ipAddress: context.ip,
            userAgent: context.userAgent,
            statusCode: success ? 200 : 401,
            errorMessage: success ? null : metadata.error,
            metadata: {
                ...metadata,
                success
            }
        });
    }

    /**
     * Get audit trail for an entity
     */
    async getAuditTrail(entityType, entityId, options = {}) {
        const { limit = 50, offset = 0 } = options;

        const { count, rows } = await AuditLog.findAndCountAll({
            where: { entityType, entityId },
            order: [['timestamp', 'DESC']],
            limit,
            offset
        });

        return {
            logs: rows,
            total: count
        };
    }

    /**
     * Get user activity log
     */
    async getUserActivity(userId, options = {}) {
        const { limit = 50, offset = 0, startDate, endDate } = options;

        const where = { userId };
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp[Op.gte] = startDate;
            if (endDate) where.timestamp[Op.lte] = endDate;
        }

        const { count, rows } = await AuditLog.findAndCountAll({
            where,
            order: [['timestamp', 'DESC']],
            limit,
            offset
        });

        return {
            logs: rows,
            total: count
        };
    }

    /**
     * Sanitize sensitive data from request body
     */
    sanitizeBody(body) {
        if (!body) return null;

        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'refreshToken', 'otp', 'aadhaar'];

        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }
}

module.exports = new AuditService();
