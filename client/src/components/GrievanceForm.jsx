import { useState } from 'react';
import axios from 'axios';

export default function GrievanceForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Roads',
        location: '', priority: 'Medium',
        lat: null, lng: null // Hidden fields for backend
    });
    const [geoLoading, setGeoLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);

    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    location: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                    lat: latitude,
                    lng: longitude
                }));
                setGeoLoading(false);
            },
            () => {
                alert('Unable to retrieve your location');
                setGeoLoading(false);
            }
        );
    };

    const handlePredictCategory = async () => {
        if (!formData.description || formData.description.length < 5) return;
        try {
            const res = await axios.post('/grievances/predict', { description: formData.description });
            if (res.data && res.data.suggestedCategory) {
                setAiSuggestion(res.data.suggestedCategory);
            }
        } catch (error) {
            console.error('AI Prediction Failed', error);
        }
    };

    const applySuggestion = () => {
        setFormData({ ...formData, category: aiSuggestion });
        setAiSuggestion(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send location as object if GPS was used, else just the string
            const payload = {
                ...formData,
                location: formData.lat ? { lat: formData.lat, lng: formData.lng, address: formData.location } : formData.location
            };

            await axios.post('/grievances', payload);
            setFormData({ title: '', description: '', category: 'Roads', location: '', priority: 'Medium', lat: null, lng: null });
            setAiSuggestion(null);
            onSuccess();
        } catch (error) {
            alert('Failed to submit grievance');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ marginTop: 0, paddingBottom: '10px', borderBottom: '1px solid #ddd', color: 'var(--gov-primary)' }}>
                Lodge Public Grievance
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Subject / Title <span style={{ color: 'red' }}>*</span></label>
                    <input
                        className="input-field"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <small style={{ color: '#666' }}>Briefly summarize your issue.</small>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Detailed Description <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                        className="input-field"
                        rows="4"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        onBlur={handlePredictCategory}
                        required
                    />
                    <small style={{ color: '#666' }}>Provide as many details as possible.</small>
                </div>

                {aiSuggestion && (
                    <div style={{
                        backgroundColor: '#e3f2fd', border: '1px solid #2196f3', color: '#0d47a1',
                        padding: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span><strong>AI System Suggestion:</strong> This appears to be related to <strong>{aiSuggestion}</strong>.</span>
                        <button type="button" onClick={applySuggestion} style={{
                            background: '#2196f3', color: 'white', border: 'none',
                            padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold'
                        }}>
                            Apply Category
                        </button>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div>
                        <label>Department / Category</label>
                        <select
                            className="input-field"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Roads</option>
                            <option>Potholes</option>
                            <option>Street Light</option>
                            <option>Water Supply</option>
                            <option>Water Leakage</option>
                            <option>Sanitation</option>
                            <option>Garbage</option>
                            <option>Electricity</option>
                            <option>No Power</option>
                        </select>
                    </div>
                    <div>
                        <label>Urgency Level</label>
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
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Location <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            className="input-field"
                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required
                            style={{ flex: 1, marginBottom: 0 }}
                        />
                        <button
                            type="button"
                            className="btn-primary"
                            style={{ width: 'auto', backgroundColor: '#666', border: '1px solid #444' }}
                            onClick={handleGeoLocation}
                            disabled={geoLoading}
                        >
                            {geoLoading ? 'Locating...' : 'Use GPS'}
                        </button>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                        Submit Grievance
                    </button>
                </div>
            </form>
        </div>
    );
}
