import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UX Metrics interfaces
export interface UserEngagementSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: string[];
  interactions: UserInteraction[];
  deviceInfo: DeviceInfo;
  referrer: string;
  exitPage?: string;
  bounced: boolean;
  timeOnSite: number;
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'focus' | 'input' | 'submit' | 'download' | 'search';
  timestamp: number;
  element: string;
  page: string;
  metadata?: Record<string, any>;
  duration?: number; // For hover, focus events
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  viewportSize: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  touchSupport: boolean;
  connectionType?: string;
}

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  category: 'navigation' | 'core' | 'advanced' | 'experimental';
  usageCount: number;
  uniqueUsers: Set<string>;
  avgTimeToDiscover: number; // Time from first visit to first use
  avgUsageFrequency: number; // Uses per session
  dropOffRate: number; // % who try once and never return
  satisfactionScore?: number;
  lastUsed: number;
}

export interface ConversionFunnel {
  funnelId: string;
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  dropOffPoints: string[];
  averageTimeToConvert: number;
}

export interface FunnelStep {
  stepId: string;
  name: string;
  page?: string;
  action?: string;
  completions: number;
  dropOffs: number;
  averageTime: number;
}

export interface UserSatisfactionMetric {
  id: string;
  type: 'nps' | 'csat' | 'ces' | 'usability' | 'feature_rating';
  score: number;
  maxScore: number;
  userId?: string;
  sessionId: string;
  featureId?: string;
  feedback?: string;
  timestamp: number;
  context: string; // Where/when this was collected
}

export interface UXInsight {
  id: string;
  type: 'opportunity' | 'problem' | 'success' | 'trend';
  category: 'engagement' | 'conversion' | 'usability' | 'performance';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  recommendation: string;
  metrics: Record<string, number>;
  timestamp: number;
}

interface UXMetricsStore {
  sessions: UserEngagementSession[];
  interactions: UserInteraction[];
  featureUsage: Record<string, FeatureUsage>;
  conversionFunnels: ConversionFunnel[];
  satisfactionMetrics: UserSatisfactionMetric[];
  insights: UXInsight[];
  isTracking: boolean;
  
  // Actions
  startSession: (session: Omit<UserEngagementSession, 'timeOnSite' | 'bounced'>) => void;
  endSession: (sessionId: string) => void;
  trackInteraction: (interaction: UserInteraction) => void;
  trackFeatureUsage: (featureId: string, userId?: string) => void;
  recordSatisfaction: (metric: UserSatisfactionMetric) => void;
  updateConversionFunnel: (funnelId: string, stepId: string, completed: boolean) => void;
  generateInsights: () => UXInsight[];
  
  // Analytics
  getEngagementRate: (timeframe: number) => number;
  getFeatureAdoptionRate: (featureId: string) => number;
  getConversionRate: (funnelId: string) => number;
  getAverageSatisfactionScore: (type?: string) => number;
  getUserRetentionRate: (timeframe: number) => number;
  getTopDropOffPoints: () => Array<{ page: string; rate: number }>;
  
  // Utilities
  setTracking: (enabled: boolean) => void;
  clearData: () => void;
}

