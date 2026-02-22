const otpService = require('../services/otpService');

const debugOtp = async () => {
    try {
        console.log('Testing OTP Generation...');
        const phone = '7356123611';

        const otp = await otpService.generateOtp(phone);
        console.log('OTP Result:', otp);

    } catch (error) {
        console.error('❌ OTP ERROR:', error);
    }
};

debugOtp();
