import { format, formatDistanceToNow } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Pending': 'var(--warning)',
        'In Progress': 'var(--primary)',
        'Resolved': 'var(--success)',
        'Escalated': 'var(--danger)',
        'Rejected': 'grey'
    };

    return (
        <span style={{
            backgroundColor: colors[status] || 'grey',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
        }}>
            {status}
        </span>
    );
};

export default function GrievanceCard({ grievance, isOfficial, onUpdateStatus }) {
    const locationStr = typeof grievance.location === 'object'
        ? grievance.location?.address || `${grievance.location?.lat}, ${grievance.location?.lng}`
        : grievance.location;

    const isOverdue = new Date(grievance.slaDeadline) < new Date() && grievance.status !== 'Resolved';

    // AI Helpers
    const sentimentColor = (score) => {
        if (!score) return 'var(--text-muted)';
        if (score < -0.2) return 'var(--danger)'; // Negative
        if (score > 0.2) return 'var(--success)'; // Positive
        return 'var(--warning)'; // Neutral
    };

    const riskBadge = (level) => {
        const colors = { 'Low': 'var(--success)', 'Medium': 'var(--warning)', 'High': 'var(--danger)' };
        return level ? <span className="badge" style={{ backgroundColor: colors[level], fontSize: '0.7rem' }}>Risk: {level}</span> : null;
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${isOverdue ? 'var(--danger)' : 'transparent'}` }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{grievance.id} • {grievance.category}</span>
                    {isOfficial && riskBadge(grievance.riskLevel)}
                </div>
                <StatusBadge status={grievance.status} />
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0' }}>{grievance.title}</h3>

            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {grievance.description}
            </p>

            {/* AI Sentiment Indicator */}
            {isOfficial && grievance.sentimentScore !== null && (
                <div style={{ marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>AI Sentiment:</strong>
                    <div style={{
                        height: '8px', flex: 1, maxWidth: '100px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${((grievance.sentimentScore + 1) / 2) * 100}%`, // Map -1..1 to 0..100
                            height: '100%',
                            backgroundColor: sentimentColor(grievance.sentimentScore)
                        }} />
                    </div>
                    <span style={{ color: sentimentColor(grievance.sentimentScore) }}>
                        {grievance.sentimentScore?.toFixed(2)}
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                    <strong>Location:</strong> <br />
                    {locationStr || 'N/A'}
                </div>
                <div>
                    <strong>SLA Deadline:</strong> <br />
                    <span style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>
                        {grievance.slaDeadline ? format(new Date(grievance.slaDeadline), 'MMM d, HH:mm') : 'N/A'}
                        {isOverdue && ' (Overdue!)'}
                    </span>
                </div>
            </div>

            {grievance.escalationLevel > 0 && (
                <div style={{ marginTop: '0.5rem', color: 'var(--danger)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    ⚠️ Escalated (Level {grievance.escalationLevel})
                </div>
            )}

            {isOfficial && grievance.status !== 'Resolved' && grievance.status !== 'Rejected' && (
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <button
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', flex: 1 }}
                        onClick={() => onUpdateStatus(grievance.id, 'In Progress')}
                    >
                        Accept
                    </button>
                    <button
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', backgroundColor: 'var(--success)', flex: 1 }}
                        onClick={() => {
                            const remarks = prompt('Resolution Remarks:');
                            if (remarks) onUpdateStatus(grievance.id, 'Resolved', remarks);
                        }}
                    >
                        Resolve
                    </button>
                    <button
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', backgroundColor: 'var(--text-muted)', flex: 1 }}
                        onClick={() => {
                            const remarks = prompt('Rejection Reason:');
                            if (remarks) onUpdateStatus(grievance.id, 'Rejected', remarks);
                        }}
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}
