import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth components
import { LoginModal } from './components/LoginModal';

// Auth Module Component with Routing
function AuthModule() {
  return (
    <div className="auth-module min-h-screen flex items-center justify-center bg-gray-50">
      <Routes>
        <Route path="/login" element={<LoginModal />} />
        <Route path="/" element={<LoginModal />} />
      </Routes>
    </div>
  );
}

// Default export for lazy loading
export default AuthModule;

// Named exports for direct imports
export { LoginModal } from './components/LoginModal';

// Export other entities if available  
export * from './types';
export * from './hooks';
export * from './services';
export * from './store';
export * from './utils'; 