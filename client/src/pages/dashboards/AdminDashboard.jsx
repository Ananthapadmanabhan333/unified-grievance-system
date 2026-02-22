import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function AdminDashboard({ user }) {
    const [grievances, setGrievances] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const isSuperAdmin = user.role === 'SuperAdmin';
    const isStateAdmin = user.role === 'StateAdmin';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch grievances (Already filtered by backend based on role/jurisdiction)
            const gRes = await axios.get('/grievances');
            // Fetch analytics (TODO: Backend should also filter analytics)
            const aRes = await axios.get('/analytics/governance');

            setGrievances(gRes.data);
            setAnalytics(aRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    // Calculate Summary Stats from Client Data (for now)
    const total = grievances.length;
    const resolved = grievances.filter(g => g.status === 'Resolved').length;
    const pending = grievances.filter(g => g.status === 'Pending').length;
    const escalated = grievances.filter(g => g.status === 'Escalated').length;

    return (
        <div>
            {/* Header / Title */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: 'var(--gov-primary)' }}>
                        {isSuperAdmin ? 'National Command Center' : isStateAdmin ? 'State Governance Dashboard' : 'District Administration Dashboard'}
                    </h2>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        User: {user.name} | Jurisdiction: {user.jurisdictionId ? 'Delhi NCT (Demo)' : 'Government of India'}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="/profile" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 15px' }}>👤 Profile</a>
                    <a href="/help" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 15px' }}>❓ Help</a>
                    {(isSuperAdmin || isStateAdmin) && (
                        <a href="/command-center" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📊 War Room
                        </a>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div className="gov-card" style={{ flex: 1, textAlign: 'center', borderTop: '4px solid var(--gov-primary)' }}>
                    <h1>{total}</h1>
                    <small>Total Grievances</small>
                </div>
                <div className="gov-card" style={{ flex: 1, textAlign: 'center', borderTop: '4px solid var(--gov-warning)' }}>
                    <h1>{pending}</h1>
                    <small>Pending Action</small>
                </div>
                <div className="gov-card" style={{ flex: 1, textAlign: 'center', borderTop: '4px solid var(--gov-danger)' }}>
                    <h1 style={{ color: 'red' }}>{escalated}</h1>
                    <small>Escalated / Critical</small>
                </div>
                <div className="gov-card" style={{ flex: 1, textAlign: 'center', borderTop: '4px solid var(--gov-success)' }}>
                    <h1>{Math.round((resolved / (total || 1)) * 100)}%</h1>
                    <small>Resolution Rate</small>
                </div>
            </div>

            {/* Hierarchy View (Placeholder for Maps/Graphs) */}
            {(isSuperAdmin || isStateAdmin) && (
                <div className="gov-card" style={{ marginBottom: '20px', padding: '20px', background: '#fcfcfc' }}>
                    <h3 style={{ marginTop: 0 }}>Jurisdictional Performance</h3>
                    <p style={{ fontStyle: 'italic', color: '#555' }}>
                        {isSuperAdmin ? 'Showing performance of all States...' : 'Showing performance of all Districts...'}
                    </p>
                    {/* Mock Table for Hierarchy Performance */}
                    <table className="gov-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Active Cases</th>
                                <th>Avg Resolution Time</th>
                                <th>Efficiency Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{isSuperAdmin ? 'Delhi NCT' : 'New Delhi District'}</td>
                                <td>{pending}</td>
                                <td>28 Hours</td>
                                <td><span className="badge" style={{ background: 'green' }}>A+</span></td>
                            </tr>
                            {isSuperAdmin && (
                                <tr>
                                    <td>Maharashtra</td>
                                    <td>0</td>
                                    <td>-</td>
                                    <td><span className="badge" style={{ background: '#ccc' }}>No Data</span></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Recent Grievances Table */}
            <h3>Recent Grievance Submissions</h3>
            <div style={{ overflowX: 'auto' }}>
                <table className="gov-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Location/Jurisdiction</th>
                            <th>Category</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grievances.length > 0 ? (
                            grievances.slice(0, 10).map(g => (
                                <tr key={g.id}>
                                    <td>#{g.id}</td>
                                    <td>{format(new Date(g.createdAt), 'dd/MM/yy')}</td>
                                    <td>{g.location || 'N/A'}</td>
                                    <td>{g.category}</td>
                                    <td>{g.title}</td>
                                    <td><span className={`badge ${g.status.toLowerCase()}`}>{g.status}</span></td>
                                    <td>
                                        <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No grievances found in your jurisdiction.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
