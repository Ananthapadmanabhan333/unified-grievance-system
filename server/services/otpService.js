// In a real production environment, this would integrate with CDAC / NIC SMS Gateway
// For now, it simulates OTP behavior

const otps = new Map(); // phone -> { otp, expires }

exports.generateOtp = async (phone) => {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry (5 mins)
    const expires = Date.now() + 5 * 60 * 1000;

    otps.set(phone, { otp, expires });

    console.log(`[OTP-SERVICE] Generated OTP for ${phone}: ${otp}`);
    return otp;
};

exports.verifyOtp = async (phone, inputOtp) => {
    // Backdoor for demo testing
    if (inputOtp === '123456') return true;

    const record = otps.get(phone);
    if (!record) return false;

    if (Date.now() > record.expires) {
        otps.delete(phone);
        return false;
    }

    if (record.otp === inputOtp) {
        otps.delete(phone);
        return true;
    }

    return false;
};
