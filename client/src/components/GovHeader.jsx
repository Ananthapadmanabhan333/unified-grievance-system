import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GovHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="gov-header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Placeholder for Emblem */}
                    <div style={{
                        width: '50px', height: '50px', background: '#ccc', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000'
                    }}>
                        Emblem
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Unified Citizen Grievance Redressal
                        </h1>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Government of India Initiative</span>
                    </div>
                </div>

                <nav>
                    <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, fontSize: '0.9rem' }}>
                        <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Circulars</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li>
                        {user ? (
                            <>
                                <li><span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.name} ({user.role})</span></li>
                                <li>
                                    <button
                                        onClick={() => { logout(); navigate('/'); }}
                                        style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li><a href="/" style={{ color: '#FFD700', fontWeight: 'bold', textDecoration: 'none' }}>Login</a></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
