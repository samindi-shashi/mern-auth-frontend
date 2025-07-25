import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/user', { withCredentials: true });
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleRegister = async (formData) => {
    try {
      await axios.post('/api/register', formData, { withCredentials: true });
      // Don't automatically log in the user after registration
      // They will be redirected to login page
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const handleLogin = async (formData) => {
    try {
      const res = await axios.post('/api/login', formData, { withCredentials: true });
      setIsAuthenticated(true);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />
        } />
        <Route path="/register" element={
          isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Register onRegister={handleRegister} />
        } />
        <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? 
            <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;