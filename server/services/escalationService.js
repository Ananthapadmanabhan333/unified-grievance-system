const cron = require('node-cron');
const { Grievance, ActionLog, User } = require('../models');
const { Op } = require('sequelize');

const escalateGrievances = async () => {
    try {
        const now = new Date();
        // Calculate escalation thresholds
        // L1: Immediate Overdue (0 hours past deadline)
        // L2: 24 Hours past deadline
        // L3: 48 Hours past deadline

        const overdueGrievances = await Grievance.findAll({
            where: {
                status: { [Op.notIn]: ['Resolved', 'Rejected'] },
                slaDeadline: { [Op.lt]: now }
            }
        });

        console.log(`[SLA Engine] Checking ${overdueGrievances.length} overdue grievances...`);

        for (const grievance of overdueGrievances) {
            let newLevel = grievance.escalationLevel;
            let actionDetails = '';

            const hoursOverdue = (now - new Date(grievance.slaDeadline)) / (1000 * 60 * 60);

            // Level 0 -> 1 (Dept Head)
            if (grievance.escalationLevel === 0 && hoursOverdue > 0) {
                newLevel = 1;
                actionDetails = 'Auto-Escalated to Level 1 (Department Head). SLA Breach Detected.';
            }
            // Level 1 -> 2 (District Admin)
            else if (grievance.escalationLevel === 1 && hoursOverdue > 24) {
                newLevel = 2;
                actionDetails = 'Auto-Escalated to Level 2 (District Administration). 24h Overdue.';
            }
            // Level 2 -> 3 (State Admin)
            else if (grievance.escalationLevel === 2 && hoursOverdue > 48) {
                newLevel = 3;
                actionDetails = 'Auto-Escalated to Level 3 (State Secretariat). 48h Overdue.';
            }

            if (newLevel > grievance.escalationLevel) {
                // Update Grievance
                await grievance.update({
                    escalationLevel: newLevel,
                    status: 'Escalated'
                });

                // Audit Log
                await ActionLog.create({
                    grievanceId: grievance.id,
                    action: 'AUTO_ESCALATION',
                    performedBy: null, // System Action
                    details: actionDetails,
                    prevStatus: grievance.status,
                    newStatus: 'Escalated'
                });

                console.log(`[SLA Engine] Grievance #${grievance.id} escalated to Level ${newLevel}.`);
            }
        }

    } catch (error) {
        console.error('[SLA Engine] Error:', error);
    }
};

const startEscalationService = () => {
    // Run every minute for demonstration (In production: every hour)
    cron.schedule('* * * * *', () => {
        escalateGrievances();
    });
    console.log('[SLA Engine] Escalation Service Started (Check every 1 min).');
};

module.exports = startEscalationService;
