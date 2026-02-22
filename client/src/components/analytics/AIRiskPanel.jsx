import React from 'react';

const AIRiskPanel = ({ risks }) => {
    if (!risks || risks.length === 0) return null;

    return (
        <div className="glass-panel" style={{ marginBottom: '20px', borderLeft: '4px solid red' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
                🔥 High Risk of SLA Breach
                <span className="badge" style={{ background: 'red' }}>{risks.length} Alerts</span>
            </h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="gov-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Risk Score</th>
                            <th>Contributing Factors</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {risks.map(r => (
                            <tr key={r.id}>
                                <td>{r.uniqueId}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '50px', height: '6px', background: '#ddd', borderRadius: '3px' }}>
                                            <div style={{ width: `${r.riskScore}%`, height: '100%', background: 'red', borderRadius: '3px' }}></div>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: 'red' }}>{r.riskScore}%</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        {r.factors?.map((f, i) => (
                                            <span key={i} style={{ fontSize: '0.7rem', background: '#ffeeee', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ffcccc' }}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>{r.department}</td>
                                <td>
                                    <button style={{ fontSize: '0.75rem', padding: '3px 8px', cursor: 'pointer' }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AIRiskPanel;
