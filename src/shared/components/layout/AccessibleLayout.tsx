import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccessibility } from '@/shared/hooks/useAccessibility';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  mainContentId?: string;
  className?: string;
}

export function AccessibleLayout({ 
  children, 
  mainContentId = 'main-content',
  className = '' 
}: AccessibleLayoutProps) {
  const location = useLocation();
  const { announce } = useAccessibility();

  // Announce route changes to screen readers
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    announce(`Navigated to ${pageName} page`, 'polite');
  }, [location.pathname, announce]);

  // Reset focus to main content on route changes
  useEffect(() => {
    const mainContent = document.getElementById(mainContentId);
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname, mainContentId]);

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Skip to main content - moved to Header component */}
      
      {/* Main content area */}
      <main 
        id={mainContentId}
        role="main" 
        aria-label="Main content"
        tabIndex={-1}
        className="focus:outline-none"
      >
        {children}
      </main>
      
      {/* Footer landmark */}
      <footer 
        id="footer" 
        role="contentinfo" 
        aria-label="Site footer"
        className="sr-only"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Shunya Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to get page name from pathname
function getPageName(pathname: string): string {
  if (pathname === '/') return 'Home';
  
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  // Handle dashboard routes
  if (segments[0] === 'dashboard') {
    if (segments.length === 1) return 'Dashboard Overview';
    return `Dashboard ${formatSegment(lastSegment)}`;
  }
  
  return formatSegment(lastSegment);
}

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Higher-order component for wrapping pages with accessibility features
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    pageTitle?: string;
    skipToContentTarget?: string;
  }
) {
  return function AccessiblePage(props: P) {
    const { pageTitle, skipToContentTarget = 'main-content' } = options || {};
    const { announce } = useAccessibility();

    useEffect(() => {
      if (pageTitle) {
        document.title = pageTitle;
        announce(`Page loaded: ${pageTitle}`, 'polite');
      }
    }, [pageTitle, announce]);

    return (
      <AccessibleLayout mainContentId={skipToContentTarget}>
        <Component {...props} />
      </AccessibleLayout>
    );
  };
}

// Utility component for creating accessible headings with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AccessibleHeading({ 
  level, 
  children, 
  className = '', 
  id 
}: AccessibleHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      id={id}
      className={`heading-${level} ${className}`}
      tabIndex={-1}
    >
      {children}
    </Tag>
  );
}

// Component for accessible status announcements
interface StatusAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  delay?: number;
}

export function StatusAnnouncement({ 
  message, 
  priority = 'polite', 
  delay = 100 
}: StatusAnnouncementProps) {
  const { announce } = useAccessibility();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      announce(message, priority);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [message, priority, delay, announce]);
  
  return null; // This component doesn't render anything visible
}

// Component for creating accessible regions
interface AccessibleRegionProps {
  children: React.ReactNode;
  label: string;
  role?: string;
  className?: string;
  id?: string;
}

export function AccessibleRegion({ 
  children, 
  label, 
  role = 'region',
  className = '',
  id 
}: AccessibleRegionProps) {
  return (
    <div 
      id={id}
      role={role}
      aria-label={label}
      className={className}
    >
      {children}
    </div>
  );
} 