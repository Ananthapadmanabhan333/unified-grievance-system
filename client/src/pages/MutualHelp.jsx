import React, { useState } from 'react';

export default function MutualHelp() {
    const [posts, setPosts] = useState([
        { id: 1, type: 'Offer', title: 'Free Water Tanker availability', location: 'Indiranagar', contact: '98765xxxxx', date: '2 hrs ago' },
        { id: 2, type: 'Request', title: 'Need volunteers for park cleanup', location: 'Jayanagar', contact: '98765xxxxx', date: '5 hrs ago' },
        { id: 3, type: 'Offer', title: 'Excess construction sand for giveaway', location: 'Whitefield', contact: '87654xxxxx', date: '1 day ago' }
    ]);

    const styles = {
        container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
        header: { textAlign: 'center', marginBottom: '2rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
        card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' },
        badge: (type) => ({
            background: type === 'Offer' ? '#e6fffa' : '#fff5f5',
            color: type === 'Offer' ? '#2c7a7b' : '#c53030',
            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
        })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ color: 'var(--gov-primary)' }}>🤝 Mutual Aid Community</h1>
                <p style={{ color: '#666' }}>Connect with fellow citizens to offer or request support.</p>
                <div style={{ marginTop: '1rem', padding: '10px', background: '#e3f2fd', borderRadius: '8px', display: 'inline-block' }}>
                    <strong>Note:</strong> This is a community-moderated space. Please be respectful.
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Recent Posts</h2>
                <button className="btn-primary" onClick={() => alert('Coming soon!')}>+ New Post</button>
            </div>

            <div style={styles.grid}>
                {posts.map(post => (
                    <div key={post.id} style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={styles.badge(post.type)}>{post.type}</span>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{post.date}</span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
                            📍 {post.location}
                        </div>
                        <button style={{
                            width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--gov-primary)',
                            background: 'white', color: 'var(--gov-primary)', cursor: 'pointer', fontWeight: '500'
                        }}>
                            Contact {post.contact}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
