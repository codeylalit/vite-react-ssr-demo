import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PRNewsPage from './pages/PRNewsPage';

const PRNewsModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PRNewsPage />} />
    </Routes>
  );
};

export default PRNewsModule;
