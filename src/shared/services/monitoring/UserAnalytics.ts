interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
  exitPage?: string;
}

interface PageView {
  path: string;
  title: string;
  timestamp: number;
  loadTime?: number;
  timeOnPage?: number;
  scrollDepth?: number;
}

interface FeatureUsage {
  feature: string;
  usage_count: number;
  first_used: number;
  last_used: number;
  total_time: number;
  user_id?: string;
}

class UserAnalytics {
  private currentSession: UserSession | null = null;
  private currentPageView: PageView | null = null;
  private featureUsage: Map<string, FeatureUsage> = new Map();
  private eventQueue: AnalyticsEvent[] = [];
  private pageStartTime: number = 0;
  private isTrackingEnabled = true;
  private userId?: string;
  private readonly STORAGE_KEY = 'user_analytics_data';
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.initializeSession();
    this.setupEventListeners();
    this.startBatchingTimer();
    this.loadFromStorage();
  }

  // Initialization
  private initializeSession() {
    const sessionId = this.generateSessionId();
    
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    };

    // Store session ID for persistence across page loads
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.handlePageExit();
      } else {
        this.handlePageReturn();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.handlePageExit();
      this.flush();
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      const scrollPercent = Math.round((scrollTop + windowHeight) / docHeight * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      if (this.currentPageView) {
        this.currentPageView.scrollDepth = maxScrollDepth;
      }
    }, { passive: true });

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackClick(target);
    }, true);

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackFormSubmission(form);
    }, true);
  }

  private startBatchingTimer() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.FLUSH_INTERVAL);
  }

  // Configuration
  setUserId(userId: string) {
    this.userId = userId;
    
    if (this.currentSession) {
      this.currentSession.userId = userId;
    }
  }

  setTrackingEnabled(enabled: boolean) {
    this.isTrackingEnabled = enabled;
    
    if (!enabled) {
      this.eventQueue = [];
      this.clearStorage();
    }
  }

  // Page Tracking
  trackPageView(path: string, title: string, loadTime?: number) {
    if (!this.isTrackingEnabled) return;

    // End previous page view
    if (this.currentPageView) {
      this.endPageView();
    }

    this.pageStartTime = Date.now();
    
    this.currentPageView = {
      path,
      title,
      timestamp: this.pageStartTime,
      loadTime,
      scrollDepth: 0,
    };

    if (this.currentSession) {
      this.currentSession.pageViews++;
    }

    this.trackEvent('page_view', 'navigation', {
      path,
      title,
      load_time: loadTime,
      referrer: document.referrer,
    });
  }

  private endPageView() {
    if (!this.currentPageView) return;

    const timeOnPage = Date.now() - this.currentPageView.timestamp;
    this.currentPageView.timeOnPage = timeOnPage;

    this.trackEvent('page_exit', 'navigation', {
      path: this.currentPageView.path,
      time_on_page: timeOnPage,
      scroll_depth: this.currentPageView.scrollDepth,
    });

    if (this.currentSession) {
      this.currentSession.exitPage = this.currentPageView.path;
    }
  }

  private handlePageExit() {
    this.endPageView();
    this.trackEvent('session_pause', 'engagement', {
      timestamp: Date.now(),
    });
  }

  private handlePageReturn() {
    this.trackEvent('session_resume', 'engagement', {
      timestamp: Date.now(),
    });
  }

  // Event Tracking
  trackEvent(name: string, category: string, properties?: Record<string, any>) {
    if (!this.isTrackingEnabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties: {
        ...properties,
        page_path: window.location.pathname,
        page_title: document.title,
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.currentSession?.id,
    };

    this.eventQueue.push(event);
    
    if (this.currentSession) {
      this.currentSession.events.push(event);
    }

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flush();
    }

    this.saveToStorage();
  }

  // User Interaction Tracking
  private trackClick(element: HTMLElement) {
    const tagName = element.tagName.toLowerCase();
    const properties: Record<string, any> = {
      element: tagName,
      text: element.textContent?.slice(0, 100),
    };

    // Add specific properties based on element type
    if (element.id) properties.element_id = element.id;
    if (element.className) properties.element_class = element.className;
    
    if (tagName === 'a') {
      properties.href = (element as HTMLAnchorElement).href;
    } else if (tagName === 'button') {
      properties.button_type = (element as HTMLButtonElement).type;
    }

    this.trackEvent('click', 'interaction', properties);
  }

  private trackFormSubmission(form: HTMLFormElement) {
    const properties: Record<string, any> = {
      form_id: form.id,
      form_action: form.action,
      form_method: form.method,
      field_count: form.elements.length,
    };

    this.trackEvent('form_submit', 'interaction', properties);
  }

  // Feature Usage Tracking
  trackFeatureUsage(feature: string, timeSpent?: number) {
    if (!this.isTrackingEnabled) return;

    const now = Date.now();
    const existing = this.featureUsage.get(feature);
    
    if (existing) {
      existing.usage_count++;
      existing.last_used = now;
      if (timeSpent) {
        existing.total_time += timeSpent;
      }
    } else {
      this.featureUsage.set(feature, {
        feature,
        usage_count: 1,
        first_used: now,
        last_used: now,
        total_time: timeSpent || 0,
        user_id: this.userId,
      });
    }

    this.trackEvent('feature_usage', 'engagement', {
      feature,
      time_spent: timeSpent,
      usage_count: this.featureUsage.get(feature)?.usage_count,
    });

    this.saveToStorage();
  }

  // Conversion Tracking
  trackConversion(goal: string, value?: number, currency?: string) {
    if (!this.isTrackingEnabled) return;

    this.trackEvent('conversion', 'business', {
      goal,
      value,
      currency,
      session_duration: this.getSessionDuration(),
      page_views_in_session: this.currentSession?.pageViews,
    });
  }

  // Error Tracking
  trackError(error: string, category: string = 'javascript', details?: Record<string, any>) {
    this.trackEvent('error', 'technical', {
      error_message: error,
      error_category: category,
      ...details,
    });
  }

  // Performance Tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent('performance', 'technical', {
      metric,
      value,
      unit,
      user_agent: navigator.userAgent,
      connection: this.getConnectionInfo(),
    });
  }

  // Search Tracking
  trackSearch(query: string, results_count?: number, category?: string) {
    this.trackEvent('search', 'interaction', {
      query: query.toLowerCase(), // Normalize for privacy
      query_length: query.length,
      results_count,
      category,
    });
  }

  // A/B Test Tracking
  trackExperiment(experiment_name: string, variant: string, converted?: boolean) {
    this.trackEvent('experiment', 'testing', {
      experiment_name,
      variant,
      converted,
    });
  }

  // Session Management
  private getSessionDuration(): number {
    if (!this.currentSession) return 0;
    return Date.now() - this.currentSession.startTime;
  }

  endSession() {
    if (!this.currentSession) return;

    this.endPageView();
    
    this.currentSession.endTime = Date.now();
    
    this.trackEvent('session_end', 'engagement', {
      session_duration: this.getSessionDuration(),
      page_views: this.currentSession.pageViews,
      events_count: this.currentSession.events.length,
    });

    this.flush();
    this.currentSession = null;
  }

  // Data Export
  getSessionData(): UserSession | null {
    return this.currentSession;
  }

  getFeatureUsageData(): FeatureUsage[] {
    return Array.from(this.featureUsage.values());
  }

  getEventHistory(): AnalyticsEvent[] {
    return [...this.eventQueue];
  }

  // Data Persistence
  private saveToStorage() {
    try {
      const data = {
        session: this.currentSession,
        featureUsage: Array.from(this.featureUsage.entries()),
        eventQueue: this.eventQueue.slice(-100), // Keep only recent events
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      if (parsed.featureUsage) {
        this.featureUsage = new Map(parsed.featureUsage);
      }
      
      if (parsed.eventQueue) {
        this.eventQueue = parsed.eventQueue;
      }
      
      // Don't restore session - always start fresh
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem('analytics_session_id');
  }

  // Data Sending
  private async flush() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real app, send to your analytics backend
      await this.sendEvents(events);
      console.log(`Sent ${events.length} analytics events`);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    // Mock implementation - replace with real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Analytics events:', events);
        resolve();
      }, 100);
    });
  }

  // Utility Methods
  private generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getConnectionInfo() {
    const nav = navigator as any;
    if (nav.connection) {
      return {
        effective_type: nav.connection.effectiveType,
        downlink: nav.connection.downlink,
        rtt: nav.connection.rtt,
      };
    }
    return {};
  }

  // Privacy Compliance
  anonymizeUser() {
    this.userId = undefined;
    
    if (this.currentSession) {
      this.currentSession.userId = undefined;
    }
    
    // Remove user ID from existing events
    this.eventQueue.forEach(event => {
      event.userId = undefined;
    });
    
    this.saveToStorage();
  }

  // GDPR Compliance
  exportUserData(): any {
    return {
      session: this.currentSession,
      featureUsage: this.getFeatureUsageData(),
      events: this.eventQueue,
    };
  }

  deleteUserData() {
    this.anonymizeUser();
    this.featureUsage.clear();
    this.eventQueue = [];
    this.clearStorage();
  }
}

// Create singleton instance
export const userAnalytics = new UserAnalytics();

// React Hook for easy usage
export function useAnalytics() {
  const trackEvent = (name: string, category: string, properties?: Record<string, any>) => {
    userAnalytics.trackEvent(name, category, properties);
  };

  const trackFeatureUsage = (feature: string, timeSpent?: number) => {
    userAnalytics.trackFeatureUsage(feature, timeSpent);
  };

  const trackConversion = (goal: string, value?: number, currency?: string) => {
    userAnalytics.trackConversion(goal, value, currency);
  };

  return {
    trackEvent,
    trackFeatureUsage,
    trackConversion,
    analytics: userAnalytics,
  };
}

export default userAnalytics; 