import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Business metrics interfaces
export interface ConversionEvent {
  id: string;
  type: 'signup' | 'login' | 'purchase' | 'subscription' | 'trial' | 'demo_request' | 'contact_form' | 'api_key_created';
  userId?: string;
  sessionId: string;
  timestamp: number;
  value?: number; // Monetary value
  source: string; // Traffic source
  campaign?: string;
  metadata?: Record<string, any>;
}

export interface UserEngagementMetrics {
  userId?: string;
  sessionId: string;
  timestamp: number;
  pageViews: number;
  timeOnSite: number; // in milliseconds
  bounceRate: boolean; // Single page session
  scrollDepth: number; // Percentage
  clickEvents: number;
  formInteractions: number;
  featureUsage: Record<string, number>;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  traffic: number; // Percentage of users to show this variant
  isControl: boolean;
  config: Record<string, any>;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  objective: string;
  variants: ABTestVariant[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  targetAudience?: {
    devices?: string[];
    locations?: string[];
    userSegments?: string[];
  };
  successMetrics: string[];
}

export interface ABTestAssignment {
  userId?: string;
  sessionId: string;
  testId: string;
  variantId: string;
  timestamp: number;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  conversions: number;
  visitors: number;
  conversionRate: number;
  confidence: number;
  isStatisticallySignificant: boolean;
}

export interface BusinessMetrics {
  date: string;
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgTimeOnSite: number;
  bounceRate: number;
  conversionRate: number;
  totalConversions: number;
  revenue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  retentionRate: number;
  churnRate: number;
}

export interface UserSatisfactionSurvey {
  id: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  type: 'nps' | 'csat' | 'ces' | 'custom';
  questions: {
    question: string;
    answer: string | number;
    scale?: { min: number; max: number };
  }[];
  overallScore: number;
  feedback?: string;
}

interface BusinessIntelligenceStore {
  conversions: ConversionEvent[];
  engagementMetrics: UserEngagementMetrics[];
  abTests: ABTest[];
  abTestAssignments: ABTestAssignment[];
  surveys: UserSatisfactionSurvey[];
  isTracking: boolean;
  
  // Actions
  trackConversion: (event: ConversionEvent) => void;
  trackEngagement: (metrics: UserEngagementMetrics) => void;
  createABTest: (test: ABTest) => void;
  updateABTest: (testId: string, updates: Partial<ABTest>) => void;
  assignUserToTest: (assignment: ABTestAssignment) => void;
  submitSurvey: (survey: UserSatisfactionSurvey) => void;
  setTracking: (enabled: boolean) => void;
  
  // Analytics
  getConversionRate: (timeframe: number) => number;
  getEngagementMetrics: (timeframe: number) => Partial<UserEngagementMetrics>;
  getABTestResults: (testId: string) => ABTestResult[];
  getBusinessMetrics: (timeframe: number) => BusinessMetrics;
  getSatisfactionScore: (type: string, timeframe: number) => number;
  