export const useUXMetricsStore = create<UXMetricsStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      interactions: [],
      featureUsage: {},
      conversionFunnels: [],
      satisfactionMetrics: [],
      insights: [],
      isTracking: true,

      startSession: (sessionData) =>
        set((state) => {
          const session: UserEngagementSession = {
            ...sessionData,
            timeOnSite: 0,
            bounced: true, // Will be updated when interactions occur
          };
          return {
            sessions: [...state.sessions.slice(-999), session],
          };
        }),

      endSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.sessionId === sessionId
              ? {
                  ...session,
                  endTime: Date.now(),
                  timeOnSite: Date.now() - session.startTime,
                  bounced: session.interactions.length < 2,
                }
              : session
          ),
        })),

      trackInteraction: (interaction) =>
        set((state) => {
          // Update session with interaction
          const sessions = state.sessions.map((session) =>
            session.sessionId === interaction.page // Assuming page contains sessionId info
              ? {
                  ...session,
                  interactions: [...session.interactions, interaction],
                  bounced: false,
                }
              : session
          );

          return {
            interactions: [...state.interactions.slice(-4999), interaction],
            sessions,
          };
        }),

      trackFeatureUsage: (featureId, userId) =>
        set((state) => {
          const currentUsage = state.featureUsage[featureId] || {
            featureId,
            featureName: featureId,
            category: 'core' as const,
            usageCount: 0,
            uniqueUsers: new Set<string>(),
            avgTimeToDiscover: 0,
            avgUsageFrequency: 0,
            dropOffRate: 0,
            lastUsed: Date.now(),
          };

          if (userId) {
            currentUsage.uniqueUsers.add(userId);
          }

          return {
            featureUsage: {
              ...state.featureUsage,
              [featureId]: {
                ...currentUsage,
                usageCount: currentUsage.usageCount + 1,
                lastUsed: Date.now(),
              },
            },
          };
        }),

      recordSatisfaction: (metric) =>
        set((state) => ({
          satisfactionMetrics: [...state.satisfactionMetrics.slice(-999), metric],
        })),

      updateConversionFunnel: (funnelId, stepId, completed) =>
        set((state) => ({
          conversionFunnels: state.conversionFunnels.map((funnel) =>
            funnel.funnelId === funnelId
              ? {
                  ...funnel,
                  steps: funnel.steps.map((step) =>
                    step.stepId === stepId
                      ? {
                          ...step,
                          completions: completed
                            ? step.completions + 1
                            : step.completions,
                          dropOffs: !completed ? step.dropOffs + 1 : step.dropOffs,
                        }
                      : step
                  ),
                }
              : funnel
          ),
        })),

      generateInsights: () => {
        const state = get();
        const insights: UXInsight[] = [];
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

        // High bounce rate insight
        const recentSessions = state.sessions.filter((s) => s.startTime > weekAgo);
        const bounceRate = recentSessions.length > 0 
          ? (recentSessions.filter((s) => s.bounced).length / recentSessions.length) * 100 
          : 0;

        if (bounceRate > 70) {
          insights.push({
            id: `bounce-rate-${now}`,
            type: 'problem',
            category: 'engagement',
            title: 'High Bounce Rate Detected',
            description: `Bounce rate is ${bounceRate.toFixed(1)}%, which is above optimal range.`,
            impact: bounceRate > 85 ? 'critical' : 'high',
            confidence: 85,
            recommendation: 'Review landing page content, improve loading speed, and enhance initial user experience.',
            metrics: { bounceRate, sessions: recentSessions.length },
            timestamp: now,
          });
        }

        // Low feature adoption insight
        Object.values(state.featureUsage).forEach((feature) => {
          const adoptionRate = feature.uniqueUsers.size / Math.max(recentSessions.length, 1) * 100;
          if (adoptionRate < 10 && feature.category === 'core') {
            insights.push({
              id: `feature-adoption-${feature.featureId}-${now}`,
              type: 'opportunity',
              category: 'usability',
              title: `Low Adoption: ${feature.featureName}`,
              description: `Only ${adoptionRate.toFixed(1)}% of users are using this core feature.`,
              impact: 'medium',
              confidence: 75,
              recommendation: 'Add feature discovery hints, improve onboarding, or redesign feature visibility.',
              metrics: { adoptionRate, usageCount: feature.usageCount },
              timestamp: now,
            });
          }
        });

        // Low satisfaction insight
        const recentSatisfaction = state.satisfactionMetrics.filter((m) => m.timestamp > weekAgo);
        if (recentSatisfaction.length > 5) {
          const avgSatisfaction = recentSatisfaction.reduce((sum, m) => sum + m.score, 0) / recentSatisfaction.length;
          const maxPossible = Math.max(...recentSatisfaction.map(m => m.maxScore));
          const satisfactionPercent = (avgSatisfaction / maxPossible) * 100;

          if (satisfactionPercent < 60) {
            insights.push({
              id: `satisfaction-${now}`,
              type: 'problem',
              category: 'usability',
              title: 'Low User Satisfaction',
              description: `Average satisfaction score is ${satisfactionPercent.toFixed(1)}%.`,
              impact: 'high',
              confidence: 90,
              recommendation: 'Analyze user feedback, improve UX pain points, and follow up with dissatisfied users.',
              metrics: { satisfaction: satisfactionPercent, responses: recentSatisfaction.length },
              timestamp: now,
            });
          }
        }

        set({ insights: [...state.insights.slice(-49), ...insights] });
        return insights;
      },

      getEngagementRate: (timeframe) => {
        const { sessions } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        const recentSessions = sessions.filter((s) => s.startTime > cutoff);
        
        if (recentSessions.length === 0) return 0;
        
        const engagedSessions = recentSessions.filter((s) => 
          !s.bounced && s.timeOnSite > 30000 // More than 30 seconds
        );
        
        return (engagedSessions.length / recentSessions.length) * 100;
      },

      getFeatureAdoptionRate: (featureId) => {
        const { featureUsage, sessions } = get();
        const feature = featureUsage[featureId];
        if (!feature) return 0;
        
        const totalUsers = new Set(sessions.map(s => s.userId).filter(Boolean)).size;
        return totalUsers > 0 ? (feature.uniqueUsers.size / totalUsers) * 100 : 0;
      },

      getConversionRate: (funnelId) => {
        const { conversionFunnels } = get();
        const funnel = conversionFunnels.find((f) => f.funnelId === funnelId);
        if (!funnel || funnel.steps.length === 0) return 0;
        
        const firstStep = funnel.steps[0];
        const lastStep = funnel.steps[funnel.steps.length - 1];
        
        return firstStep.completions > 0 
          ? (lastStep.completions / firstStep.completions) * 100 
          : 0;
      },

      getAverageSatisfactionScore: (type) => {
        const { satisfactionMetrics } = get();
        const filteredMetrics = type 
          ? satisfactionMetrics.filter((m) => m.type === type)
          : satisfactionMetrics;
        
        if (filteredMetrics.length === 0) return 0;
        
        const totalScore = filteredMetrics.reduce((sum, m) => sum + (m.score / m.maxScore), 0);
        return (totalScore / filteredMetrics.length) * 100;
      },

      getUserRetentionRate: (timeframe) => {
        const { sessions } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        const previousPeriod = cutoff - timeframe * 24 * 60 * 60 * 1000;
        
        const currentUsers = new Set(
          sessions
            .filter((s) => s.startTime > cutoff && s.userId)
            .map((s) => s.userId)
        );
        
        const previousUsers = new Set(
          sessions
            .filter((s) => s.startTime > previousPeriod && s.startTime <= cutoff && s.userId)
            .map((s) => s.userId)
        );
        
        const returningUsers = [...currentUsers].filter((userId) => previousUsers.has(userId));
        
        return previousUsers.size > 0 ? (returningUsers.length / previousUsers.size) * 100 : 0;
      },

      getTopDropOffPoints: () => {
        const { sessions } = get();
        const pageDropOffs: Record<string, { exits: number; total: number }> = {};
        
        sessions.forEach((session) => {
          session.pageViews.forEach((page, index) => {
            if (!pageDropOffs[page]) {
              pageDropOffs[page] = { exits: 0, total: 0 };
            }
            pageDropOffs[page].total++;
            
            // If this is the last page in the session, count as exit
            if (index === session.pageViews.length - 1 && session.exitPage === page) {
              pageDropOffs[page].exits++;
            }
          });
        });
        
        return Object.entries(pageDropOffs)
          .map(([page, data]) => ({
            page,
            rate: data.total > 0 ? (data.exits / data.total) * 100 : 0,
          }))
          .sort((a, b) => b.rate - a.rate)
          .slice(0, 10);
      },

      setTracking: (enabled) => set({ isTracking: enabled }),

      clearData: () =>
        set({
          sessions: [],
          interactions: [],
          featureUsage: {},
          satisfactionMetrics: [],
          insights: [],
        }),
    }),
    {
      name: 'ux-metrics-store',
      version: 1,
    }
  )
);

