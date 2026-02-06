import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Pending': 'var(--warning)',
        'In Progress': 'var(--primary)',
        'Resolved': 'var(--success)',
        'Escalated': 'var(--danger)'
    };

    return (
        <span style={{
            backgroundColor: colors[status] || 'grey',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.8rem',
            fontWeight: 'bold'
        }}>
            {status}
        </span>
    );
};

export default function GrievanceCard({ grievance, isOfficial, onUpdateStatus }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{grievance.title}</h3>
                <StatusBadge status={grievance.status} />
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {format(new Date(grievance.createdAt), 'MMM d, yyyy')} • {grievance.category} • {grievance.priority} Priority
            </p>

            <p style={{ margin: '1rem 0' }}>{grievance.description}</p>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                Location: {grievance.location}
            </div>

            {isOfficial && grievance.status !== 'Resolved' && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        onClick={() => onUpdateStatus(grievance.id, 'In Progress')}
                    >
                        Mark In Progress
                    </button>
                    <button
                        className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--success)' }}
                        onClick={() => onUpdateStatus(grievance.id, 'Resolved')}
                    >
                        Resolve
                    </button>
                </div>
            )}
        </div>
    );
}
