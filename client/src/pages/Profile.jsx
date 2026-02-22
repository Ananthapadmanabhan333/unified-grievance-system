import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GovHeader from '../components/GovHeader';
import GovSidebar from '../components/GovSidebar';
import GovFooter from '../components/GovFooter';

export default function Profile() {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loginHistory, setLoginHistory] = useState([]);
    const [insight, setInsight] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle case where user might be null if backend fails logic
            if (!res.data.user) throw new Error("Profile data missing");

            setProfileData(res.data.user);
            setAnalytics(res.data.analytics || {});
            setInsight(res.data.insight || 'Welcome to your digital profile.');

            // Safe history check
            const history = res.data.user.loginHistory || [];
            setLoginHistory(history);

            // Fetch separate history if needed (optional)
            // try { ... } catch (e) {}

            // Init Form Data
            const p = res.data.user.profile || {};
            setFormData({
                name: res.data.user.name,
                email: res.data.user.email,
                phone: res.data.user.phone,
                dob: p.dob || '',
                gender: p.gender || 'Male',
                nationality: p.nationality || 'Indian',
                addressLine1: p.addressLine1 || '',
                district: p.district || '',
                state: p.state || 'Delhi',
                pincode: p.pincode || '',
                aadhaarNumber: ''
            });

            setLoading(false);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to load profile";
            const errDetail = error.response?.data?.path ? ` (${error.response.data.path})` : '';
            setError(errMsg + errDetail);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile Updated Successfully');
            setIsEditing(false);
            fetchProfile(); // Refresh
        } catch (error) {
            alert('Update Failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleViewChange = (view) => {
        // Since we are on Profile page, navigating to other dashboard views redirects to dashboard
        navigate('/dashboard');
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === id ? 'var(--gov-primary)' : '#f5f5f5',
                color: activeTab === id ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            {icon} {label}
        </button>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <GovHeader />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading Digital Identity...
                </div>
                <GovFooter />
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <GovHeader />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                    <h3>⚠️ Unable to Load Profile</h3>
                    <p style={{ color: 'red' }}>{error || "Server returned no data."}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
                        <button
                            onClick={logout}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #d32f2f',
                                background: 'white',
                                color: '#d32f2f',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <GovFooter />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
            <GovHeader />

            <div className="container" style={{ display: 'flex', flex: 1, padding: '0', gap: '0', border: '1px solid #ddd', marginTop: '1rem', marginBottom: '1rem' }}>
                {/* Sidebar */}
                <GovSidebar role={authUser?.role || 'Citizen'} currentView="profile" onViewChange={handleViewChange} />

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
                    {/* AI Insight Banner */}
                    <div style={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '5px solid #1976d2' }}>
                        <div style={{ fontSize: '24px' }}>🤖</div>
                        <div>
                            <h4 style={{ margin: 0, color: '#0d47a1' }}>GovTech AI Insight</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#1565c0' }}>{insight}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>

                        {/* Left Column: Quick Stats & Card */}
                        <div>
                            <div className="gov-card" style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ width: '80px', height: '80px', background: '#ddd', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                                    👤
                                </div>
                                <h3 style={{ margin: '5px 0' }}>{profileData.name}</h3>
                                <p style={{ color: '#666', fontSize: '12px' }}>{profileData.role}</p>

                                <div style={{ margin: '15px 0', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                    <small>Verification Level</small>
                                    <div style={{ color: 'green', fontWeight: 'bold' }}>
                                        Tier {profileData?.profile?.verificationLevel || 1} • {profileData.verificationStatus}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'left' }}>
                                    <strong style={{ fontSize: '12px', color: '#666' }}>CIVIC ANALYTICS</strong>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px' }}>
                                        <span>Total Grievances</span>
                                        <strong>{analytics?.total || 0}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '13px' }}>
                                        <span>Resolved</span>
                                        <strong style={{ color: 'green' }}>{analytics?.resolved || 0}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '13px' }}>
                                        <span>Karma Points</span>
                                        <strong style={{ color: 'orange' }}>{profileData.karmaPoints}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Tabs & Forms */}
                        <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                                <TabButton id="overview" label="Overview" icon="📊" />
                                <TabButton id="identity" label="Identity" icon="🆔" />
                                <TabButton id="security" label="Security" icon="🔒" />
                            </div>

                            <div style={{ padding: '20px' }}>
                                {activeTab === 'overview' && (
                                    <div>
                                        <h3 style={{ marginTop: 0 }}>Digital Identity Overview</h3>
                                        <p style={{ fontSize: '14px' }}>Welcome to your centralized government profile. All your data is encrypted and secure.</p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                                            <div style={{ padding: '15px', background: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: '4px' }}>
                                                <strong>🔔 Pending Actions</strong>
                                                <ul style={{ fontSize: '12px', paddingLeft: '20px', marginTop: '5px' }}>
                                                    {!profileData.profile?.aadhaarMasked && <li>Link Aadhaar for Tier-4 Verification</li>}
                                                    <li>Verify Email Address</li>
                                                </ul>
                                            </div>
                                            <div style={{ padding: '15px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>
                                                <strong>✅ Active Credentials</strong>
                                                <ul style={{ fontSize: '12px', paddingLeft: '20px', marginTop: '5px' }}>
                                                    <li>Mobile Verified (+91)</li>
                                                    <li>Encryption Enabled</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'identity' && (
                                    <form onSubmit={handleUpdate}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3>Personal Information</h3>
                                            <button type="button" onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 'bold' }}>
                                                {isEditing ? 'Cancel Edit' : '✏️ Edit Details'}
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div>
                                                <label className="gov-label">Full Name (Official)</label>
                                                <input className="gov-input" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                                            </div>
                                            <div>
                                                <label className="gov-label">Gender</label>
                                                <select className="gov-input" name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}>
                                                    <option>Male</option><option>Female</option><option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="gov-label">Date of Birth</label>
                                                <input type="date" className="gov-input" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing} />
                                            </div>
                                            <div>
                                                <label className="gov-label">Nationality</label>
                                                <input className="gov-input" name="nationality" value={formData.nationality} disabled />
                                            </div>
                                            <div>
                                                <label className="gov-label">State / UT</label>
                                                <select className="gov-input" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing}>
                                                    <option>Delhi</option><option>Mumbai</option><option>Kerala</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="gov-label">District</label>
                                                <input className="gov-input" name="district" value={formData.district} onChange={handleChange} disabled={!isEditing} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label className="gov-label">Address Line 1</label>
                                                <input className="gov-input" name="addressLine1" value={formData.addressLine1} onChange={handleChange} disabled={!isEditing} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd' }}>
                                            <h4 style={{ margin: '0 0 10px' }}>🔒 Government ID (Aadhaar)</h4>
                                            {profileData.profile?.aadhaarMasked ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontFamily: 'monospace' }}>
                                                    <span>{profileData.profile.aadhaarMasked}</span>
                                                    <span style={{ fontSize: '12px', color: 'green', background: '#dff', padding: '2px 5px' }}>VERIFIED</span>
                                                </div>
                                            ) : (
                                                isEditing && (
                                                    <div>
                                                        <input
                                                            className="gov-input"
                                                            name="aadhaarNumber"
                                                            placeholder="Enter 12-digit Aadhaar to Verify"
                                                            maxLength="12"
                                                            onChange={handleChange}
                                                        />
                                                        <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
                                                            Data is 256-bit Encrypted. Stored in masked format.
                                                        </small>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {isEditing && (
                                            <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                                                Save Changes & Verify
                                            </button>
                                        )}
                                    </form>
                                )}

                                {activeTab === 'security' && (
                                    <div>
                                        <h3>Security & Audit Log</h3>
                                        <p style={{ fontSize: '13px', color: '#666' }}>Recent account activity monitors.</p>

                                        <table className="gov-table" style={{ width: '100%', fontSize: '12px', marginTop: '15px' }}>
                                            <thead>
                                                <tr>
                                                    <th>Time</th>
                                                    <th>Method</th>
                                                    <th>Status</th>
                                                    <th>IP Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loginHistory.map(log => (
                                                    <tr key={log.id}>
                                                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                                                        <td>{log.method}</td>
                                                        <td style={{ color: log.status === 'Success' ? 'green' : 'red' }}>{log.status}</td>
                                                        <td>{log.ipAddress || '127.0.0.1'}</td>
                                                    </tr>
                                                ))}
                                                {loginHistory.length === 0 && (
                                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No history available</td></tr>
                                                )}
                                            </tbody>
                                        </table>

                                        <div style={{ marginTop: '20px' }}>
                                            <button className="btn-secondary" style={{ marginRight: '10px' }}>Download Personal Data</button>
                                            <button className="btn-secondary" style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ef5350' }}>Logout All Devices</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <GovFooter />
        </div>
    );
}
