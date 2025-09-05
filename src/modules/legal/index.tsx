import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';

const LegalModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/legal/privacy" replace />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/security" element={<Security />} />
    </Routes>
  );
};

export default LegalModule;
