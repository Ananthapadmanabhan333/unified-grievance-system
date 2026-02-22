const { sequelize, Grievance, Department, User, Jurisdiction } = require('../models');

const seedAnalytics = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced. Seeding Analytics Data...');

        // 1. Get Depts and Jurisdictions
        const depts = await Department.findAll();
        const districts = await Jurisdiction.findAll({ where: { type: 'District' } });
        const citizens = await User.findAll({ where: { role: 'Citizen' } });

        if (depts.length === 0 || districts.length === 0) {
            console.log('Please run seedDepartments.js and seedNationalData.js first.');
            process.exit(1);
        }

        // 2. Create Dummy Grievances
        const statuses = ['Resolved', 'Resolved', 'Resolved', 'Pending', 'In Progress', 'Escalated'];
        const priorities = ['Low', 'Medium', 'High', 'Critical'];

        const grievances = [];

        for (let i = 0; i < 50; i++) {
            const randomDept = depts[Math.floor(Math.random() * depts.length)];
            const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
            // Create a temporary submitter in that district if needed, or just link existing user?
            // For Heatmap, we need submitter -> jurisdiction. 
            // We'll Create a mock user for each if citizens lists is small or just assign random jurisdiction to the grievance submitter.
            // Actually, the Analytics query joins User. So we need Users in those jurisdictions.

            // Let's create a temp user for this grievance in that district
            const tempUser = await User.create({
                name: `Citizen ${i}`,
                email: `citizen${i}_${Date.now()}@test.com`,
                phone: `99999${i.toString().padStart(5, '0')}`,
                role: 'Citizen',
                jurisdictionId: randomDistrict.id,
                password: 'hashedpassword'
            });

            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const isResolved = status === 'Resolved';
            const slaDeadline = new Date();
            slaDeadline.setDate(slaDeadline.getDate() - Math.floor(Math.random() * 5)); // Deadline was 0-5 days ago

            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 10)); // Created 0-10 days ago

            // 80% chance of being resolved ON TIME if resolved
            const updatedAt = new Date(createdAt);
            updatedAt.setDate(updatedAt.getDate() + 1); // Solved in 1 day

            // If resolved, did it breach?
            // Let's make some breach
            if (i % 5 === 0) updatedAt.setDate(updatedAt.getDate() + 10); // Late resolution

            grievances.push({
                title: `Issue in ${randomDistrict.name}`,
                description: `Automatically generated grievance for ${randomDept.name}`,
                category: 'General',
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                status: status,
                departmentId: randomDept.id,
                userId: tempUser.id,
                jurisdictionId: randomDistrict.id, // Direct link if model supports, else via User
                slaDeadline: slaDeadline,
                createdAt: createdAt,
                updatedAt: isResolved ? updatedAt : new Date()
            });
        }

        await Grievance.bulkCreate(grievances);

        console.log(`Seeded 50 grievances across ${districts.length} districts.`);
        process.exit();

    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedAnalytics();
