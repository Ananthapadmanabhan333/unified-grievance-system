require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generate = async () => {
    try {
        const phone = '7356123611';
        let user = await User.findOne({ where: { phone } });
        if (!user) {
            user = await User.create({
                name: 'Ananthapadmanabhan', // Use user's name for improved demo
                phone: phone,
                role: 'Citizen',
                password: 'hashed_placeholder',
                verificationStatus: 'Mobile Verified',
                karmaPoints: 120 // Show some stats
            });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        console.log('TOKEN:', token);

    } catch (error) {
        console.error(error);
    }
};

generate();
