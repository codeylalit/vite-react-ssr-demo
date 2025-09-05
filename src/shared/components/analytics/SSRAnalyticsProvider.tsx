import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useSSRAnalytics } from '../../services/analytics/SSRAnalytics';

interface SSRAnalyticsContextType {
  trackEvent: (name: string, category: string, properties?: Record<string, any>) => void;
  trackPageView: (path: string, title: string, options?: any) => void;
  trackConversion: (goal: string, value?: number, currency?: string) => void;
  trackPerformance: (metric: string, value: number, unit?: string) => void;
  trackError: (error: string, category?: string, details?: Record<string, any>) => void;
  isServerSide: boolean;
  isClientSide: boolean;
}

const SSRAnalyticsContext = createContext<SSRAnalyticsContextType | null>(null);

interface SSRAnalyticsProviderProps {
  children: ReactNode;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  userId?: string;
}

export function SSRAnalyticsProvider({
  children,
  userAgent,
  ipAddress,
  sessionId,
  userId,
}: SSRAnalyticsProviderProps) {
  const location = useLocation();
  const analytics = useSSRAnalytics();

  // Track page views on route changes
  useEffect(() => {
    const path = location.pathname;
    const title = document.title || 'Page';

    analytics.trackPageView(path, title, {
      userAgent,
      ipAddress,
      sessionId,
      userId,
    });
  }, [location.pathname, analytics, userAgent, ipAddress, sessionId, userId]);

  // Track performance metrics on mount
  useEffect(() => {
    if (analytics.isClientSide && typeof window !== 'undefined') {
      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          // Track Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver(list => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            analytics.trackPerformance('lcp', lastEntry.startTime, 'ms', {
              userAgent,
              ipAddress,
              sessionId,
              userId,
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Track First Input Delay (FID)
          const fidObserver = new PerformanceObserver(list => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              analytics.trackPerformance('fid', entry.processingStart - entry.startTime, 'ms', {
                userAgent,
                ipAddress,
                sessionId,
                userId,
              });
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Track Cumulative Layout Shift (CLS)
          const clsObserver = new PerformanceObserver(list => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            analytics.trackPerformance('cls', clsValue, 'score', {
              userAgent,
              ipAddress,
              sessionId,
              userId,
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }

      // Track page load time
      const pageLoadTime = performance.now();
      analytics.trackPerformance('page_load_time', pageLoadTime, 'ms', {
        userAgent,
        ipAddress,
        sessionId,
        userId,
      });
    }
  }, [analytics, userAgent, ipAddress, sessionId, userId]);

  // Track errors
  useEffect(() => {
    if (analytics.isClientSide && typeof window !== 'undefined') {
      const handleError = (event: ErrorEvent) => {
        analytics.trackError(
          event.message,
          'javascript',
          {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
          },
          {
            userAgent,
            ipAddress,
            sessionId,
            userId,
          }
        );
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        analytics.trackError(
          event.reason?.message || 'Unhandled Promise Rejection',
          'promise',
          {
            reason: event.reason,
          },
          {
            userAgent,
            ipAddress,
            sessionId,
            userId,
          }
        );
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, [analytics, userAgent, ipAddress, sessionId, userId]);

  const contextValue: SSRAnalyticsContextType = {
    trackEvent: analytics.trackEvent,
    trackPageView: analytics.trackPageView,
    trackConversion: analytics.trackConversion,
    trackPerformance: analytics.trackPerformance,
    trackError: analytics.trackError,
    isServerSide: analytics.isServerSide,
    isClientSide: analytics.isClientSide,
  };

  return (
    <SSRAnalyticsContext.Provider value={contextValue}>{children}</SSRAnalyticsContext.Provider>
  );
}

export function useSSRAnalyticsContext() {
  const context = useContext(SSRAnalyticsContext);
  if (!context) {
    throw new Error('useSSRAnalyticsContext must be used within SSRAnalyticsProvider');
  }
  return context;
}
