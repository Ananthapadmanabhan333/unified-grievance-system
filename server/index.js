const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const sequelize = require('./config/database');
const startEscalationService = require('./services/escalationService');

// Middleware imports
const { securityHeaders, corsOptions } = require('./middlewares/securityHeaders');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { auditLogger } = require('./middlewares/auditLogger');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ SECURITY MIDDLEWARE ============
// Must be applied before routes

// Security headers (Helmet)
app.use(securityHeaders);

// CORS
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Request logging (Morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (apply to all routes)
// Rate limiting (apply to all routes)
// app.use(apiLimiter);

// Audit logging
// app.use(auditLogger);

// ============ ROUTES ============
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

try {
    app.use('/api/grievances', require('./routes/grievances'));
} catch (err) {
    console.error('FAILED TO LOAD GRIEVANCE ROUTE:', err);
}

try {
    app.use('/api/analytics', require('./routes/analytics'));
} catch (err) {
    console.error('FAILED TO LOAD ANALYTICS ROUTE:', err);
}

try {
    app.use('/api/ai', require('./routes/ai'));
} catch (err) {
    console.error('FAILED TO LOAD AI ROUTE:', err);
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
    res.send('GovTech National Unified Grievance Platform API - Production Ready');
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    const fs = require('fs');
    fs.appendFileSync('error_global.log', `[${new Date().toISOString()}] Global Error: ${err.message}\n${err.stack}\nRequest Path: ${req.path}\n\n`);

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
        ...(isDevelopment && { details: err })
    });
});

// ============ DATABASE & SERVER START ============
const startServer = async () => {
    try {
        await sequelize.sync({ alter: false }); // Manual migrations used
        console.log('✓ Database connected successfully.');

        // Start Background Jobs
        startEscalationService();
        console.log('✓ SLA Escalation Service started.');

        // Start AI Background Jobs
        // const { startScheduler } = require('./services/scheduler');
        // startScheduler();
        // console.log('✓ AI Scheduler started.');

        app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('✗ Unable to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await sequelize.close();
    process.exit(0);
});

startServer();

