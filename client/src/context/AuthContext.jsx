import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure Axios default
    axios.defaults.baseURL = '/api';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const sendOtp = async (phone) => {
        await axios.post('/auth/send-otp', { phone });
    };

    const verifyOtp = async (phone, otp) => {
        const res = await axios.post('/auth/verify-otp', { phone, otp });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return res.data;
    };

    const verifyIdentity = async (aadhaarNumber, jurisdictionCode) => {
        const res = await axios.post('/auth/verify-identity', { aadhaarNumber, jurisdictionCode });
        // Update local user state
        const updatedUser = { ...user, verificationStatus: 'Fully Verified' };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, sendOtp, verifyOtp, verifyIdentity, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
