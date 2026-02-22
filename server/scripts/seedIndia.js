const { sequelize, Jurisdiction, User, Department } = require('../models');
const bcrypt = require('bcryptjs');

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
];

const uts = [
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const seedIndia = async () => {
    try {
        await sequelize.sync({ force: true }); // RESET DB for clean national build
        console.log('Database Reset & Synced.');

        // 1. National Root
        const india = await Jurisdiction.create({
            name: 'India',
            type: 'National',
            code: 'IND',
            parentId: null
        });

        console.log('Created National Root: India');

        // 2. Seed States & UTs (Hardcoded codes to avoid duplicates)
        // AND (Andhra), ARP (Arunachal), ASM, BIH, CHT, GOA, GUJ, HAR, HIM, JHA, KAR, KER, MP, MAH, MAN, MEG, MIZ, NAG, ODI, PUN, RAJ, SIK, TN, TEL, TRI, UP, UK, WB
        const stateMap = {};

        const mapCode = (name) => {
            const clean = name.toUpperCase().replace(/\s/g, '');
            if (name === 'Andhra Pradesh') return 'AP';
            if (name === 'Arunachal Pradesh') return 'AR';
            if (name === 'Madhya Pradesh') return 'MP';
            if (name === 'Uttar Pradesh') return 'UP';
            if (name === 'West Bengal') return 'WB';
            if (name === 'Tamil Nadu') return 'TN';
            if (name === 'Himachal Pradesh') return 'HP';
            if (name === 'Jammu and Kashmir') return 'JK';
            return clean.substring(0, 3);
        }

        for (const state of states) {
            const j = await Jurisdiction.create({
                name: state,
                type: 'State',
                code: mapCode(state),
                parentId: india.id
            });
            stateMap[state] = j;
        }

        for (const ut of uts) {
            const j = await Jurisdiction.create({
                name: ut,
                type: 'State', // Treating UTs as State-level for hierarchy simplicity or distinct type? 
                // Plan said "State/UT". Model has 'National', 'State', 'District'. 
                // We'll map UT to 'State' type for admin hierarchy, or add 'Union Territory'?
                // Model enum is strict. Let's use 'State' but name is correct.
                code: mapCode(ut),
                parentId: india.id
            });
            stateMap[ut] = j;
        }

        console.log(`Seeded ${states.length} States and ${uts.length} UTs.`);

        // 3. Departments with explicit codes
        const departments = [
            { name: 'Public Works (PWD)', code: 'PUB' },
            { name: 'Health', code: 'HEA' },
            { name: 'Education', code: 'EDU' },
            { name: 'Police', code: 'POL' },
            { name: 'Water', code: 'WAT' },
            { name: 'Power', code: 'PWR' },
            { name: 'Sanitation', code: 'SAN' },
            { name: 'Revenue', code: 'REV' }
        ];

        for (const dept of departments) {
            await Department.create({
                name: dept.name,
                code: dept.code,
                slaHours: 48
            });
        }
        console.log('Departments Created.');

        // 4. Create Key Admins
        const passwordHash = await bcrypt.hash('password123', 10);

        // Super Admin
        await User.create({
            name: 'Cabinet Secretary',
            email: 'superadmin@gov.in',
            password: passwordHash,
            role: 'SuperAdmin',
            jurisdictionId: india.id,
            verificationStatus: 'Fully Verified'
        });

        // Demo State Admin (Delhi)
        const delhi = stateMap['Delhi'];
        await User.create({
            name: 'Chief Secretary Delhi',
            email: 'cs.delhi@gov.in',
            password: passwordHash,
            role: 'StateAdmin',
            jurisdictionId: delhi.id,
            verificationStatus: 'Fully Verified'
        });

        // Demo District (New Delhi) inside Delhi
        const newDelhi = await Jurisdiction.create({
            name: 'New Delhi',
            type: 'District',
            code: 'NDL',
            parentId: delhi.id
        });

        await User.create({
            name: 'DM New Delhi',
            email: 'dm.newdelhi@gov.in',
            password: passwordHash,
            role: 'DistrictAdmin',
            jurisdictionId: newDelhi.id,
            verificationStatus: 'Fully Verified'
        });

        // Demo Citizen
        await User.create({
            name: 'Riya Sharma',
            email: 'citizen@test.com',
            password: passwordHash,
            role: 'Citizen',
            jurisdictionId: newDelhi.id,
            verificationStatus: 'Verified'
        });

        console.log('Key Users Created. Passwords are "password123".');

        process.exit();
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedIndia();
