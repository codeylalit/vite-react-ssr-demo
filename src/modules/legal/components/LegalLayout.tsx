import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import Navigation from '@/shared/components/layout/Navigation';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
  seoConfig?: keyof typeof SEO_CONFIGS;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  children,
  title,
  lastUpdated,
  seoConfig,
}) => {
  const location = useLocation();

  // Apply SEO based on the page
  if (seoConfig && SEO_CONFIGS[seoConfig]) {
    useSEO(SEO_CONFIGS[seoConfig]);
  }

  // Scroll to top when component mounts or route changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navigationItems = [
    { path: '/legal/privacy', label: 'Privacy Policy' },
    { path: '/legal/terms', label: 'Terms & Conditions' },
    { path: '/legal/security', label: 'Security Policy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/legal/privacy" className="hover:text-gray-700">
                Legal
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{title}</li>
          </ol>
        </nav>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {navigationItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated}</p>
          </div>

          <div className="px-6 py-6 prose prose-gray max-w-none">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
