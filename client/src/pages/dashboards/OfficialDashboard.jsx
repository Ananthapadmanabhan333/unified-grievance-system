import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AIRiskPanel from '../../components/analytics/AIRiskPanel';
import AnomalyAlerts from '../../components/analytics/AnomalyAlerts';

export default function OfficialDashboard({ user, view }) {
    const [grievances, setGrievances] = useState([]);
    const [aiData, setAiData] = useState({ highRisk: [], anomalies: [] });
    // If view is passed from parent, use that to filter, otherwise default internal state
    const [activeTab, setActiveTab] = useState('All');

    const fetchGrievances = async () => {
        try {
            const res = await axios.get('/grievances');
            setGrievances(res.data);
        } catch (error) {
            console.error('Error fetching grievances', error);
        }
    };

    const fetchAIData = async () => {
        try {
            const res = await axios.get('/analytics/ai-dashboard');
            setAiData(res.data);
        } catch (error) {
            console.error('Error fetching AI dashboard data', error);
        }
    };

    useEffect(() => {
        fetchGrievances();
        fetchAIData();

        // Poll for AI updates every 30s
        const interval = setInterval(fetchAIData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        const remarks = prompt(`Enter remarks for marking as ${newStatus}:`);
        if (!remarks) return;

        try {
            await axios.patch(`/grievances/${id}/status`, { status: newStatus, remarks });
            fetchGrievances();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    // Filter Logic
    const filteredGrievances = grievances.filter(g => {
        if (activeTab === 'Assigned') return g.status === 'In Progress' || g.status === 'Pending';
        if (activeTab === 'Resolved') return g.status === 'Resolved';
        return true;
    });

    return (
        <div>
            {/* AI Intelligence Layer */}
            <AnomalyAlerts anomalies={aiData.anomalies} />
            <AIRiskPanel risks={aiData.highRisk} />

            {/* Tabs for filters */}
            <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('All')}
                    style={{ padding: '10px 20px', background: activeTab === 'All' ? '#eee' : 'transparent', border: 'none', borderBottom: activeTab === 'All' ? '2px solid var(--gov-primary)' : 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    All Cases
                </button>
                <button
                    onClick={() => setActiveTab('Assigned')}
                    style={{ padding: '10px 20px', background: activeTab === 'Assigned' ? '#eee' : 'transparent', border: 'none', borderBottom: activeTab === 'Assigned' ? '2px solid var(--gov-primary)' : 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Active / Pending
                </button>
                <button
                    onClick={() => setActiveTab('Resolved')}
                    style={{ padding: '10px 20px', background: activeTab === 'Resolved' ? '#eee' : 'transparent', border: 'none', borderBottom: activeTab === 'Resolved' ? '2px solid var(--gov-primary)' : 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    History / Resolved
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="gov-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Priority</th>
                            <th>Category</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status/Risk</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGrievances.map(g => (
                            <tr key={g.id}>
                                <td>#{g.id}</td>
                                <td>
                                    <span style={{
                                        color: g.priority === 'High' ? 'red' : 'inherit',
                                        fontWeight: g.priority === 'High' ? 'bold' : 'normal'
                                    }}>
                                        {g.priority}
                                    </span>
                                </td>
                                <td>{g.category}</td>
                                <td>
                                    <div style={{ fontWeight: 'bold' }}>{g.title}</div>
                                    <div style={{ fontSize: '12px', color: '#666', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {g.description}
                                    </div>
                                    {/* Inline Explainable AI Badge */}
                                    {g.aiClassification && (
                                        <div style={{ fontSize: '10px', color: 'var(--gov-primary)', marginTop: '2px' }}>
                                            🤖 AI Detected: {g.aiClassification.suggestedCategory}
                                        </div>
                                    )}
                                </td>
                                <td>{format(new Date(g.createdAt), 'dd/MM/yyyy')}</td>
                                <td>
                                    <div>{g.status}</div>
                                    {g.severityScore > 70 && (
                                        <div className="badge" style={{ background: 'red', color: 'white', marginTop: '2px', fontSize: '10px' }}>
                                            High Severity ({g.severityScore})
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {g.status !== 'Resolved' && (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => handleUpdateStatus(g.id, 'In Progress')}
                                                style={{ fontSize: '11px', padding: '2px 5px', cursor: 'pointer' }}
                                            >
                                                Start
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(g.id, 'Resolved')}
                                                style={{ fontSize: '11px', padding: '2px 5px', cursor: 'pointer', background: 'var(--gov-success)', color: 'white', border: 'none' }}
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(g.id, 'Escalated')}
                                                style={{ fontSize: '11px', padding: '2px 5px', cursor: 'pointer', background: 'var(--gov-danger)', color: 'white', border: 'none' }}
                                            >
                                                Escalate
                                            </button>
                                        </div>
                                    )}
                                    {g.status === 'Resolved' && <span style={{ color: 'green' }}>Closed</span>}
                                </td>
                            </tr>
                        ))}
                        {filteredGrievances.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
