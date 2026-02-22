const { sequelize, Department } = require('../models');

const seedDepartments = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        const departments = [
            { name: 'Police Department', code: 'POL', slaHours: 24 },
            { name: 'Health & Family Welfare', code: 'HLT', slaHours: 24 },
            { name: 'Fire & Emergency Services', code: 'FIR', slaHours: 12 },
            { name: 'Revenue (Land Records)', code: 'REV', slaHours: 72 },
            { name: 'Urban Development (Municipal)', code: 'MUN', slaHours: 48 },
            { name: 'Rural Development', code: 'RUR', slaHours: 72 },
            { name: 'Transport (RTO)', code: 'TRN', slaHours: 48 },
            { name: 'Education', code: 'EDU', slaHours: 72 },
            { name: 'Electricity Board (Power)', code: 'PWR', slaHours: 24 },
            { name: 'Water & Sanitation', code: 'WAT', slaHours: 24 },
            { name: 'Public Works Department (PWD)', code: 'PWD', slaHours: 72 },
            { name: 'Agriculture', code: 'AGR', slaHours: 96 },
            { name: 'Food & Civil Supplies', code: 'FCS', slaHours: 48 },
            { name: 'Excise & Taxation', code: 'EXC', slaHours: 72 },
            { name: 'Forest & Environment', code: 'FOR', slaHours: 96 },
            { name: 'Women & Child Development', code: 'WCD', slaHours: 48 },
            { name: 'Labour & Employment', code: 'LAB', slaHours: 72 }
        ];

        for (const dept of departments) {
            // Upsert (Create or Update)
            const [record, created] = await Department.findOrCreate({
                where: { code: dept.code },
                defaults: dept
            });

            if (!created) {
                await record.update(dept);
            }
        }

        console.log(`Seeded ${departments.length} Departments successfully.`);
        process.exit();

    } catch (error) {
        console.error('Department Seeding Failed:', error);
        process.exit(1);
    }
};

seedDepartments();
