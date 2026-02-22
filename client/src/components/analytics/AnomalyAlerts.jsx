import React from 'react';

const AnomalyAlerts = ({ anomalies }) => {
    if (!anomalies || anomalies.length === 0) return null;

    return (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {anomalies.map(a => (
                <div key={a.id} className="glass-panel" style={{
                    minWidth: '250px',
                    borderTop: '4px solid var(--gov-warning)',
                    padding: '10px 15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        🤖 AI Anomaly Detected
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {a.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#444' }}>
                        {a.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 'auto' }}>
                        {new Date(a.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnomalyAlerts;
