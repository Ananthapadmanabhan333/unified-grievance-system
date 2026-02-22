import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AnalyticsCommandCenter = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCCData = async () => {
            try {
                const res = await axios.get('/analytics/command-center');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching Command Center data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCCData();
    }, []);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Command Center...</div>;
    if (!data) return <div style={{ padding: '20px', color: 'red' }}>Failed to load data. Access Restricted?</div>;

    const { efficiencyScores, heatmapData, trendData } = data;

    // Helper to determine Heatmap Color
    const getHeatmapColor = (intensity) => {
        if (intensity > 50) return '#ff4d4d'; // Red (Critical)
        if (intensity > 20) return '#ffaa00'; // Orange
        return '#00b894'; // Green (Safe)
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '30px', borderBottom: '2px solid var(--gov-primary)', paddingBottom: '10px' }}>
                <h1 style={{ margin: 0, color: 'var(--gov-primary)' }}>Analytics Command Center</h1>
                <p style={{ margin: '5px 0 0', color: '#666' }}>National Governance Monitoring System | Restricted Access</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* 1. Heatmap Section */}
                <div className="gov-card">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Grievance Heatmap (By Jurisdiction)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                        {heatmapData.length > 0 ? heatmapData.map((area, idx) => (
                            // Note: Sequelize raw query mapping depends on driver, fallback to simple keys if needed
                            <div key={idx} style={{
                                backgroundColor: getHeatmapColor(area.intensity),
                                color: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '12px', opacity: 0.9 }}>{area['submitter.Jurisdiction.type'] || 'Area'}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', margin: '5px 0' }}>
                                    {area['submitter.Jurisdiction.name'] || `Jurisdiction ${area.jurisdictionId || 'Unknown'}`}
                                </div>
                                <div style={{ fontSize: '18px' }}>{area.intensity}</div>
                            </div>
                        )) : (
                            <div style={{ padding: '20px', color: '#888' }}>No geospatial data available.</div>
                        )}
                    </div>
                </div>

                {/* 2. Department Efficiency Leaderboard */}
                <div className="gov-card">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Department Efficiency Scorecard</h3>
                    <table className="gov-table">
                        <thead>
                            <tr>
                                <th>score</th>
                                <th>Department</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {efficiencyScores.slice(0, 7).map((dept, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{ fontWeight: 'bold', color: dept.score > 80 ? 'green' : dept.score < 60 ? 'red' : 'orange' }}>
                                            {dept.score}
                                        </div>
                                    </td>
                                    <td>{dept.department}</td>
                                    <td>
                                        <span className={`badge`} style={{
                                            background: dept.grade === 'A' ? 'green' : dept.grade === 'D' ? 'red' : 'orange',
                                            padding: '4px 10px', fontSize: '14px'
                                        }}>
                                            {dept.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Trends (Full Width) */}
                <div className="gov-card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>7-Day Grievance Trend</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', padding: '20px 0' }}>
                        {trendData.map((day, idx) => (
                            <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    height: `${Math.min(day.count * 10, 150)}px`,
                                    background: 'var(--gov-primary)',
                                    width: '60%',
                                    margin: '0 auto',
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative'
                                }}>
                                    <span style={{ position: 'absolute', top: '-20px', left: '0', right: '0', fontSize: '12px', fontWeight: 'bold' }}>
                                        {day.count}
                                    </span>
                                </div>
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                    {format(new Date(day.date), 'dd MMM')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsCommandCenter;
