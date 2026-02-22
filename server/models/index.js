const sequelize = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const Grievance = require('./Grievance');
const ActionLog = require('./ActionLog');
const SLAConfig = require('./SLAConfig');
const Jurisdiction = require('./Jurisdiction');
const SLARule = require('./SLARule');

// New Enterprise Models
const GrievanceCategory = require('./GrievanceCategory');
const GrievanceStatusLog = require('./GrievanceStatusLog');
const EscalationLevel = require('./EscalationLevel');
const AIPrediction = require('./AIPrediction');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const Tenant = require('./Tenant');
const AICluster = require('./AICluster');
const AIRiskScore = require('./AIRiskScore');
const AIInsight = require('./AIInsight');
const ChatbotLog = require('./ChatbotLog');
const CitizenProfile = require('./CitizenProfile');
const LoginHistory = require('./LoginHistory');

// ============ RELATIONSHIPS ============

// Tenant Relationships
Tenant.hasMany(User, { foreignKey: 'tenantId' });
User.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Department, { foreignKey: 'tenantId' });
Department.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Grievance, { foreignKey: 'tenantId' });
Grievance.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.belongsTo(Jurisdiction, { foreignKey: 'jurisdictionId', as: 'rootJurisdiction' });

// User - Grievance (Citizen submission)
User.hasMany(Grievance, { foreignKey: 'userId', as: 'submittedGrievances' });
Grievance.belongsTo(User, { foreignKey: 'userId', as: 'submitter' });

// User - Department (Official's department)
Department.hasMany(User, { foreignKey: 'departmentId', as: 'staff' });
User.belongsTo(Department, { foreignKey: 'departmentId' });

// User - Jurisdiction
Jurisdiction.hasMany(User, { foreignKey: 'jurisdictionId' });
User.belongsTo(Jurisdiction, { foreignKey: 'jurisdictionId' });

// Department - Grievance
Department.hasMany(Grievance, { foreignKey: 'departmentId' });
Grievance.belongsTo(Department, { foreignKey: 'departmentId' });

// Department Head
Department.belongsTo(User, { as: 'head', foreignKey: 'headUserId' });

// Grievance Assignment
Grievance.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
User.hasMany(Grievance, { foreignKey: 'assignedTo', as: 'assignedGrievances' });

// GrievanceCategory Relationships
GrievanceCategory.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(GrievanceCategory, { foreignKey: 'departmentId' });

Grievance.belongsTo(GrievanceCategory, { foreignKey: 'grievanceCategoryId', as: 'categoryDetails' });
GrievanceCategory.hasMany(Grievance, { foreignKey: 'grievanceCategoryId' });

// GrievanceStatusLog Relationships
Grievance.hasMany(GrievanceStatusLog, { foreignKey: 'grievanceId', as: 'statusHistory' });
GrievanceStatusLog.belongsTo(Grievance, { foreignKey: 'grievanceId' });

User.hasMany(GrievanceStatusLog, { foreignKey: 'changedBy', as: 'statusChanges' });
GrievanceStatusLog.belongsTo(User, { foreignKey: 'changedBy', as: 'changedByUser' });

// AIPrediction Relationships
Grievance.hasMany(AIPrediction, { foreignKey: 'grievanceId', as: 'aiPredictions' });
AIPrediction.belongsTo(Grievance, { foreignKey: 'grievanceId' });

// Notification Relationships
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });

Grievance.hasMany(Notification, { foreignKey: 'grievanceId' });
Notification.belongsTo(Grievance, { foreignKey: 'grievanceId' });

// ActionLog Relationships (Legacy - keeping for backward compatibility)
Grievance.hasMany(ActionLog, { foreignKey: 'grievanceId' });
ActionLog.belongsTo(Grievance, { foreignKey: 'grievanceId' });

User.hasMany(ActionLog, { foreignKey: 'performedBy' });
ActionLog.belongsTo(User, { as: 'actor', foreignKey: 'performedBy' });

// SLA Rules links
Department.hasMany(SLARule, { foreignKey: 'departmentId' });
SLARule.belongsTo(Department, { foreignKey: 'departmentId' });

// AIRiskScore Relationships
Grievance.hasMany(AIRiskScore, { foreignKey: 'grievanceId' });
AIRiskScore.belongsTo(Grievance, { foreignKey: 'grievanceId' });

// AICluster Relationships
Grievance.belongsTo(AICluster, { foreignKey: 'clusterId' });
AICluster.hasMany(Grievance, { foreignKey: 'clusterId' });

// Citizen Profile (1:1)
User.hasOne(CitizenProfile, { foreignKey: 'userId', as: 'profile' });
CitizenProfile.belongsTo(User, { foreignKey: 'userId' });

// Login History (1:M)
User.hasMany(LoginHistory, { foreignKey: 'userId', as: 'loginHistory' });
LoginHistory.belongsTo(User, { foreignKey: 'userId' });

// AuditLog Relationships (Read-only, no foreign key constraints to prevent deletion issues)
// AuditLog is intentionally decoupled for immutability

module.exports = {
    sequelize,
    User,
    Department,
    Grievance,
    ActionLog,
    SLAConfig,
    Jurisdiction,
    SLARule,
    GrievanceCategory,
    GrievanceStatusLog,
    EscalationLevel,
    AIPrediction,
    Notification,
    AuditLog,
    Tenant,
    AICluster,
    AIRiskScore,
    AIInsight,
    AIInsight,
    ChatbotLog,
    CitizenProfile,
    LoginHistory
};

