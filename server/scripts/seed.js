const { sequelize, User, Department, SLAConfig } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        console.log('Database synced. Seeding...');

        // 1. Create Departments
        const d_roads = await Department.create({
            name: 'Roads & Infrastructure',
            code: 'RNI',
            slaHours: 48
        });

        const d_water = await Department.create({
            name: 'Water Supply',
            code: 'JAL',
            slaHours: 24
        });

        const d_elec = await Department.create({
            name: 'Electricity Board',
            code: 'PWR',
            slaHours: 6
        });

        // 2. Create SLA Configs
        await SLAConfig.bulkCreate([
            { category: 'Potholes', resolutionTimeHours: 48, escalationTimeHours: 24 },
            { category: 'Water Leakage', resolutionTimeHours: 24, escalationTimeHours: 12 },
            { category: 'No Power', resolutionTimeHours: 6, escalationTimeHours: 3 },
            { category: 'Garbage', resolutionTimeHours: 24, escalationTimeHours: 12 }
        ]);

        // 3. Create Users
        const password = await bcrypt.hash('admin123', 10);

        // Super Admin
        await User.create({
            name: 'State Admin',
            email: 'admin@gov.in',
            password,
            role: 'SuperAdmin',
            isApproved: true
        });

        // Department Heads
        const head_roads = await User.create({
            name: 'Chief Engineer Roads',
            email: 'head.roads@gov.in',
            password,
            role: 'Department Head',
            departmentId: d_roads.id,
            isApproved: true
        });

        await d_roads.update({ headUserId: head_roads.id });

        const head_water = await User.create({
            name: 'Chief Water Officer',
            email: 'head.water@gov.in',
            password,
            role: 'Department Head',
            departmentId: d_water.id,
            isApproved: true
        });

        await d_water.update({ headUserId: head_water.id });

        // Officers
        await User.create({
            name: 'Junior Engineer (Roads)',
            email: 'je.roads@gov.in',
            password,
            role: 'Department Officer',
            departmentId: d_roads.id,
            isApproved: true
        });

        // Citizens
        await User.create({
            name: 'Rahul Sharma',
            email: 'citizen@gmail.com',
            password,
            role: 'Citizen'
        });

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
