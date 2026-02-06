const { sequelize, User, Department } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        // Create Departments
        const roadDept = await Department.create({
            name: 'Roads & Infrastructure',
            slaHours: 48
        });

        const waterDept = await Department.create({
            name: 'Water Supply',
            slaHours: 24
        });

        // Create Admin
        const password = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Super Admin',
            email: 'admin@gov.in',
            password,
            role: 'Admin'
        });

        // Create Dept Head
        await User.create({
            name: 'Road Officer',
            email: 'roads@gov.in',
            password,
            role: 'Department Head'
        });

        console.log('Database seeded!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
