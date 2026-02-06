const sequelize = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const Grievance = require('./Grievance');
const ActionLog = require('./ActionLog');

// Associations
User.hasMany(Grievance, { foreignKey: 'userId' });
Grievance.belongsTo(User, { foreignKey: 'userId' });

Department.hasMany(Grievance, { foreignKey: 'departmentId' });
Grievance.belongsTo(Department, { foreignKey: 'departmentId' });

// Department Head Relationship
Department.belongsTo(User, { as: 'head', foreignKey: 'headUserId' });

// Logging
Grievance.hasMany(ActionLog, { foreignKey: 'grievanceId' });
ActionLog.belongsTo(Grievance, { foreignKey: 'grievanceId' });

User.hasMany(ActionLog, { foreignKey: 'performedBy' });
ActionLog.belongsTo(User, { as: 'actor', foreignKey: 'performedBy' });

module.exports = {
    sequelize,
    User,
    Department,
    Grievance,
    ActionLog
};
