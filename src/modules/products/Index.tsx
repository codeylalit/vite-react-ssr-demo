import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PingalaVerbatim from './pages/PingalaVerbatim';
import AryaEcho from './pages/AryaEcho';
import BharaReason from './pages/BharaReason';
import MadaStream from './pages/MadaStream';

const ProductsModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/product/verbatim" replace />} />
      <Route path="/verbatim" element={<PingalaVerbatim />} />
      <Route path="/echo" element={<AryaEcho />} />
      <Route path="/reason" element={<BharaReason />} />
      <Route path="/stream" element={<MadaStream />} />
    </Routes>
  );
};

export default ProductsModule;
