import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Namaste! I am Sahayak, your AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load History
    useEffect(() => {
        if (user && isOpen) {
            axios.get('/ai/history')
                .then(res => {
                    const history = res.data.map(h => ([
                        { sender: 'user', text: h.query },
                        { sender: 'bot', text: h.response }
                    ])).flat();
                    if (history.length > 0) {
                        setMessages(prev => [prev[0], ...history]); // Keep welcome message
                    }
                })
                .catch(err => console.error('Failed to load history', err));
        }
    }, [user, isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Context includes current page (placeholder) and user info
            const context = {
                page: window.location.pathname,
                role: user?.role || 'Guest'
            };

            const res = await axios.post('/ai/chat', {
                message: userMsg.text,
                context
            });

            const botMsg = { sender: 'bot', text: res.data.text };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Styles
    const styles = {
        widgetContainer: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            fontFamily: 'Inter, sans-serif'
        },
        fab: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--gov-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '24px'
        },
        chatWindow: {
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
        },
        header: {
            backgroundColor: 'var(--gov-primary)',
            color: 'white',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
        },
        body: {
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        },
        footer: {
            padding: '10px',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px',
            backgroundColor: 'white'
        },
        input: {
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            outline: 'none',
            fontSize: '14px'
        },
        sendBtn: {
            backgroundColor: 'var(--gov-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        msgBubble: (sender) => ({
            maxWidth: '80%',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '14px',
            lineHeight: '1.4',
            alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: sender === 'user' ? 'var(--gov-primary)' : 'white',
            color: sender === 'user' ? 'white' : '#333',
            boxShadow: sender === 'bot' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            borderBottomRightRadius: sender === 'user' ? '2px' : '12px',
            borderBottomLeftRadius: sender === 'bot' ? '2px' : '12px',
            whiteSpace: 'pre-line'
        })
    };

    return (
        <div style={styles.widgetContainer}>
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#0f0', borderRadius: '50%' }}></div>
                            <span style={{ fontWeight: '600' }}>Sahayak AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
                    </div>

                    <div style={styles.body}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={styles.msgBubble(msg.sender)}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ ...styles.msgBubble('bot'), fontStyle: 'italic', color: '#888' }}>
                                Sahayak is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={styles.footer}>
                        <input
                            style={styles.input}
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button style={styles.sendBtn} onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}

            <div style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '❌' : '💬'}
            </div>
        </div>
    );
};

export default ChatWidget;
