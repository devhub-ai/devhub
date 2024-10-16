// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/Theme/theme-provider";
import axios from 'axios';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;