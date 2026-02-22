import React, { useState } from 'react';

const HelpCenter = () => {
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', label: 'About Platform' },
        { id: 'sla', label: 'SLAs & Timelines' },
        { id: 'faq', label: 'FAQs' },
        { id: 'contact', label: 'Contact Support' }
    ];

    const styles = {
        container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
        nav: { display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '20px' },
        navItem: (isActive) => ({
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: isActive ? '3px solid var(--gov-primary)' : 'none',
            color: isActive ? 'var(--gov-primary)' : '#666',
            fontWeight: isActive ? 'bold' : 'normal',
            marginBottom: '-2px'
        }),
        section: { lineHeight: '1.6', color: '#333' },
        heading: { color: 'var(--gov-primary)', marginTop: 0 }
    };

    return (
        <div style={styles.container}>
            <h1 style={{ textAlign: 'center', color: 'var(--gov-primary)' }}>Help & Support Center</h1>

            <div style={styles.nav}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        style={styles.navItem(activeTab === tab.id)}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <div className="gov-card" style={{ padding: '30px', minHeight: '400px' }}>

                {activeTab === 'about' && (
                    <div style={styles.section}>
                        <h2 style={styles.heading}>About the Platform</h2>
                        <p>
                            The <strong>National Unified Citizen Grievance & Governance Platform</strong> is a Digital Public Infrastructure (DPI) initiative designed to streamline the interaction between citizens and government bodies.
                        </p>
                        <p>
                            <strong>Mission:</strong> To provide a transparent, efficient, and accountable mechanism for grievance redressal across all levels of governance (National, State, District).
                        </p>
                        <h3>Key Features</h3>
                        <ul>
                            <li><strong>One Nation, One Platform:</strong> Seamless integration across 28 States & 8 UTs.</li>
                            <li><strong>AI-Enabled:</strong> Intelligent categorization and 24/7 "Sahayak" assistance.</li>
                            <li><strong>Timeline Bound:</strong> Strict SLAs with auto-escalation features.</li>
                        </ul>
                    </div>
                )}

                {activeTab === 'sla' && (
                    <div style={styles.section}>
                        <h2 style={styles.heading}>SLAs & Escalation Rules</h2>
                        <p>We are committed to time-bound resolution. The Service Level Agreements (SLAs) are as follows:</p>

                        <table className="gov-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Resolution Time</th>
                                    <th>Level 1 Escalation</th>
                                    <th>Level 2 Escalation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Emergency / Critical</strong></td>
                                    <td>12 - 24 Hours</td>
                                    <td>Dept Head (+4 Hours)</td>
                                    <td>District Collector (+12 Hours)</td>
                                </tr>
                                <tr>
                                    <td><strong>Public Utilities (Water/Power)</strong></td>
                                    <td>24 Hours</td>
                                    <td>Dept Head (+1 Day)</td>
                                    <td>District Collector (+2 Days)</td>
                                </tr>
                                <tr>
                                    <td><strong>Civic Amenities (Roads/Sanitation)</strong></td>
                                    <td>48 Hours</td>
                                    <td>Dept Head (+2 Days)</td>
                                    <td>Municipal Comm. (+4 Days)</td>
                                </tr>
                                <tr>
                                    <td><strong>General Administrative</strong></td>
                                    <td>72 Hours</td>
                                    <td>Dept Head (+3 Days)</td>
                                    <td>State Admin (+7 Days)</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
                            * Escalations are triggered automatically by the system if the deadline is breached.
                        </p>
                    </div>
                )}

                {activeTab === 'faq' && (
                    <div style={styles.section}>
                        <h2 style={styles.heading}>Frequently Asked Questions</h2>

                        <details style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>How do I track my grievance?</summary>
                            <p style={{ marginTop: '10px' }}>You can track your grievance by logging into your dashboard or using the "Sahayak" Status Chatbot on the bottom right/using the "Track Status" button on the home page.</p>
                        </details>

                        <details style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Can I file a complaint anonymously?</summary>
                            <p style={{ marginTop: '10px' }}>No. To ensure accountability and prevent spam, we require identity verification (Aadhaar/Mobile OTP) for all submissions. However, your identity is kept confidential for sensitive matters.</p>
                        </details>

                        <details style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>What if I am not satisfied with the resolution?</summary>
                            <p style={{ marginTop: '10px' }}>You can "Re-open" a ticket within 7 days of closure or provide negative feedback, which automatically flags the issue for review by a senior officer.</p>
                        </details>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div style={styles.section}>
                        <h2 style={styles.heading}>Contact Support</h2>
                        <p>If you are facing technical issues with the portal, please reach out to our helpdesk.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div className="gov-card" style={{ textAlign: 'center' }}>
                                <h3>📞 Toll Free</h3>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gov-primary)' }}>1800-11-0000</p>
                                <small>9:00 AM - 6:00 PM (Mon-Sat)</small>
                            </div>
                            <div className="gov-card" style={{ textAlign: 'center' }}>
                                <h3>📧 Email</h3>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gov-primary)' }}>helpdesk@gov.in</p>
                                <small>Response within 24 Hours</small>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default HelpCenter;
