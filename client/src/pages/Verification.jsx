import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GovHeader from '../components/GovHeader';
import GovFooter from '../components/GovFooter';

export default function Verification() {
    const { user, verifyIdentity } = useAuth();
    const [aadhaar, setAadhaar] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock Jurisdiction Code (In real app, we use GPS or Dropdown)
            await verifyIdentity(aadhaar, 'DEL-DIST-01');
            alert('Identity Verified Successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Verification Failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Access Denied. Please Login.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
            <GovHeader />

            <main className="container" style={{ flex: 1, padding: '40px 20px', maxWidth: '600px' }}>
                <div className="gov-card" style={{ borderTop: '4px solid var(--gov-primary)' }}>
                    <h2 style={{ marginTop: 0, textAlign: 'center', color: 'var(--gov-primary)' }}>
                        Identity Verification
                    </h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                        As part of the National DPI Standard, we require Aadhaar-based verification to map your jurisdiction and prevent spam.
                    </p>

                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                                Aadhaar Number (12 Digits) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="XXXX XXXX XXXX"
                                    maxLength="12"
                                    value={aadhaar}
                                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                                    required
                                    style={{ fontSize: '1.1rem', letterSpacing: '2px' }}
                                />
                                <span style={{ fontSize: '20px', color: 'green', display: aadhaar.length === 12 ? 'block' : 'none' }}>
                                    ✓
                                </span>
                            </div>
                            <small style={{ color: '#666' }}>
                                We only store a secure hash of your Aadhaar. Your privacy is protected under the Digital Data Protection Act.
                            </small>
                        </div>

                        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                            <strong>Detected Jurisdiction (Auto):</strong><br />
                            New Delhi » Central District » Civil Lines Ward
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                            disabled={loading}
                        >
                            {loading ? 'Verifying with UIDAI...' : 'Verify & Continue'}
                        </button>
                    </form>
                </div>
            </main>

            <GovFooter />
        </div>
    );
}