  // Cleanup
  clearData: () => void;
}

export const useBusinessIntelligenceStore = create<BusinessIntelligenceStore>()(
  persist(
    (set, get) => ({
      conversions: [],
      engagementMetrics: [],
      abTests: [],
      abTestAssignments: [],
      surveys: [],
      isTracking: true,

      trackConversion: (event) =>
        set((state) => ({
          conversions: [...state.conversions.slice(-999), event], // Keep last 1000 conversions
        })),

      trackEngagement: (metrics) =>
        set((state) => ({
          engagementMetrics: [...state.engagementMetrics.slice(-999), metrics], // Keep last 1000 metrics
        })),

      createABTest: (test) =>
        set((state) => ({
          abTests: [...state.abTests, test],
        })),

      updateABTest: (testId, updates) =>
        set((state) => ({
          abTests: state.abTests.map((test) =>
            test.id === testId ? { ...test, ...updates } : test
          ),
        })),

      assignUserToTest: (assignment) =>
        set((state) => ({
          abTestAssignments: [...state.abTestAssignments.slice(-999), assignment],
        })),

      submitSurvey: (survey) =>
        set((state) => ({
          surveys: [...state.surveys.slice(-999), survey],
        })),

      setTracking: (enabled) => set({ isTracking: enabled }),

      getConversionRate: (timeframe) => {
        const { conversions, engagementMetrics } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        
        const recentConversions = conversions.filter((c) => c.timestamp > cutoff);
        const recentSessions = new Set(
          engagementMetrics.filter((m) => m.timestamp > cutoff).map((m) => m.sessionId)
        ).size;
        
        return recentSessions > 0 ? (recentConversions.length / recentSessions) * 100 : 0;
      },

      getEngagementMetrics: (timeframe) => {
        const { engagementMetrics } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        const recentMetrics = engagementMetrics.filter((m) => m.timestamp > cutoff);
        
        if (recentMetrics.length === 0) return {};
        
        const totals = recentMetrics.reduce(
          (acc, metric) => ({
            pageViews: acc.pageViews + metric.pageViews,
            timeOnSite: acc.timeOnSite + metric.timeOnSite,
            scrollDepth: acc.scrollDepth + metric.scrollDepth,
            clickEvents: acc.clickEvents + metric.clickEvents,
            formInteractions: acc.formInteractions + metric.formInteractions,
          }),
          { pageViews: 0, timeOnSite: 0, scrollDepth: 0, clickEvents: 0, formInteractions: 0 }
        );
        
        const count = recentMetrics.length;
        return {
          pageViews: Math.round(totals.pageViews / count),
          timeOnSite: Math.round(totals.timeOnSite / count),
          scrollDepth: Math.round(totals.scrollDepth / count),
          clickEvents: Math.round(totals.clickEvents / count),
          formInteractions: Math.round(totals.formInteractions / count),
        };
      },

      getABTestResults: (testId) => {
        const { abTestAssignments, conversions } = get();
        const test = get().abTests.find((t) => t.id === testId);
        
        if (!test) return [];
        
        return test.variants.map((variant) => {
          const variantAssignments = abTestAssignments.filter(
            (a) => a.testId === testId && a.variantId === variant.id
          );
          
          const variantConversions = conversions.filter((c) =>
            variantAssignments.some((a) => a.sessionId === c.sessionId)
          );
          
          const visitors = variantAssignments.length;
          const conversionCount = variantConversions.length;
          const conversionRate = visitors > 0 ? (conversionCount / visitors) * 100 : 0;
          
          // Simple statistical significance calculation (z-test)
          const confidence = visitors > 30 ? calculateConfidence(conversionCount, visitors) : 0;
          
          return {
            testId,
            variantId: variant.id,
            conversions: conversionCount,
            visitors,
            conversionRate,
            confidence,
            isStatisticallySignificant: confidence > 95,
          };
        });
      },

      getBusinessMetrics: (timeframe) => {
        const { conversions, engagementMetrics } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        
        const recentConversions = conversions.filter((c) => c.timestamp > cutoff);
        const recentMetrics = engagementMetrics.filter((m) => m.timestamp > cutoff);
        
        const uniqueSessions = new Set(recentMetrics.map((m) => m.sessionId)).size;
        const totalPageViews = recentMetrics.reduce((sum, m) => sum + m.pageViews, 0);
        const totalTimeOnSite = recentMetrics.reduce((sum, m) => sum + m.timeOnSite, 0);
        const bounces = recentMetrics.filter((m) => m.bounceRate).length;
        const revenue = recentConversions.reduce((sum, c) => sum + (c.value || 0), 0);
        
        return {
          date: new Date().toISOString().split('T')[0],
          totalVisitors: uniqueSessions,
          uniqueVisitors: uniqueSessions, // Simplified
          pageViews: totalPageViews,
          avgTimeOnSite: uniqueSessions > 0 ? totalTimeOnSite / uniqueSessions : 0,
          bounceRate: uniqueSessions > 0 ? (bounces / uniqueSessions) * 100 : 0,
          conversionRate: get().getConversionRate(timeframe),
          totalConversions: recentConversions.length,
          revenue,
          customerAcquisitionCost: revenue > 0 ? 100 : 0, // Simplified
          customerLifetimeValue: revenue > 0 ? revenue * 3 : 0, // Simplified
          retentionRate: 85, // Placeholder
          churnRate: 15, // Placeholder
        };
      },

      getSatisfactionScore: (type, timeframe) => {
        const { surveys } = get();
        const cutoff = Date.now() - timeframe * 24 * 60 * 60 * 1000;
        
        const recentSurveys = surveys.filter(
          (s) => s.timestamp > cutoff && (type === 'all' || s.type === type)
        );
        
        if (recentSurveys.length === 0) return 0;
        
        const totalScore = recentSurveys.reduce((sum, s) => sum + s.overallScore, 0);
        return totalScore / recentSurveys.length;
      },

      clearData: () =>
        set({
          conversions: [],
          engagementMetrics: [],
          abTestAssignments: [],
          surveys: [],
        }),
    }),
    {
      name: 'business-intelligence-store',
      version: 1,
    }
  )
);

// Helper function for statistical significance calculation
function calculateConfidence(conversions: number, visitors: number): number {
  if (visitors < 30) return 0;
  
  const conversionRate = conversions / visitors;
  const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / visitors);
  const zScore = Math.abs(conversionRate - 0.05) / standardError; // Compare against 5% baseline
  
