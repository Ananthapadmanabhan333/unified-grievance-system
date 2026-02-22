const { sequelize, Grievance, Department } = require('../models');

const waitForEscalation = async () => {
    try {
        await sequelize.sync();

        // 1. Create a "Past Due" Grievance
        const dept = await Department.findOne();
        const grievance = await Grievance.create({
            title: 'Integration Test Grievance',
            description: 'Waiting for cron job to escalate me.',
            category: 'Potholes',
            priority: 'Medium',
            userId: 1,
            departmentId: dept.id,
            status: 'Pending',
            slaDeadline: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours overdue
            escalationLevel: 0
        });

        console.log(`[Test] Created Grievance #${grievance.id}. Deadline was 2h ago.`);
        console.log('[Test] Waiting for Cron Job (Max 90s)...');

        // 2. Poll for changes
        let attempts = 0;
        const maxAttempts = 9; // 90 seconds (since check is every 10s)

        const interval = setInterval(async () => {
            attempts++;
            const g = await Grievance.findByPk(grievance.id);

            if (g.status === 'Escalated' || g.escalationLevel > 0) {
                console.log(`[Success] Grievance #${g.id} was auto-escalated to Level ${g.escalationLevel}!`);
                console.log(`[Success] Status: ${g.status}`);
                clearInterval(interval);
                process.exit(0);
            }

            if (attempts >= maxAttempts) {
                console.error('[Failed] Timeout: Grievance was not escalated after 90s.');
                clearInterval(interval);
                process.exit(1);
            }

            process.stdout.write('.');
        }, 10000);

    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
};

waitForEscalation();
