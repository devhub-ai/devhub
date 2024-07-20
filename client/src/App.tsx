import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import axios from 'axios';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/check_auth', { withCredentials: true });
        setAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logout', { withCredentials: true });
      if (response.data.message === 'Logout successful') {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLoginSuccess={() => setAuthenticated(true)} />} />
        <Route path="/home" element={authenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
