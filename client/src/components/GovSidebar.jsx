import { useNavigate } from 'react-router-dom';

export default function GovSidebar({ role, onViewChange, currentView }) {
    const navigate = useNavigate();
    const linkStyle = (view) => ({
        display: 'block',
        padding: '10px 15px',
        color: currentView === view ? 'white' : '#333',
        backgroundColor: currentView === view ? 'var(--gov-secondary)' : 'transparent',
        textDecoration: 'none',
        borderBottom: '1px solid #ddd',
        fontWeight: currentView === view ? 'bold' : 'normal',
        cursor: 'pointer'
    });

    return (
        <aside style={{ width: '250px', backgroundColor: '#f9f9f9', borderRight: '1px solid #ddd', minHeight: 'calc(100vh - 100px)' }}>
            <div style={{ padding: '15px', background: '#eee', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                Services
            </div>
            <nav>
                <a onClick={() => onViewChange('dashboard')} style={linkStyle('dashboard')}>Dashboard Home</a>

                {role === 'Citizen' && (
                    <>
                        <a onClick={() => onViewChange('new_grievance')} style={linkStyle('new_grievance')}>Lodge Grievance</a>
                        <a onClick={() => onViewChange('my_grievances')} style={linkStyle('my_grievances')}>Track Status</a>
                    </>
                )}

                {(role === 'Department Officer' || role === 'Department Head') && (
                    <>
                        <a onClick={() => onViewChange('dept_queue')} style={linkStyle('dept_queue')}>Inbox (Queue)</a>
                        <a onClick={() => onViewChange('resolved')} style={linkStyle('resolved')}>Resolved Cases</a>
                    </>
                )}

                {(role === 'Admin' || role === 'Department Head') && (
                    <>
                        <a onClick={() => onViewChange('analytics')} style={linkStyle('analytics')}>Reports & Analytics</a>
                    </>
                )}

                <a onClick={() => navigate('/profile')} style={linkStyle('profile')}>Update Profile</a>
                <a onClick={() => navigate('/help')} style={linkStyle('help')}>Help & Manuals</a>
            </nav>
        </aside>
    );
}
