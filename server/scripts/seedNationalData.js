const { sequelize, User, Department, Jurisdiction, SLARule } = require('../models');
const bcrypt = require('bcryptjs');

const seedNationalData = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        // 1. Create Jurisdictions (Hierarchy)
        // Root: Nation
        const india = await Jurisdiction.create({
            name: 'India',
            type: 'National',
            code: 'IND',
            parentId: null
        });

        // State: Delhi
        const delhiState = await Jurisdiction.create({
            name: 'Delhi',
            type: 'State',
            code: 'DL',
            parentId: india.id
        });

        // District: New Delhi
        const newDelhiDist = await Jurisdiction.create({
            name: 'New Delhi',
            type: 'District',
            code: 'DL-ND',
            parentId: delhiState.id
        });

        // Ward: Civil Lines
        const civilLinesWard = await Jurisdiction.create({
            name: 'Civil Lines',
            type: 'Ward/Block',
            code: 'DL-ND-CL',
            parentId: newDelhiDist.id
        });

        console.log('Jurisdictions Created.');

        // 2. Create Departments (Standard List)
        const deptNames = ['Public Works (PWD)', 'Health', 'Education', 'Police', 'Water Board', 'Electricity (DISCOM)'];
        const departments = {};

        for (const name of deptNames) {
            const dept = await Department.create({
                name: name,
                code: name.substring(0, 3).toUpperCase(),
                slaHours: 48 // Default
            });
            departments[name] = dept;
        }

        console.log('Departments Created.');

        // 3. Create Users (RBAC)
        const passwordHash = await bcrypt.hash('password123', 10);

        // Super Admin (National)
        await User.create({
            name: 'Cabinet Secretary',
            email: 'superadmin@gov.in',
            password: passwordHash,
            role: 'SuperAdmin',
            jurisdictionId: india.id,
            verificationStatus: 'Fully Verified'
        });

        // State Admin (Delhi)
        await User.create({
            name: 'Chief Secretary Delhi',
            email: 'cs.delhi@gov.in',
            password: passwordHash,
            role: 'StateAdmin',
            jurisdictionId: delhiState.id,
            verificationStatus: 'Fully Verified'
        });

        // District Collector (New Delhi)
        await User.create({
            name: 'District Magistrate ND',
            email: 'dm.newdelhi@gov.in',
            password: passwordHash,
            role: 'DistrictAdmin',
            jurisdictionId: newDelhiDist.id,
            verificationStatus: 'Fully Verified'
        });

        // Department Head (PWD New Delhi)
        // Note: Realistically, Dept Head is also Jurisdiction bound, but for now linking to Dept ID
        await User.create({
            name: 'Chief Engineer PWD',
            email: 'pwd.head@gov.in',
            password: passwordHash,
            role: 'Department Head',
            departmentId: departments['Public Works (PWD)'].id,
            verificationStatus: 'Fully Verified'
        });

        console.log('RBAC Users Created.');

        process.exit();

    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedNationalData();
