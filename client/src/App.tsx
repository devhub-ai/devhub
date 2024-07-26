import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import axios from 'axios';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import { Toaster } from "@/components/ui/sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${backendUrl}/check_auth`, { withCredentials: true });
        if (response.data.authenticated) {
          setAuthenticated(true);
          setUsername(response.data.username); // Store the username
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${backendUrl}/logout`, { withCredentials: true });
      if (response.data.message === 'Logout successful') {
        setAuthenticated(false);
        setUsername(null); // Clear username on logout
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
          <Route path="/home" element={authenticated ? <Home onLogout={handleLogout} username={username || ''} /> : <Navigate to="/" />} />
          <Route path="/u/:username" element={<Profile />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