  // Convert z-score to confidence percentage (simplified)
  return Math.min(99.9, zScore * 20);
}

class BusinessIntelligence {
  private static instance: BusinessIntelligence;
  private sessionId: string;
  private sessionStartTime: number;
  private pageViewCount = 0;
  private clickCount = 0;
  private formInteractionCount = 0;
  private maxScrollDepth = 0;
  private isTracking = false;

  static getInstance(): BusinessIntelligence {
    if (!BusinessIntelligence.instance) {
      BusinessIntelligence.instance = new BusinessIntelligence();
    }
    return BusinessIntelligence.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    const store = useBusinessIntelligenceStore.getState();
    if (!store.isTracking) return;

    this.isTracking = true;

    // Track page views
    this.trackPageView();

    // Track scroll depth
    this.trackScrollDepth();

    // Track clicks
    this.trackClicks();

    // Track form interactions
    this.trackFormInteractions();

    // Track session end
    this.trackSessionEnd();

    // Send engagement metrics periodically
    this.scheduleEngagementTracking();
  }

  private trackPageView() {
    this.pageViewCount++;
    
    // Track route changes for SPA
    let currentPath = window.location.pathname;
    
    const trackRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.pageViewCount++;
      }
    };

    window.addEventListener('popstate', trackRouteChange);
    
    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      trackRouteChange();
    };
    
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      trackRouteChange();
    };
  }

  private trackScrollDepth() {
    const updateScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
      this.maxScrollDepth = Math.max(this.maxScrollDepth, Math.min(100, scrollDepth));
    };

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    updateScrollDepth(); // Initial calculation
  }

  private trackClicks() {
    document.addEventListener('click', (event) => {
      this.clickCount++;
      
      // Track specific elements
      const target = event.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id;
      const elementClass = target.className;
      
      // Track CTA clicks specifically
      if (target.matches('.cta-button, .signup-button, .demo-button, .contact-button')) {
        this.trackConversion({
          id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          type: this.getConversionTypeFromElement(target),
          sessionId: this.sessionId,
          timestamp: Date.now(),
          source: document.referrer || 'direct',
          metadata: { elementType, elementId, elementClass },
        });
      }
    });
  }

  private trackFormInteractions() {
    // Track form focus events
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select')) {
        this.formInteractionCount++;
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formType = form.getAttribute('data-form-type') || 'generic';
      
      this.trackConversion({
        id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: this.getConversionTypeFromForm(formType),
        sessionId: this.sessionId,
        timestamp: Date.now(),
        source: document.referrer || 'direct',
        metadata: { formType, formId: form.id },
      });
    });
  }

  private trackSessionEnd() {
    const sendEngagementData = () => {
      this.sendEngagementMetrics();
    };

    // Track when user leaves the page
    window.addEventListener('beforeunload', sendEngagementData);
    window.addEventListener('pagehide', sendEngagementData);
    
    // Track when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendEngagementData();
      }
    });
  }

  private scheduleEngagementTracking() {
    // Send engagement data every 30 seconds for active sessions
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.sendEngagementMetrics();
      }
    }, 30000);
  }

  private sendEngagementMetrics() {
    const store = useBusinessIntelligenceStore.getState();
    
    const metrics: UserEngagementMetrics = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      pageViews: this.pageViewCount,
      timeOnSite: Date.now() - this.sessionStartTime,
      bounceRate: this.pageViewCount === 1 && this.clickCount < 2,
      scrollDepth: this.maxScrollDepth,
      clickEvents: this.clickCount,
      formInteractions: this.formInteractionCount,
      featureUsage: this.getFeatureUsage(),
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent,
    };

    store.trackEngagement(metrics);
  }

  private getFeatureUsage(): Record<string, number> {
    // Track specific feature usage based on URL patterns or element interactions
    const features: Record<string, number> = {};
    
    if (window.location.pathname.includes('/dashboard')) features.dashboard = 1;
    if (window.location.pathname.includes('/api-keys')) features.apiKeys = 1;
    if (window.location.pathname.includes('/usage')) features.usage = 1;
    if (window.location.pathname.includes('/settings')) features.settings = 1;
    
    return features;
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

  private getConversionTypeFromElement(element: HTMLElement): ConversionEvent['type'] {
    const className = element.className.toLowerCase();
    if (className.includes('signup')) return 'signup';
    if (className.includes('demo')) return 'demo_request';
    if (className.includes('contact')) return 'contact_form';
    return 'signup'; // Default
  }

  private getConversionTypeFromForm(formType: string): ConversionEvent['type'] {
    switch (formType) {
      case 'signup': return 'signup';
      case 'login': return 'login';
      case 'contact': return 'contact_form';
      case 'demo': return 'demo_request';
      default: return 'contact_form';
    }
  }

  // Public methods
  public trackConversion(event: ConversionEvent) {
    const store = useBusinessIntelligenceStore.getState();
    store.trackConversion(event);
  }

  public createABTest(test: ABTest): string {
    const store = useBusinessIntelligenceStore.getState();
    store.createABTest(test);
    return test.id;
  }

  public getActiveABTests(): ABTest[] {
    const store = useBusinessIntelligenceStore.getState();
    return store.abTests.filter((test) => test.isActive);
  }

  public assignToABTest(testId: string, userId?: string): string | null {
    const store = useBusinessIntelligenceStore.getState();
    const test = store.abTests.find((t) => t.id === testId && t.isActive);
    
    if (!test) return null;

    // Check if user is already assigned to this test
    const existingAssignment = store.abTestAssignments.find(
      (a) => a.testId === testId && (userId ? a.userId === userId : a.sessionId === this.sessionId)
    );
    
    if (existingAssignment) return existingAssignment.variantId;

    // Assign to variant based on traffic allocation
    let cumulativeTraffic = 0;
    const random = Math.random() * 100;
    
    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic;
      if (random <= cumulativeTraffic) {
        const assignment: ABTestAssignment = {
          userId,
          sessionId: this.sessionId,
          testId,
          variantId: variant.id,
          timestamp: Date.now(),
        };
        
        store.assignUserToTest(assignment);
        return variant.id;
      }
    }
    
    // Fallback to control variant
    const controlVariant = test.variants.find((v) => v.isControl);
    if (controlVariant) {
      const assignment: ABTestAssignment = {
        userId,
        sessionId: this.sessionId,
        testId,
        variantId: controlVariant.id,
        timestamp: Date.now(),
      };
      
      store.assignUserToTest(assignment);
      return controlVariant.id;
    }
    
    return null;
  }

  public showSatisfactionSurvey(type: UserSatisfactionSurvey['type'] = 'nps') {
    // This would typically show a modal or inline survey
    // For now, we'll just create a placeholder survey
    const survey: UserSatisfactionSurvey = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      type,
      questions: [
        {
          question: 'How likely are you to recommend our service to a friend?',
          answer: 8,
          scale: { min: 0, max: 10 },
        },
      ],
      overallScore: 8,
      feedback: 'Great service overall!',
    };

    const store = useBusinessIntelligenceStore.getState();
    store.submitSurvey(survey);
  }

  public getBusinessReport(timeframeDays = 30) {
    const store = useBusinessIntelligenceStore.getState();
    return {
      businessMetrics: store.getBusinessMetrics(timeframeDays),
      conversionRate: store.getConversionRate(timeframeDays),
      engagementMetrics: store.getEngagementMetrics(timeframeDays),
      satisfactionScore: store.getSatisfactionScore('all', timeframeDays),
      abTestResults: store.abTests
        .filter((test) => test.isActive)
        .map((test) => ({
          test,
          results: store.getABTestResults(test.id),
        })),
    };
  }

  public exportBusinessData() {
    const store = useBusinessIntelligenceStore.getState();
    const data = {
      conversions: store.conversions,
      engagementMetrics: store.engagementMetrics,
      abTests: store.abTests,
      abTestAssignments: store.abTestAssignments,
      surveys: store.surveys,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize and export singleton
export const businessIntelligence = BusinessIntelligence.getInstance();

// React hook for business intelligence
export function useBusinessIntelligence() {
  const store = useBusinessIntelligenceStore();
  
  return {
    ...store,
    trackConversion: businessIntelligence.trackConversion.bind(businessIntelligence),
    createABTest: businessIntelligence.createABTest.bind(businessIntelligence),
    assignToABTest: businessIntelligence.assignToABTest.bind(businessIntelligence),
    getActiveABTests: businessIntelligence.getActiveABTests.bind(businessIntelligence),
    showSatisfactionSurvey: businessIntelligence.showSatisfactionSurvey.bind(businessIntelligence),
    getBusinessReport: businessIntelligence.getBusinessReport.bind(businessIntelligence),
    exportData: businessIntelligence.exportBusinessData.bind(businessIntelligence),
  };
}

export default BusinessIntelligence; 