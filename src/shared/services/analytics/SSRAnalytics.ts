import { userAnalytics } from '../monitoring/UserAnalytics';

// SSR-compatible analytics interface
export interface SSRAnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  isSSR?: boolean;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
}

export interface SSRSessionData {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: SSRAnalyticsEvent[];
  userAgent: string;
  referrer: string;
  ipAddress?: string;
  exitPage?: string;
  isSSR?: boolean;
}

class SSRAnalytics {
  private static instance: SSRAnalytics;
  private isServer: boolean;
  private serverEvents: SSRAnalyticsEvent[] = [];
  private serverSessions: Map<string, SSRSessionData> = new Map();

  constructor() {
    this.isServer = typeof window === 'undefined';
  }

  static getInstance(): SSRAnalytics {
    if (!SSRAnalytics.instance) {
      SSRAnalytics.instance = new SSRAnalytics();
    }
    return SSRAnalytics.instance;
  }

  // Track page view with SSR support
  trackPageView(
    path: string,
    title: string,
    options?: {
      loadTime?: number;
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
      sessionId?: string;
      userId?: string;
    }
  ) {
    const event: SSRAnalyticsEvent = {
      name: 'page_view',
      category: 'navigation',
      properties: {
        path,
        title,
        load_time: options?.loadTime,
        referrer:
          options?.referrer || (typeof document !== 'undefined' ? document.referrer : 'direct'),
      },
      timestamp: Date.now(),
      userId: options?.userId,
      sessionId: options?.sessionId,
      isSSR: this.isServer,
      userAgent: options?.userAgent,
      ipAddress: options?.ipAddress,
      referrer: options?.referrer,
    };

    if (this.isServer) {
      this.serverEvents.push(event);
      this.updateServerSession(event);
    } else if (typeof window !== 'undefined') {
      // Use client-side analytics only if window is available
      try {
        userAnalytics.trackPageView(path, title, options?.loadTime);
      } catch (error) {
        console.warn('Client-side analytics not available:', error);
      }
    }

    return event;
  }

  // Track custom events with SSR support
  trackEvent(
    name: string,
    category: string,
    properties?: Record<string, any>,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) {
    const event: SSRAnalyticsEvent = {
      name,
      category,
      properties: {
        ...properties,
        page_path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        page_title: typeof document !== 'undefined' ? document.title : 'unknown',
      },
      timestamp: Date.now(),
      userId: options?.userId,
      sessionId: options?.sessionId,
      isSSR: this.isServer,
      userAgent: options?.userAgent,
      ipAddress: options?.ipAddress,
    };

    if (this.isServer) {
      this.serverEvents.push(event);
      this.updateServerSession(event);
    } else if (typeof window !== 'undefined') {
      // Use client-side analytics only if window is available
      try {
        userAnalytics.trackEvent(name, category, properties);
      } catch (error) {
        console.warn('Client-side analytics not available:', error);
      }
    }

    return event;
  }

  // Track conversion events
  trackConversion(
    goal: string,
    value?: number,
    currency?: string,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) {
    return this.trackEvent(
      'conversion',
      'business',
      {
        goal,
        value,
        currency,
      },
      options
    );
  }

  // Track performance metrics
  trackPerformance(
    metric: string,
    value: number,
    unit: string = 'ms',
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) {
    return this.trackEvent(
      'performance',
      'metrics',
      {
        metric,
        value,
        unit,
      },
      options
    );
  }

  // Track errors
  trackError(
    error: string,
    category: string = 'javascript',
    details?: Record<string, any>,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) {
    return this.trackEvent(
      'error',
      category,
      {
        error,
        details,
      },
      options
    );
  }

  // Get server-side events (for sending to analytics backend)
  getServerEvents(): SSRAnalyticsEvent[] {
    return [...this.serverEvents];
  }

  // Get server-side sessions
  getServerSessions(): SSRSessionData[] {
    return Array.from(this.serverSessions.values());
  }

  // Clear server-side events (after sending to backend)
  clearServerEvents(): void {
    this.serverEvents = [];
  }

  // Clear server-side sessions
  clearServerSessions(): void {
    this.serverSessions.clear();
  }

  // Update server session with new event
  private updateServerSession(event: SSRAnalyticsEvent): void {
    if (!event.sessionId) return;

    const session = this.serverSessions.get(event.sessionId) || {
      id: event.sessionId,
      startTime: event.timestamp,
      pageViews: 0,
      events: [],
      userAgent: event.userAgent || 'unknown',
      referrer: event.referrer || 'direct',
      ipAddress: event.ipAddress,
      isSSR: true,
    };

    if (event.name === 'page_view') {
      session.pageViews++;
    }

    session.events.push(event);
    this.serverSessions.set(event.sessionId, session);
  }

  // Generate session ID
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send server events to analytics backend
  async sendServerEvents(apiEndpoint: string): Promise<boolean> {
    if (this.serverEvents.length === 0) return true;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: this.serverEvents,
          sessions: this.getServerSessions(),
          timestamp: Date.now(),
        }),
      });

      if (response.ok) {
        this.clearServerEvents();
        this.clearServerSessions();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to send server analytics events:', error);
      return false;
    }
  }

  // Check if running on server
  isServerSide(): boolean {
    return this.isServer;
  }

  // Check if running on client
  isClientSide(): boolean {
    return !this.isServer;
  }
}

// Export singleton instance
export const ssrAnalytics = SSRAnalytics.getInstance();

// React hook for SSR analytics
export function useSSRAnalytics() {
  const trackEvent = (
    name: string,
    category: string,
    properties?: Record<string, any>,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) => {
    return ssrAnalytics.trackEvent(name, category, properties, options);
  };

  const trackPageView = (
    path: string,
    title: string,
    options?: {
      loadTime?: number;
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
      sessionId?: string;
      userId?: string;
    }
  ) => {
    return ssrAnalytics.trackPageView(path, title, options);
  };

  const trackConversion = (
    goal: string,
    value?: number,
    currency?: string,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) => {
    return ssrAnalytics.trackConversion(goal, value, currency, options);
  };

  const trackPerformance = (
    metric: string,
    value: number,
    unit?: string,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) => {
    return ssrAnalytics.trackPerformance(metric, value, unit, options);
  };

  const trackError = (
    error: string,
    category?: string,
    details?: Record<string, any>,
    options?: {
      userAgent?: string;
      ipAddress?: string;
      sessionId?: string;
      userId?: string;
    }
  ) => {
    return ssrAnalytics.trackError(error, category, details, options);
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackPerformance,
    trackError,
    isServerSide: ssrAnalytics.isServerSide(),
    isClientSide: ssrAnalytics.isClientSide(),
  };
}
