import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GrievanceForm from '../components/GrievanceForm';
import GrievanceCard from '../components/GrievanceCard';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [grievances, setGrievances] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchGrievances = async () => {
        try {
            const res = await axios.get('/grievances');
            setGrievances(res.data);
        } catch (error) {
            console.error('Error fetching grievances', error);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`/grievances/${id}/status`, { status });
            fetchGrievances();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const isOfficial = ['Department Officer', 'Department Head', 'Admin'].includes(user?.role);

    return (
        <div className="container">
            {/* Header */}
            <header className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Grievance Portal</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Welcome, {user?.name} ({user?.role})</p>
                </div>
                <button className="btn-primary" style={{ backgroundColor: 'var(--danger)' }} onClick={logout}>Logoout</button>
            </header>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

                {/* Left: List */}
                <div>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3>Recent Activities</h3>
                        <select className="input-field" style={{ width: 'auto', marginBottom: 0 }} value={filter} onChange={e => setFilter(e.target.value)}>
                            <option>All</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {grievances
                            .filter(g => filter === 'All' || g.status === filter)
                            .map(g => (
                                <GrievanceCard
                                    key={g.id}
                                    grievance={g}
                                    isOfficial={isOfficial}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        {grievances.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No grievances found.</p>}
                    </div>
                </div>

                {/* Right: Actions/Stats */}
                <div>
                    {user?.role === 'Citizen' && (
                        <GrievanceForm onSuccess={fetchGrievances} />
                    )}

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4>Quick Stats</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex-between">
                                <span>Total Submitted</span>
                                <strong>{grievances.length}</strong>
                            </div>
                            <div className="flex-between">
                                <span>Resolved</span>
                                <strong style={{ color: 'var(--success)' }}>
                                    {grievances.filter(g => g.status === 'Resolved').length}
                                </strong>
                            </div>
                            <div className="flex-between">
                                <span>Pending</span>
                                <strong style={{ color: 'var(--warning)' }}>
                                    {grievances.filter(g => g.status === 'Pending').length}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
