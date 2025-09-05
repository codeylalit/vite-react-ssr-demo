import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface PerformanceMark {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private isInitialized = false;
  private performanceMarks: Map<string, PerformanceMark> = new Map();
  private contextData: ErrorContext = {};

  initialize(config: {
    dsn?: string;
    environment?: string;
    release?: string;
    sampleRate?: number;
    tracesSampleRate?: number;
  }) {
    if (this.isInitialized) {
      console.warn('Error tracker already initialized');
      return;
    }

    Sentry.init({
      dsn: config.dsn || import.meta.env.VITE_SENTRY_DSN,
      environment: config.environment || import.meta.env.MODE,
      release: config.release || import.meta.env.VITE_APP_VERSION,
      sampleRate: config.sampleRate || 1.0,
      tracesSampleRate: config.tracesSampleRate || 0.1,
      
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: [
            /^\//,
            /^https:\/\/api\.zerovoiceinfinity\.com/,
          ],
          // Use a simple routing instrumentation that doesn't rely on specific router hooks
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            // Provide minimal location tracking without specific router dependencies
            () => ({ pathname: window.location.pathname }),
            () => ({ action: 'POP' })
          ),
        }),
      ],

      // Capture console errors
      beforeSend(event, hint) {
        // Filter out development errors
        if (config.environment === 'development') {
          console.group('🐛 Sentry Event');
          console.log('Event:', event);
          console.log('Hint:', hint);
          console.groupEnd();
        }

        // Filter out known irrelevant errors
        if (event.exception) {
          const error = hint.originalException;
          
          // Filter out network errors that are expected
          if (error instanceof Error) {
            if (error.message.includes('Network Error') || 
                error.message.includes('fetch')) {
              return null;
            }
          }
        }

        return event;
      },

      // Set user context
      initialScope: {
        tags: {
          component: 'frontend',
          framework: 'react',
        },
      },
    });

    this.isInitialized = true;
    console.log('Error tracking initialized');
  }

  // Context Management
  setUserContext(user: { id: string; email?: string; username?: string }) {
    this.contextData.userId = user.id;
    
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  setSessionContext(sessionId: string) {
    this.contextData.sessionId = sessionId;
    
    Sentry.setTag('sessionId', sessionId);
  }

  setComponentContext(component: string) {
    this.contextData.component = component;
    
    Sentry.setTag('component', component);
  }

  addBreadcrumb(message: string, category: string, level: Sentry.SeverityLevel = 'info', data?: any) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  }

  // Error Reporting
  captureError(error: Error, context?: ErrorContext) {
    const finalContext = { ...this.contextData, ...context };
    
    Sentry.withScope((scope) => {
      // Set context
      if (finalContext.component) {
        scope.setTag('component', finalContext.component);
      }
      
      if (finalContext.action) {
        scope.setTag('action', finalContext.action);
      }
      
      if (finalContext.metadata) {
        scope.setContext('metadata', finalContext.metadata);
      }
      
      // Capture the error
      Sentry.captureException(error);
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Captured error:', error, finalContext);
    }
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: ErrorContext) {
    const finalContext = { ...this.contextData, ...context };
    
    Sentry.withScope((scope) => {
      if (finalContext.component) {
        scope.setTag('component', finalContext.component);
      }
      
      if (finalContext.action) {
        scope.setTag('action', finalContext.action);
      }
      
      if (finalContext.metadata) {
        scope.setContext('metadata', finalContext.metadata);
      }
      
      Sentry.captureMessage(message, level);
    });
  }

  // Performance Monitoring
  startPerformanceMark(name: string, metadata?: Record<string, any>) {
    const mark: PerformanceMark = {
      name,
      startTime: performance.now(),
      metadata,
    };
    
    this.performanceMarks.set(name, mark);
    
    // Create Sentry transaction
    const transaction = Sentry.startTransaction({
      name,
      op: 'performance.mark',
    });
    
    return transaction;
  }

  endPerformanceMark(name: string): PerformanceMark | null {
    const mark = this.performanceMarks.get(name);
    
    if (!mark) {
      console.warn(`Performance mark "${name}" not found`);
      return null;
    }
    
    mark.endTime = performance.now();
    mark.duration = mark.endTime - mark.startTime;
    
    // Send to Sentry
    Sentry.addBreadcrumb({
      message: `Performance: ${name}`,
      category: 'performance',
      level: 'info',
      data: {
        duration: mark.duration,
        ...mark.metadata,
      },
    });
    
    this.performanceMarks.delete(name);
    return mark;
  }

  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    const transaction = this.startPerformanceMark(name, metadata);
    
    try {
      const result = fn();
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          this.endPerformanceMark(name);
          transaction?.finish();
        }) as T;
      }
      
      this.endPerformanceMark(name);
      transaction?.finish();
      return result;
    } catch (error) {
      this.endPerformanceMark(name);
      transaction?.finish();
      this.captureError(error as Error, { action: name, metadata });
      throw error;
    }
  }

  // API Call Monitoring
  monitorAPICall(url: string, method: string, startTime: number, endTime: number, success: boolean, status?: number) {
    const duration = endTime - startTime;
    
    Sentry.addBreadcrumb({
      message: `API ${method} ${url}`,
      category: 'http',
      level: success ? 'info' : 'error',
      data: {
        url,
        method,
        duration,
        status,
        success,
      },
    });
    
    // Track slow API calls
    if (duration > 3000) { // 3 seconds
      this.captureMessage(
        `Slow API call: ${method} ${url}`,
        'warning',
        {
          action: 'api_call',
          metadata: {
            url,
            method,
            duration,
            status,
          },
        }
      );
    }
  }

  // User Action Tracking
  trackUserAction(action: string, component: string, metadata?: Record<string, any>) {
    this.addBreadcrumb(
      `User action: ${action}`,
      'user',
      'info',
      {
        component,
        action,
        ...metadata,
      }
    );
    
    // Set current action context
    this.contextData.action = action;
    this.contextData.component = component;
  }

  // Resource Monitoring
  trackResourceLoad(resource: string, loadTime: number, size?: number) {
    this.addBreadcrumb(
      `Resource loaded: ${resource}`,
      'resource',
      'info',
      {
        resource,
        loadTime,
        size,
      }
    );
  }

  // Memory Monitoring
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      this.addBreadcrumb(
        'Memory usage snapshot',
        'performance',
        'info',
        {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }
      );
    }
  }

  // Core Web Vitals
  trackCoreWebVitals() {
    // Track Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.addBreadcrumb(
            'LCP measured',
            'performance',
            'info',
            {
              value: lastEntry.startTime,
              metric: 'lcp',
            }
          );
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            this.addBreadcrumb(
              'FID measured',
              'performance',
              'info',
              {
                value: entry.processingStart - entry.startTime,
                metric: 'fid',
              }
            );
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.addBreadcrumb(
            'CLS measured',
            'performance',
            'info',
            {
              value: clsValue,
              metric: 'cls',
            }
          );
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer not supported or failed:', error);
      }
    }
  }

  // Session Replay (if configured)
  enableSessionReplay() {
    // Session replay would require additional Sentry configuration
    // This is a placeholder for when that's needed
    console.log('Session replay would be enabled here');
  }

  // Clean up
  cleanup() {
    this.performanceMarks.clear();
    this.contextData = {};
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Helper functions for React components
export const withErrorBoundary = Sentry.withErrorBoundary;
export const ErrorBoundary = Sentry.ErrorBoundary;

// HOC for automatic component error tracking
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return React.forwardRef<any, P>((props, ref) => {
    const name = componentName || Component.displayName || Component.name || 'Component';
    
    React.useEffect(() => {
      errorTracker.setComponentContext(name);
      
      return () => {
        errorTracker.setComponentContext('');
      };
    }, [name]);
    
    return (
      <Sentry.ErrorBoundary
        fallback={({ error, resetError }) => (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="text-red-800 font-medium">Something went wrong in {name}</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <button
              onClick={resetError}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}
        beforeCapture={(scope) => {
          scope.setTag('component', name);
        }}
      >
        <Component {...props} ref={ref} />
      </Sentry.ErrorBoundary>
    );
  });
}

export default errorTracker; 