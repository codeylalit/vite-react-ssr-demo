import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeveloperDocumentation from './pages/DeveloperDocumentation';
import PingalaV1API from './pages/PingalaV1API';
import { DocsLayout } from './layout/DocsLayout';

const DocsModule = () => {
  return (
    <DocsLayout>
      <Routes>
        <Route path="/" element={<DeveloperDocumentation />} />
        <Route path="/api" element={<PingalaV1API />} />
      </Routes>
    </DocsLayout>
  );
};

export default DocsModule;