// UX Metrics Tracker Class
class UXMetricsTracker {
  private static instance: UXMetricsTracker;
  private currentSessionId: string;
  private sessionStartTime: number;
  private pageViews: string[] = [];
  private interactions: UserInteraction[] = [];
  private isTracking = false;

  static getInstance(): UXMetricsTracker {
    if (!UXMetricsTracker.instance) {
      UXMetricsTracker.instance = new UXMetricsTracker();
    }
    return UXMetricsTracker.instance;
  }

  constructor() {
    this.currentSessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `ux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    const store = useUXMetricsStore.getState();
    if (!store.isTracking) return;

    this.isTracking = true;
    this.startSession();
    this.setupEventListeners();
    this.scheduleInsightGeneration();
  }

  private startSession() {
    const store = useUXMetricsStore.getState();
    
    const deviceInfo: DeviceInfo = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: this.getDeviceType(),
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      touchSupport: 'ontouchstart' in window,
      connectionType: this.getConnectionType(),
    };

    store.startSession({
      sessionId: this.currentSessionId,
      startTime: this.sessionStartTime,
      pageViews: [window.location.pathname],
      interactions: [],
      deviceInfo,
      referrer: document.referrer,
    });

    this.pageViews.push(window.location.pathname);
  }

  private setupEventListeners() {
    // Track page navigation
    this.trackPageNavigation();
    
    // Track user interactions
    this.trackClicks();
    this.trackScrolling();
    this.trackFormInteractions();
    this.trackHovers();
    
    // Track session end
    this.trackSessionEnd();
  }

  private trackPageNavigation() {
    let currentPath = window.location.pathname;
    
    const trackNavigation = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.pageViews.push(currentPath);
        
        // Track as navigation interaction
        this.recordInteraction({
          type: 'click',
          timestamp: Date.now(),
          element: 'navigation',
          page: currentPath,
          metadata: { navigationType: 'spa' },
        });
      }
    };

    window.addEventListener('popstate', trackNavigation);
    
    // Override navigation methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      trackNavigation();
    };
    
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      trackNavigation();
    };
  }

  private trackClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const elementInfo = this.getElementInfo(target);
      
      this.recordInteraction({
        type: 'click',
        timestamp: Date.now(),
        element: elementInfo,
        page: window.location.pathname,
        metadata: {
          x: event.clientX,
          y: event.clientY,
          tagName: target.tagName,
          className: target.className,
          id: target.id,
        },
      });
      
      // Track feature usage for specific elements
      this.trackFeatureUsageFromElement(target);
    });
  }

  private trackScrolling() {
    let lastScrollTime = 0;
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 1000) { // Throttle to once per second
        const scrollDepth = Math.round(
          ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
        );
        
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          
          this.recordInteraction({
            type: 'scroll',
            timestamp: now,
            element: 'page',
            page: window.location.pathname,
            metadata: { scrollDepth, maxScrollDepth },
          });
        }
        
        lastScrollTime = now;
      }
    }, { passive: true });
  }

  private trackFormInteractions() {
    // Track form field focus
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select')) {
        this.recordInteraction({
          type: 'focus',
          timestamp: Date.now(),
          element: this.getElementInfo(target),
          page: window.location.pathname,
          metadata: { fieldType: target.tagName.toLowerCase() },
        });
      }
    });

    // Track form inputs
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea')) {
        this.recordInteraction({
          type: 'input',
          timestamp: Date.now(),
          element: this.getElementInfo(target),
          page: window.location.pathname,
          metadata: { inputLength: (target as HTMLInputElement).value.length },
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.recordInteraction({
        type: 'submit',
        timestamp: Date.now(),
        element: this.getElementInfo(form),
        page: window.location.pathname,
        metadata: { formId: form.id, action: form.action },
      });
    });
  }

  private trackHovers() {
    let hoverStartTime = 0;
    
    document.addEventListener('mouseenter', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        hoverStartTime = Date.now();
      }
    }, true);

    document.addEventListener('mouseleave', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('button, a, [role="button"]') && hoverStartTime > 0) {
        const duration = Date.now() - hoverStartTime;
        
        this.recordInteraction({
          type: 'hover',
          timestamp: Date.now(),
          element: this.getElementInfo(target),
          page: window.location.pathname,
          duration,
          metadata: { hoverDuration: duration },
        });
        
        hoverStartTime = 0;
      }
    }, true);
  }

  private trackSessionEnd() {
    const endSession = () => {
      const store = useUXMetricsStore.getState();
      store.endSession(this.currentSessionId);
    };

    window.addEventListener('beforeunload', endSession);
    window.addEventListener('pagehide', endSession);
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    });
  }

  private scheduleInsightGeneration() {
    // Generate insights every 5 minutes
    setInterval(() => {
      if (this.isTracking && document.visibilityState === 'visible') {
        const store = useUXMetricsStore.getState();
        store.generateInsights();
      }
    }, 5 * 60 * 1000);
  }

  private recordInteraction(interaction: UserInteraction) {
    const store = useUXMetricsStore.getState();
    store.trackInteraction(interaction);
    this.interactions.push(interaction);
  }

  private trackFeatureUsageFromElement(element: HTMLElement) {
    // Map element attributes to feature IDs
    const featureMap: Record<string, string> = {
      'dashboard-nav': 'dashboard_navigation',
      'api-key-button': 'api_key_management',
      'usage-chart': 'usage_analytics',
      'settings-panel': 'user_settings',
      'search-input': 'global_search',
      'theme-toggle': 'theme_switching',
      'language-switch': 'language_switching',
    };

    const featureId = element.getAttribute('data-feature-id') ||
      element.className.split(' ').find(cls => featureMap[cls]) ||
      element.id;

    if (featureId && featureMap[featureId]) {
      const store = useUXMetricsStore.getState();
      store.trackFeatureUsage(featureMap[featureId]);
    }
  }

  private getElementInfo(element: HTMLElement): string {
    const parts = [];
    
    if (element.tagName) parts.push(element.tagName.toLowerCase());
    if (element.id) parts.push(`#${element.id}`);
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.length > 0).slice(0, 3);
      if (classes.length > 0) parts.push(`.${classes.join('.')}`);
    }
    
    return parts.join('') || 'unknown';
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    }
    if (/ipad|android(?!.*mobile)|tablet/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  // Public methods
  public trackFeatureUsage(featureId: string, userId?: string) {
    const store = useUXMetricsStore.getState();
    store.trackFeatureUsage(featureId, userId);
  }

  public recordSatisfactionScore(type: UserSatisfactionMetric['type'], score: number, maxScore: number, feedback?: string, context = 'general') {
    const store = useUXMetricsStore.getState();
    store.recordSatisfaction({
      id: `satisfaction_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      score,
      maxScore,
      sessionId: this.currentSessionId,
      feedback,
      timestamp: Date.now(),
      context,
    });
  }

  public getUXReport(timeframeDays = 7) {
    const store = useUXMetricsStore.getState();
    
    return {
      engagementRate: store.getEngagementRate(timeframeDays),
      retentionRate: store.getUserRetentionRate(timeframeDays),
      satisfactionScore: store.getAverageSatisfactionScore(),
      topDropOffPoints: store.getTopDropOffPoints(),
      insights: store.insights.slice(-10),
      featureAdoption: Object.keys(store.featureUsage).map(featureId => ({
        featureId,
        adoptionRate: store.getFeatureAdoptionRate(featureId),
        usageCount: store.featureUsage[featureId].usageCount,
      })),
    };
  }

  public exportUXData() {
    const store = useUXMetricsStore.getState();
    const data = {
      sessions: store.sessions,
      interactions: store.interactions,
      featureUsage: store.featureUsage,
      satisfactionMetrics: store.satisfactionMetrics,
      insights: store.insights,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ux-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize and export singleton
export const uxMetricsTracker = UXMetricsTracker.getInstance();

// React hook for UX metrics
export function useUXMetrics() {
  const store = useUXMetricsStore();
  
  return {
    ...store,
    trackFeature: uxMetricsTracker.trackFeatureUsage.bind(uxMetricsTracker),
    recordSatisfaction: uxMetricsTracker.recordSatisfactionScore.bind(uxMetricsTracker),
    getReport: uxMetricsTracker.getUXReport.bind(uxMetricsTracker),
    exportData: uxMetricsTracker.exportUXData.bind(uxMetricsTracker),
  };
}

export default UXMetricsTracker; 