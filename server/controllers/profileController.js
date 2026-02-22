const { User, CitizenProfile, LoginHistory, Grievance } = require('../models');
const { encrypt, maskAadhaar } = require('../utils/encryption');
const { Op } = require('sequelize');

// Get Complete Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'refreshToken', 'aadhaarHash'] },
            include: [
                {
                    model: CitizenProfile,
                    as: 'profile'
                },
                {
                    model: LoginHistory,
                    as: 'loginHistory',
                    limit: 5,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Calculate Analytics (Mock logic or Real DB count)
        const totalGrievances = await Grievance.count({ where: { userId } });
        const resolvedGrievances = await Grievance.count({ where: { userId, status: 'Resolved' } });
        const pendingGrievances = await Grievance.count({ where: { userId, status: { [Op.ne]: 'Resolved' } } });

        // Behavioral Insight (Simple Rule Engine)
        let insight = "Citizen maintains a positive civic record.";
        if (totalGrievances > 5) insight = "Highly active citizen in community reporting.";
        if (user.karmaPoints > 50) insight = "Distinguished community contributor.";

        res.json({
            user,
            analytics: {
                total: totalGrievances,
                resolved: resolvedGrievances,
                pending: pendingGrievances,
                compliance: totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0
            },
            insight
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            // User Table fields
            name, email, phone,
            // Profile Table fields
            dob, gender, nationality, aadhaarNumber,
            addressLine1, addressLine2, district, state, pincode, wardNumber,
            bloodGroup, emergencyContactName, emergencyContactPhone
        } = req.body;

        // 1. Update User Table
        await User.update({ name, email, phone }, { where: { id: userId } });

        // 2. Prepare Profile Data
        const profileData = {
            dob, gender, nationality,
            addressLine1, addressLine2, district, state, pincode, wardNumber,
            bloodGroup, emergencyContactName, emergencyContactPhone,
            userId // Ensure link
        };

        // 3. Handle Aadhaar Encryption if provided
        if (aadhaarNumber) {
            if (aadhaarNumber.length === 12) {
                profileData.aadhaarEncrypted = encrypt(aadhaarNumber);
                profileData.aadhaarMasked = maskAadhaar(aadhaarNumber);
                profileData.verificationLevel = 4; // Govt ID Verified
                // Also update User.verificationStatus
                await User.update({ verificationStatus: 'Fully Verified' }, { where: { id: userId } });
            } else {
                return res.status(400).json({ error: 'Invalid Aadhaar Number Format' });
            }
        }

        // 4. Upsert Profile
        const [profile, created] = await CitizenProfile.upsert(profileData);
        // Note: upsert in Sequelize with SQLite might need exact where clause lookup first if ID distinct
        // Better: findOne then update or create.

        let existingProfile = await CitizenProfile.findOne({ where: { userId } });
        if (existingProfile) {
            await existingProfile.update(profileData);
        } else {
            await CitizenProfile.create(profileData);
        }

        res.json({ message: 'Profile Updated Successfully', status: 'Updated' });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Login History
exports.getLoginHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await LoginHistory.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
