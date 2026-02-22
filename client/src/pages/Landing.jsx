import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GovHeader from '../components/GovHeader';
import GovFooter from '../components/GovFooter';

export default function Landing() {
    const [isLogin, setIsLogin] = useState(true); // true = Citizen OTP, false = Official Email

    // Citizen State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Official State
    const [formData, setFormData] = useState({ email: '', password: '' });

    const [error, setError] = useState('');
    const { login, sendOtp, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!otpSent) {
                if (phone.length !== 10) throw new Error('Invalid Phone Number');
                await sendOtp(phone);
                setOtpSent(true);
            } else {
                const res = await verifyOtp(phone, otp);
                if (res.user.verificationStatus === 'Unverified' || res.user.isNewUser) {
                    navigate('/verification'); // Redirect to new Identity Verification Page
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Login Error:', err);
            const msg = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(msg || 'OTP Failed');
        }
    };

    const handleOfficialLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'white' }}>
            <GovHeader />

            {/* Scrolling Marquee - Classic Gov Feature */}
            <div style={{ background: '#eee', borderBottom: '1px solid #ddd', padding: '5px 0', fontSize: '12px' }}>
                <div className="container">
                    <strong style={{ color: 'var(--gov-danger)' }}>LATEST UPDATES:</strong> &nbsp;
                    <span style={{ fontFamily: 'monospace' }}>
                        New Grievance Redressal Policy 2026 implemented w.e.f 01/01/2026 ||
                        Download the mobile app for faster processing ||
                        SLA compliance is now properly monitored by AI.
                    </span>
                </div>
            </div>

            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Left: Content Area */}
                    <div>
                        <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', background: '#f9f9f9' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--gov-secondary)', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                                About the Portal
                            </h3>
                            <p style={{ fontSize: '14px', textAlign: 'justify' }}>
                                The Unified Citizen Grievance Redressal System is an initiative of the Government to ensure transparent
                                and accountable governance. This platform enables citizens to lodge their grievances related to
                                various departments such as Roads, Water Supply, Electricity, and Sanitation from a single portal.
                            </p>
                            <ul>
                                <li>24x7 Grievance Registration</li>
                                <li>Real-time Status Tracking</li>
                                <li>AI-Assisted Processing</li>
                                <li>Defined Service Level Agreements (SLA)</li>
                            </ul>
                        </div>

                        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Department Statistics</h4>
                            <table className="gov-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Total Grievances</th>
                                        <th>Resolved</th>
                                        <th>Compliance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Roads & Infrastructure</td><td>1,240</td><td>1,100</td><td>89%</td></tr>
                                    <tr><td>Water Supply</td><td>850</td><td>780</td><td>92%</td></tr>
                                    <tr><td>Electricity Board</td><td>2,300</td><td>2,250</td><td>98%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Login Box */}
                    <div className="gov-card" style={{ borderTop: '4px solid var(--gov-primary)' }}>
                        <h3 style={{ marginTop: 0, textAlign: 'center', background: '#f5f5f5', padding: '10px', borderBottom: '1px solid #eee' }}>
                            {isLogin ? 'Citizen Login / Registration' : 'Official Login (Staff Only)'}
                        </h3>

                        {error && <div style={{ color: 'red', fontSize: '12px', background: '#ffe6e6', padding: '5px', marginBottom: '10px', border: '1px solid red' }}>{error}</div>}

                        {isLogin ? (
                            // OTP LOGIN FLOW
                            <form onSubmit={handleOtpSubmit}>
                                {!otpSent ? (
                                    <>
                                        <label>Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <span style={{ padding: '10px', background: '#eee', border: '1px solid #ccc' }}>+91</span>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter 10 digit number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                            Send OTP
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ textAlign: 'center', marginBottom: '10px', color: 'green', fontSize: '12px' }}>
                                            OTP sent to +91-{phone}
                                        </div>
                                        <label>Enter OTP <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="XXXXXX"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            required
                                            style={{ letterSpacing: '5px', textAlign: 'center', fontSize: '1.2rem' }}
                                        />
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                            Verify & Proceed
                                        </button>
                                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <a href="#" onClick={(e) => { e.preventDefault(); setOtpSent(false); }} style={{ fontSize: '12px' }}>
                                                Resend / Change Number
                                            </a>
                                        </div>
                                    </>
                                )}
                            </form>
                        ) : (
                            // OFFICIAL LOGIN FLOW
                            <form onSubmit={handleOfficialLogin}>
                                <label>Official Email <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />

                                <label>Password <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />

                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', background: 'var(--gov-secondary)' }}>
                                    Secure Official Login
                                </button>
                            </form>
                        )}

                        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '13px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
                                {isLogin ? 'Department Official? Click Here' : 'Back to Citizen Login'}
                            </a>
                        </div>

                        <div style={{ marginTop: '20px', padding: '10px', background: '#eef', fontSize: '12px', color: '#555', textAlign: 'center' }}>
                            For Technical Support:<br />
                            1800-111-555 (Toll Free)
                        </div>
                    </div>

                </div>
            </main>

            <GovFooter />
        </div>
    );
}
