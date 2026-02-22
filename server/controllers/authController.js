const { User, Jurisdiction } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');

// 1. Send OTP (Login/Register Start)
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone || phone.length !== 10) return res.status(400).json({ error: 'Invalid Phone Number' });

        await otpService.generateOtp(phone);
        res.json({ message: 'OTP sent to mobile number' });
    } catch (error) {
        const fs = require('fs');
        fs.appendFileSync('error_auth.log', `[${new Date().toISOString()}] SendOTP Error: ${error.message}\n${error.stack}\n\n`);
        console.error('Send OTP Error:', error);
        res.status(500).json({ error: error.message || 'OTP Generation Failed' });
    }
};

// 2. Verify OTP & Login/Register
exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const isValid = await otpService.verifyOtp(phone, otp);

        if (!isValid) return res.status(400).json({ error: 'Invalid or Expired OTP' });

        // Find or Create User
        let user = await User.findOne({ where: { phone } });
        let isNewUser = false;

        if (!user) {
            // Auto-register citizen
            user = await User.create({
                name: 'Citizen', // Placeholder until profile update
                phone,
                role: 'Citizen',
                password: await bcrypt.hash(phone, 10), // Default password is phone (secured by OTP)
                isApproved: true,
                verificationStatus: 'Mobile Verified'
            });
            isNewUser = true;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, departmentId: user.departmentId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                verificationStatus: user.verificationStatus,
                isNewUser
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Identity Verification (Aadhaar + Jurisdiction)
exports.verifyIdentity = async (req, res) => {
    try {
        const userId = req.user.id; // From Middleware
        const { aadhaarNumber, jurisdictionCode } = req.body;

        if (!aadhaarNumber || aadhaarNumber.length !== 12) {
            return res.status(400).json({ error: 'Invalid Aadhaar Number' });
        }

        // Simulate Aadhaar Hashing (Privacy Preserving)
        const last4 = aadhaarNumber.slice(-4);
        const aadhaarHash = `SHA256-MOCKED-${aadhaarNumber}`;

        // Find Jurisdiction
        // For demo, we might accept raw ID or Code. 
        // In real app, we map GPS -> Ward Code.

        await User.update({
            aadhaarHash,
            verificationStatus: 'Fully Verified',
            // jurisdictionId: ... (logic to find jurisdiction)
        }, { where: { id: userId } });

        res.json({ message: 'Identity Verified Successfully', status: 'Fully Verified' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Legacy Email Login (For Admins/officials who are pre-seeded)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: 'Account pending approval by Administrator' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, departmentId: user.departmentId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                departmentId: user.departmentId,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Legacy Register (Disabled for public, kept for internal scripts)
exports.register = async (req, res) => {
    res.status(403).json({ error: 'Public email registration is disabled. Use OTP.' });
};
