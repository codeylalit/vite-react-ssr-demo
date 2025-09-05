import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RealtimePage } from './pages/RealtimePage';

const RealtimeModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RealtimePage />} />
    </Routes>
  );
};

export default RealtimeModule;
