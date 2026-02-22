const cron = require('node-cron');
const { Grievance, User, Department, ActionLog, sequelize } = require('../models');
const { Op } = require('sequelize');

const startSLAMonitoring = () => {
    // Run every minute for demonstration (Use '0 * * * *' for hourly in production)
    cron.schedule('* * * * *', async () => {
        console.log('--- SLA Monitor Running ---');

        try {
            const now = new Date();

            // Find overdue grievances that are not yet max escalated
            const overdueGrievances = await Grievance.findAll({
                where: {
                    status: { [Op.notIn]: ['Resolved', 'Rejected'] }, // Active tickets only
                    slaDeadline: { [Op.lt]: now }, // Deadline passed
                    escalationLevel: { [Op.lt]: 2 } // Max level 2 (Admin)
                },
                include: [{ model: Department }]
            });

            for (const grievance of overdueGrievances) {
                console.log(`Processing SLA Breach for Grievance #${grievance.id}`);

                const nextLevel = grievance.escalationLevel + 1;
                let newAssigneeId = null;
                let escalationNote = '';

                if (nextLevel === 1) {
                    // Escalate to Department Head
                    newAssigneeId = grievance.Department ? grievance.Department.headUserId : null;
                    escalationNote = 'SLA Breached. Escalated to Department Head.';
                } else if (nextLevel === 2) {
                    // Escalate to Super Admin (Find first SuperAdmin for now)
                    const admin = await User.findOne({ where: { role: 'SuperAdmin' } });
                    newAssigneeId = admin ? admin.id : null;
                    escalationNote = 'Critical SLA Breach. Escalated to State Admin.';
                }

                if (newAssigneeId) {
                    // Perform Escalation
                    await grievance.update({
                        escalationLevel: nextLevel,
                        assignedTo: newAssigneeId,
                        status: 'Escalated',
                        slaDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000) // +24 hours for escalated handling
                    });

                    // Log Action
                    await ActionLog.create({
                        grievanceId: grievance.id,
                        performedBy: newAssigneeId, // System action attributed to new owner or system user? (Using new owner for visibility or 1 for system)
                        action: 'AUTO_ESCALATION',
                        details: `${escalationNote} Previous Deadline: ${grievance.slaDeadline}`,
                        prevStatus: grievance.status,
                        newStatus: 'Escalated'
                    });

                    console.log(`-> Escalated Grievance #${grievance.id} to User #${newAssigneeId}`);
                } else {
                    console.log(`-> Could not escalate Grievance #${grievance.id}: No assignee found for level ${nextLevel}`);
                }
            }
        } catch (error) {
            console.error('SLA Monitor Error:', error);
        }
    });
};

module.exports = startSLAMonitoring;
