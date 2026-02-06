import { useState } from 'react';
import axios from 'axios';

export default function GrievanceForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Roads',
        location: '', priority: 'Medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/grievances', formData);
            setFormData({ title: '', description: '', category: 'Roads', location: '', priority: 'Medium' });
            onSuccess();
        } catch (error) {
            alert('Failed to submit grievance');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Register New Grievance</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <input
                    className="input-field" placeholder="Title (e.g., Pothole on Main St)"
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                />
                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                    <select
                        className="input-field"
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Roads</option>
                        <option>Water Supply</option>
                        <option>Sanitation</option>
                        <option>Electricity</option>
                    </select>
                    <select
                        className="input-field"
                        value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>
                <input
                    className="input-field" placeholder="Location"
                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required
                />
                <textarea
                    className="input-field" placeholder="Detailed Description..." rows="3"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required
                />
                <button type="submit" className="btn-primary">Submit Grievance</button>
            </form>
        </div>
    );
}
