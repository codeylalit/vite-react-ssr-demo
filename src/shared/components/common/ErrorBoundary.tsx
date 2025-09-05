import React, { Component, ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'section' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    // Report error to external service (e.g., Sentry)
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would send this to your error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('user_id'),
      errorId: this.state.errorId,
    };

    // For development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Report');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.table(errorReport);
      console.groupEnd();
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorReport });
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(reportError => {
        console.error('Failed to report error:', reportError);
      });
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  renderFallback = () => {
    const { level = 'component' } = this.props;
    const { error, errorId } = this.state;

    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Different UI based on error level
    switch (level) {
      case 'page':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Something went wrong
                </CardTitle>
                <CardDescription className="text-gray-600">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                    <p className="font-medium text-red-800">Error Details:</p>
                    <p className="text-red-700 mt-1">{error?.message}</p>
                    {errorId && <p className="text-red-600 text-xs mt-2">Error ID: {errorId}</p>}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'section':
        return (
          <Card className="w-full border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-900">Section Error</h3>
                  <p className="text-red-700 text-sm mt-1">
                    This section couldn't load properly. You can try refreshing or continue using
                    other parts of the app.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-red-600 text-xs mt-2">{error?.message}</p>
                  )}
                  <Button
                    onClick={this.handleRetry}
                    size="sm"
                    variant="outline"
                    className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'component':
      default:
        return (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <Bug className="w-4 h-4" />
              <span className="text-sm font-medium">Component Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">This component failed to render.</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-red-600 text-xs mt-2">{error?.message}</p>
            )}
            <Button
              onClick={this.handleRetry}
              size="sm"
              variant="ghost"
              className="mt-2 h-6 px-2 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        );
    }
  };

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

// Convenience components for different error boundary levels
export const PageErrorBoundary = ({ children, ...props }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="page" {...props}>
    {children}
  </ErrorBoundary>
);

export const SectionErrorBoundary = ({ children, ...props }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="section" {...props}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary = ({ children, ...props }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="component" {...props}>
    {children}
  </ErrorBoundary>
);
