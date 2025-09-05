import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher';

import { AccessibilityQuickActions } from '@/shared/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/hooks/useAccessibility';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { announce } = useAccessibility();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the landing page
    const isOnLandingPage = location.pathname === '/';

    if (isOnLandingPage) {
      // If on landing page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Announce navigation for screen readers
        announce(`Navigated to ${sectionId} section`);
      }
    } else {
      // If on any other page, navigate to landing page with anchor
      navigate(`/#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Pingala V1', href: '/pingala', current: location.pathname === '/pingala' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with link to landing page */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <img src="/logo-light.png" alt="Shunya Labs" className="h-12 object-contain" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map(item => {
              const isPingala = item.name === 'Pingala V1';
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`text-base font-medium relative group py-2 transition-colors duration-200 ${
                    isPingala
                      ? item.current
                        ? 'text-orange-600 font-semibold'
                        : 'text-orange-500 font-semibold hover:text-orange-600'
                      : item.current
                        ? 'text-[#2d4cc8] font-semibold'
                        : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                      isPingala
                        ? item.current
                          ? 'bg-gradient-to-r from-orange-400 to-orange-600 w-full'
                          : 'bg-gradient-to-r from-orange-400 to-orange-600 w-0 group-hover:w-full'
                        : item.current
                          ? 'bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] w-full'
                          : 'bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://tally.so/r/meG5RQ', '_blank')}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 px-4 py-2"
                >
                  Join Waitlist
                </Button>
                <Button
                  size="sm"
                  onClick={() => scrollToSection('demo')}
                  className="bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl px-4 py-2"
                >
                  Try Demo
                </Button>
              </>
            ) : (
              <>
                <span className="text-gray-700 text-sm">Welcome, {user?.name || 'User'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 px-4 py-2"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 px-4 py-2"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl rounded-lg mt-2 border border-gray-200 shadow-lg">
              {navigation.map(item => {
                const isPingala = item.name === 'Pingala V1';
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left ${
                      isPingala
                        ? item.current
                          ? 'text-orange-600 bg-orange-50 font-semibold border border-orange-200'
                          : 'text-orange-500 bg-orange-50/50 font-semibold hover:bg-orange-50'
                        : item.current
                          ? 'text-[#2d4cc8] bg-[#2d4cc8]/10 font-semibold'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              <div className="pt-4 flex flex-col space-y-2">
                {!isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        window.open('https://tally.so/r/meG5RQ', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 justify-start"
                    >
                      Join Waitlist
                    </Button>
                    <Button
                      onClick={() => {
                        scrollToSection('demo');
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold"
                    >
                      Try Demo
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-gray-700 text-sm px-3 py-2">
                      Welcome, {user?.name || 'User'}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 justify-start"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 justify-start"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
