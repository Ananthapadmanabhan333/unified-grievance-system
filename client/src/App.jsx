import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import ChatWidget from './components/ChatWidget';
import AnalyticsCommandCenter from './pages/dashboards/AnalyticsCommandCenter';
import Profile from './pages/Profile';
import HelpCenter from './pages/HelpCenter';
import MutualHelp from './pages/MutualHelp';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/verification" element={
            <PrivateRoute>
              <Verification />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/command-center" element={
            <PrivateRoute>
              <AnalyticsCommandCenter />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/mutual-help" element={
            <PrivateRoute>
              <MutualHelp />
            </PrivateRoute>
          } />
        </Routes>
        <ChatWidget />
      </Router>
    </AuthProvider>
  );
}

export default App;
