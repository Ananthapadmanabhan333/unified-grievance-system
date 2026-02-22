/**
 * Tenant isolation middleware
 * Ensures users can only access data from their own tenant
 */
const tenantIsolation = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Attach tenant ID to request for use in queries
    req.tenantId = req.user.tenantId;

    // For SuperAdmin, allow access to all tenants
    if (req.user.role === 'SuperAdmin') {
        req.tenantId = null; // No restriction
    }

    next();
};

/**
 * Enforce tenant isolation in query
 */
const enforceTenantFilter = (query, req) => {
    if (req.tenantId !== null && req.tenantId !== undefined) {
        query.tenantId = req.tenantId;
    }
    return query;
};

module.exports = {
    tenantIsolation,
    enforceTenantFilter
};
