import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
                await login(formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="grid-cols-2" style={{ alignItems: 'center', width: '100%' }}>

                {/* Left Side: Hero */}
                <div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Unified Citizen <br />
                        <span style={{ color: 'var(--success)' }}>Grievance System</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Empowering citizens with transparent, trackable, and accountable governance.
                        Report issues related to roads, water, sanitation, and more.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>98%</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resolution Rate</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--warning)' }}>24h</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Avg. Response</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="glass-panel" style={{ padding: '2rem', maxWidth: '450px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        {isLogin ? 'Welcome Back' : 'Join the Platform'}
                    </h2>

                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            {isLogin ? 'Login to Dashboard' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}
