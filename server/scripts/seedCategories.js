const { sequelize, GrievanceCategory, Department, EscalationLevel, Tenant, Jurisdiction } = require('../models');

const seedCategories = async () => {
    try {
        console.log('Seeding Grievance Categories...');

        // Get departments
        const departments = await Department.findAll();
        const deptMap = {};
        departments.forEach(d => { deptMap[d.code] = d.id; });

        const categories = [
            // Roads & Infrastructure
            { name: 'Pothole Repair', code: 'ROAD_POTHOLE', deptCode: 'PUB', priority: 'High', sla: 24, icon: 'road', color: '#FF6B6B' },
            { name: 'Road Construction', code: 'ROAD_CONSTRUCT', deptCode: 'PUB', priority: 'Medium', sla: 72, icon: 'construction', color: '#FFA500' },
            { name: 'Street Light Not Working', code: 'STREET_LIGHT', deptCode: 'PWR', priority: 'Medium', sla: 48, icon: 'lightbulb', color: '#FFD700' },
            { name: 'Traffic Signal Malfunction', code: 'TRAFFIC_SIGNAL', deptCode: 'PUB', priority: 'Critical', sla: 12, icon: 'traffic-light', color: '#FF0000' },
            { name: 'Footpath Repair', code: 'FOOTPATH', deptCode: 'PUB', priority: 'Low', sla: 96, icon: 'walk', color: '#808080' },

            // Water & Sanitation
            { name: 'Water Supply Disruption', code: 'WATER_SUPPLY', deptCode: 'WAT', priority: 'Critical', sla: 12, icon: 'water-drop', color: '#0077BE' },
            { name: 'Water Leakage', code: 'WATER_LEAK', deptCode: 'WAT', priority: 'High', sla: 24, icon: 'leak', color: '#4169E1' },
            { name: 'Drainage Blockage', code: 'DRAINAGE', deptCode: 'SAN', priority: 'High', sla: 24, icon: 'drain', color: '#8B4513' },
            { name: 'Sewage Overflow', code: 'SEWAGE', deptCode: 'SAN', priority: 'Critical', sla: 12, icon: 'warning', color: '#DC143C' },
            { name: 'Garbage Collection', code: 'GARBAGE', deptCode: 'SAN', priority: 'Medium', sla: 48, icon: 'trash', color: '#228B22' },

            // Electricity
            { name: 'Power Outage', code: 'POWER_OUT', deptCode: 'PWR', priority: 'Critical', sla: 6, icon: 'power-off', color: '#FF4500' },
            { name: 'Transformer Issue', code: 'TRANSFORMER', deptCode: 'PWR', priority: 'Critical', sla: 12, icon: 'zap', color: '#FF6347' },
            { name: 'Electricity Meter Problem', code: 'METER', deptCode: 'PWR', priority: 'Medium', sla: 72, icon: 'gauge', color: '#FFA500' },

            // Health
            { name: 'Hospital Services', code: 'HOSPITAL', deptCode: 'HEA', priority: 'High', sla: 24, icon: 'hospital', color: '#00CED1' },
            { name: 'Vaccination Availability', code: 'VACCINE', deptCode: 'HEA', priority: 'Medium', sla: 48, icon: 'syringe', color: '#20B2AA' },
            { name: 'Ambulance Service', code: 'AMBULANCE', deptCode: 'HEA', priority: 'Critical', sla: 1, icon: 'ambulance', color: '#FF0000' },

            // Education
            { name: 'School Infrastructure', code: 'SCHOOL_INFRA', deptCode: 'EDU', priority: 'Medium', sla: 96, icon: 'school', color: '#4682B4' },
            { name: 'Teacher Shortage', code: 'TEACHER', deptCode: 'EDU', priority: 'High', sla: 72, icon: 'user-graduate', color: '#6A5ACD' },
            { name: 'Mid-Day Meal Quality', code: 'MIDDAY_MEAL', deptCode: 'EDU', priority: 'High', sla: 24, icon: 'utensils', color: '#FF8C00' },

            // Police & Safety
            { name: 'Law & Order', code: 'LAW_ORDER', deptCode: 'POL', priority: 'Critical', sla: 2, icon: 'shield', color: '#000080' },
            { name: 'Traffic Violation', code: 'TRAFFIC_VIOL', deptCode: 'POL', priority: 'Medium', sla: 48, icon: 'car-crash', color: '#8B0000' },
            { name: 'Public Safety Concern', code: 'SAFETY', deptCode: 'POL', priority: 'High', sla: 12, icon: 'exclamation-triangle', color: '#FF4500' },

            // Revenue & Administration
            { name: 'Property Tax', code: 'PROP_TAX', deptCode: 'REV', priority: 'Low', sla: 120, icon: 'file-invoice', color: '#696969' },
            { name: 'Birth/Death Certificate', code: 'CERTIFICATE', deptCode: 'REV', priority: 'Medium', sla: 72, icon: 'certificate', color: '#4169E1' },
            { name: 'Land Records', code: 'LAND_REC', deptCode: 'REV', priority: 'Medium', sla: 96, icon: 'map', color: '#8B4513' },

            // Others
            { name: 'Stray Animals', code: 'STRAY_ANIMAL', deptCode: 'SAN', priority: 'Low', sla: 72, icon: 'dog', color: '#D2691E' },
            { name: 'Illegal Construction', code: 'ILLEGAL_CONST', deptCode: 'PUB', priority: 'High', sla: 48, icon: 'ban', color: '#DC143C' },
            { name: 'Noise Pollution', code: 'NOISE', deptCode: 'POL', priority: 'Medium', sla: 48, icon: 'volume-up', color: '#FF6347' },
            { name: 'Public Park Maintenance', code: 'PARK', deptCode: 'PUB', priority: 'Low', sla: 96, icon: 'tree', color: '#228B22' }
        ];

        for (const cat of categories) {
            const deptId = deptMap[cat.deptCode];
            if (!deptId) {
                console.log(`Warning: Department ${cat.deptCode} not found for category ${cat.name}`);
                continue;
            }

            await GrievanceCategory.create({
                name: cat.name,
                code: cat.code,
                description: `Grievances related to ${cat.name.toLowerCase()}`,
                departmentId: deptId,
                defaultPriority: cat.priority,
                defaultSLAHours: cat.sla,
                escalationLevel1Hours: Math.floor(cat.sla * 0.5),
                escalationLevel2Hours: cat.sla,
                escalationLevel3Hours: cat.sla * 1.5,
                isActive: true,
                icon: cat.icon,
                color: cat.color
            });
        }

        console.log(`✓ Seeded ${categories.length} grievance categories`);

        // Seed Escalation Levels
        console.log('Seeding Escalation Levels...');

        const escalationLevels = [
            { level: 0, name: 'Department Officer', roleRequired: 'Department Officer', slaExtensionHours: 0, description: 'Initial assignment to department officer' },
            { level: 1, name: 'Department Head', roleRequired: 'Department Head', slaExtensionHours: 24, description: 'Escalated to department head' },
            { level: 2, name: 'District Administration', roleRequired: 'DistrictAdmin', slaExtensionHours: 48, description: 'Escalated to district collector/administrator' },
            { level: 3, name: 'State Secretariat', roleRequired: 'StateAdmin', slaExtensionHours: 72, description: 'Escalated to state-level administration' },
            { level: 4, name: 'Central Authority', roleRequired: 'SuperAdmin', slaExtensionHours: 96, description: 'Escalated to central/national authority' }
        ];

        for (const level of escalationLevels) {
            await EscalationLevel.create(level);
        }

        console.log(`✓ Seeded ${escalationLevels.length} escalation levels`);

        // Create default tenant
        console.log('Creating default tenant...');

        const india = await Jurisdiction.findOne({ where: { code: 'IND' } });

        await Tenant.create({
            name: 'Government of India',
            code: 'GOI',
            type: 'NATIONAL',
            jurisdictionId: india?.id,
            isActive: true,
            subscriptionTier: 'ENTERPRISE',
            features: {
                aiEnabled: true,
                slaMonitoring: true,
                analytics: true,
                multiLanguage: true
            },
            contactEmail: 'admin@gov.in',
            metadata: {
                setupDate: new Date(),
                version: '1.0.0'
            }
        });

        console.log('✓ Created default tenant');

        console.log('\n✅ Category seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Category seeding failed:', error);
        process.exit(1);
    }
};

seedCategories();
