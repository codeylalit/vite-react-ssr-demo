import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';

// Import dashboard pages directly since they use named exports
import { Overview } from './pages/Overview';
import { ApiKeys } from './pages/ApiKeys';

// For pages that have default exports, use dynamic imports with fallback
const Usage = React.lazy(() => import('./pages/Usage'));
const Billing = React.lazy(() => import('./pages/Billing'));
const Docs = React.lazy(() => import('./pages/Docs'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Support = React.lazy(() => import('./pages/Support'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-spinner flex items-center justify-center min-h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3">Loading...</span>
  </div>
);

// Dashboard Module Component with Routing
function DashboardModule() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/api-keys" element={<ApiKeys />} />
        <Route 
          path="/usage" 
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Usage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/billing" 
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Billing />
            </React.Suspense>
          } 
        />
        <Route 
          path="/docs" 
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Docs />
            </React.Suspense>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Settings />
            </React.Suspense>
          } 
        />
        <Route 
          path="/support" 
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Support />
            </React.Suspense>
          } 
        />
      </Routes>
    </DashboardLayout>
  );
}

// Default export for lazy loading
export default DashboardModule;

// Named exports for direct imports
export { DashboardLayout } from './components/DashboardLayout';
export { Overview } from './pages/Overview';
export { ApiKeys } from './pages/ApiKeys';

// Export other entities if available
export * from './types';
export * from './hooks';
export * from './services';
export * from './store';
export * from './utils';
