import React from 'react';

export default function GovFooter() {
    return (
        <footer style={{
            background: '#333', color: '#fff', padding: '1rem 0', marginTop: 'auto',
            fontSize: '0.8rem', textAlign: 'center', borderTop: '4px solid var(--gov-secondary)'
        }}>
            <div className="container">
                <p style={{ margin: '0.5rem 0' }}>
                    Content owned, maintained and updated by Department of Administrative Reforms & Public Grievances.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.7 }}>
                    <span>Website Guidelines</span>
                    <span>Privacy Policy</span>
                    <span>Hyperlinking Policy</span>
                    <span>Copyright Policy</span>
                </div>
                <p style={{ marginTop: '1rem', color: '#aaa' }}>
                    Designed & Developed by National Informatics Centre (NIC) <br />
                    Ministry of Electronics & Information Technology, Government of India.
                </p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </footer>
    );
}
