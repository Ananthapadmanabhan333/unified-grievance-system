import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GovHeader from '../components/GovHeader';
import GovSidebar from '../components/GovSidebar';
import GovFooter from '../components/GovFooter';
import CitizenDashboard from './dashboards/CitizenDashboard';
import OfficialDashboard from './dashboards/OfficialDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');

    if (!user) return <div style={{ padding: '20px' }}>Loading Profile...</div>;

    const renderContent = () => {
        switch (user.role) {
            case 'Citizen':
                return <CitizenDashboard user={user} view={currentView} />;
            case 'Department Officer':
            case 'Department Head':
                return <OfficialDashboard user={user} view={currentView} />;
            case 'Admin':
            case 'SuperAdmin':
                return <AdminDashboard user={user} view={currentView} />;
            default:
                return <CitizenDashboard user={user} view={currentView} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
            <GovHeader />

            <div className="container" style={{ display: 'flex', flex: 1, padding: '0', gap: '0', border: '1px solid #ddd', marginTop: '1rem', marginBottom: '1rem' }}>
                {/* Sidebar */}
                <GovSidebar role={user.role} currentView={currentView} onViewChange={setCurrentView} />

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
                    <h2 style={{
                        margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '1px solid #eee',
                        textTransform: 'uppercase', fontSize: '1.2rem', color: 'var(--gov-primary)'
                    }}>
                        {currentView.replace('_', ' ')}
                    </h2>

                    {renderContent()}
                </main>
            </div>

            <GovFooter />
        </div>
    );
}
