import React, { Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const LandingPage = React.lazy(() => import('./modules/landing/pages/Index'));

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Suspense fallback wraps around Routes where lazy component is used */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </div>
  );
}