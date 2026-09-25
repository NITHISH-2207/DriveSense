import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './pages/SplashScreen';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { VehiclesPage } from './pages/VehiclesPage';

export function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFCFB] text-[#1F2927]">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 1. Splash Screen ("The First Signal", one-time, auto-redirects to /login) */}
          <Route path="/" element={<SplashScreen />} />

          {/* 2. Login Page ("Welcome back.") */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Signup Page ("Let's begin.") */}
          <Route path="/signup" element={<SignupPage />} />

          {/* 4. Home Page (First-time invitation, inline setup, success state, and active vehicle view) */}
          <Route path="/home" element={<HomePage />} />

          {/* 5. My Vehicles Management View */}
          <Route path="/vehicles" element={<VehiclesPage />} />

          {/* Catch-all route -> /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
