import { useState, useEffect } from 'react';
import axios from 'axios';
import GrievanceForm from '../../components/GrievanceForm';
import { format } from 'date-fns';

export default function CitizenDashboard({ user, view }) {
    const [grievances, setGrievances] = useState([]);

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

    // 1. Dashboard View (Summary + Recent)
    if (view === 'dashboard') {
        const pending = grievances.filter(g => g.status === 'Pending').length;
        const resolved = grievances.filter(g => g.status === 'Resolved').length;

        return (
            <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="gov-card" style={{ flex: 1, borderTop: '4px solid var(--gov-primary)' }}>
                        <h3 style={{ margin: 0 }}>{grievances.length}</h3>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Total Registered</span>
                    </div>
                    <div className="gov-card" style={{ flex: 1, borderTop: '4px solid var(--gov-warning)' }}>
                        <h3 style={{ margin: 0 }}>{pending}</h3>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Pending Process</span>
                    </div>
                    <div className="gov-card" style={{ flex: 1, borderTop: '4px solid var(--gov-success)' }}>
                        <h3 style={{ margin: 0 }}>{resolved}</h3>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Successfully Resolved</span>
                    </div>
                </div>

                <h3>Recent Applications</h3>
                <GrievanceTable grievances={grievances.slice(0, 5)} />
            </div>
        );
    }

    // 2. New Grievance Form
    if (view === 'new_grievance') {
        return (
            <div style={{ maxWidth: '800px' }}>
                <GrievanceForm onSuccess={() => alert('Grievance Submitted Successfully!')} />
            </div>
        );
    }

    // 3. Track Status (Full Table)
    if (view === 'my_grievances') {
        return <GrievanceTable grievances={grievances} />;
    }

    return <div>Select an option from the sidebar.</div>;
}

function GrievanceTable({ grievances }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Category</th>
                        <th>Subject</th>
                        <th>Submission Date</th>
                        <th>Current Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {grievances.map(g => (
                        <tr key={g.id}>
                            <td>#{g.id}</td>
                            <td>{g.category}</td>
                            <td>{g.title}</td>
                            <td>{format(new Date(g.createdAt), 'dd/MM/yyyy')}</td>
                            <td>
                                <span className="badge" style={{
                                    background: g.status === 'Resolved' ? '#d4edda' : '#fff3cd',
                                    color: g.status === 'Resolved' ? '#155724' : '#856404',
                                    border: '1px solid transparent'
                                }}>
                                    {g.status}
                                </span>
                            </td>
                            <td>
                                <button style={{ padding: '2px 5px', fontSize: '11px' }}>View Detail</button>
                            </td>
                        </tr>
                    ))}
                    {grievances.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No records found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
