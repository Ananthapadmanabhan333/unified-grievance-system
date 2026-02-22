const { User, sequelize } = require('../models');

const debugLogin = async () => {
    try {
        console.log('Testing User Login / Creation...');
        const phone = '7356123611';

        // Simulate what authController.sendOtp likely does (find or create)
        // Check finding first
        console.log('Attempting to find User...');
        const user = await User.findOne({ where: { phone } });
        console.log('User found:', user ? user.id : 'No');

        if (!user) {
            console.log('Attempting to Create User...');
            const newUser = await User.create({
                name: 'Debug Citizen',
                phone: phone,
                role: 'Citizen',
                password: 'hashed_placeholder'
            });
            console.log('User Created:', newUser.id);
        }

    } catch (error) {
        console.error('❌ LOGIN ERROR:', error);
        if (error.original) {
            console.error('SQL Error:', error.original.message);
        }
    } finally {
        await sequelize.close();
    }
};

debugLogin();
