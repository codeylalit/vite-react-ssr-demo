import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Performance metrics interfaces
export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

export interface PerformanceMetrics {
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType: string;
  coreWebVitals: Partial<CoreWebVitals>;
  bundleSize?: number;
  loadTime: number;
  domContentLoaded: number;
  resourceTiming: PerformanceResourceTiming[];
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
  tti: { good: number; needsImprovement: number };
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: keyof CoreWebVitals;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  url: string;
}

interface PerformanceStore {
  metrics: PerformanceMetrics[];
  alerts: PerformanceAlert[];
  isTracking: boolean;
  thresholds: PerformanceThresholds;
  addMetric: (metric: PerformanceMetrics) => void;
  addAlert: (alert: PerformanceAlert) => void;
  clearMetrics: () => void;
  clearAlerts: () => void;
  setTracking: (enabled: boolean) => void;
  updateThresholds: (thresholds: Partial<PerformanceThresholds>) => void;
  getAverageMetrics: () => Partial<CoreWebVitals>;
  getMetricsTrend: (metric: keyof CoreWebVitals, days: number) => number[];
  getPerformanceScore: () => number;
}

// Performance thresholds based on Google's recommendations
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
  tti: { good: 3800, needsImprovement: 7300 },
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      metrics: [],
      alerts: [],
      isTracking: true,
      thresholds: DEFAULT_THRESHOLDS,

      addMetric: (metric) =>
        set((state) => ({
          metrics: [...state.metrics.slice(-99), metric], // Keep last 100 metrics
        })),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [...state.alerts.slice(-49), alert], // Keep last 50 alerts
        })),

      clearMetrics: () => set({ metrics: [] }),
      clearAlerts: () => set({ alerts: [] }),
      setTracking: (enabled) => set({ isTracking: enabled }),

      updateThresholds: (newThresholds) =>
        set((state) => ({
          thresholds: { ...state.thresholds, ...newThresholds },
        })),

      getAverageMetrics: () => {
        const { metrics } = get();
        if (metrics.length === 0) return {};

        const totals = metrics.reduce(
          (acc, metric) => {
            Object.keys(metric.coreWebVitals).forEach((key) => {
              const value = metric.coreWebVitals[key as keyof CoreWebVitals];
              if (value !== undefined) {
                acc[key as keyof CoreWebVitals] = (acc[key as keyof CoreWebVitals] || 0) + value;
              }
            });
            return acc;
          },
          {} as Partial<CoreWebVitals>
        );

        const averages: Partial<CoreWebVitals> = {};
        Object.keys(totals).forEach((key) => {
          averages[key as keyof CoreWebVitals] = totals[key as keyof CoreWebVitals]! / metrics.length;
        });

        return averages;
      },

      getMetricsTrend: (metric, days) => {
        const { metrics } = get();
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        
        return metrics
          .filter((m) => m.timestamp > cutoff)
          .map((m) => m.coreWebVitals[metric] || 0)
          .slice(-30); // Last 30 data points
      },

      getPerformanceScore: () => {
        const averages = get().getAverageMetrics();
        const { thresholds } = get();
        
        let score = 0;
        let count = 0;

        Object.keys(averages).forEach((key) => {
          const metric = key as keyof CoreWebVitals;
          const value = averages[metric];
          const threshold = thresholds[metric];
          
          if (value !== undefined && threshold) {
            count++;
            if (value <= threshold.good) {
              score += 100;
            } else if (value <= threshold.needsImprovement) {
              score += 50;
            } else {
              score += 0;
            }
          }
        });

        return count > 0 ? Math.round(score / count) : 0;
      },
    }),
    {
      name: 'performance-tracker-store',
      version: 1,
    }
  )
);

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private observer: PerformanceObserver | null = null;
  private isTracking = false;
  private startTime = performance.now();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Initialize performance tracking on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startTracking();
      });
    } else {
      this.startTracking();
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resumeTracking();
      } else {
        this.pauseTracking();
      }
    });

    // Track route changes for SPA
    this.setupRouteChangeTracking();
  }

  startTracking() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    const store = usePerformanceStore.getState();
    
    if (!store.isTracking) return;

    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track resource loading
    this.trackResourceTiming();
    
    // Track memory usage
    this.trackMemoryUsage();
    
    // Track network information
    this.trackNetworkInfo();

    // Schedule regular performance snapshots
    this.schedulePerformanceSnapshots();
  }

  pauseTracking() {
    this.isTracking = false;
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  resumeTracking() {
    if (!this.isTracking) {
      this.startTracking();
    }
  }

  private trackCoreWebVitals() {
    if (!window.PerformanceObserver) return;

    // Track LCP (Largest Contentful Paint)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1];
      this.recordMetric('lcp', lcp.startTime);
    });

    // Track FID (First Input Delay)
    this.observeMetric('first-input', (entries) => {
      const fid = entries[0];
      this.recordMetric('fid', fid.processingStart - fid.startTime);
    });

    // Track CLS (Cumulative Layout Shift)
    this.observeMetric('layout-shift', (entries) => {
      let cls = 0;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.recordMetric('cls', cls);
    });

    // Track FCP (First Contentful Paint)
    this.observeMetric('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('fcp', entry.startTime);
        }
      });
    });

    // Track Navigation Timing for TTFB and TTI
    this.trackNavigationTiming();
  }

  private observeMetric(type: string, callback: (entries: any[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (e) {
      // Metric not supported
    }
  }

  private trackNavigationTiming() {
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        
        // TTFB (Time to First Byte)
        const ttfb = nav.responseStart - nav.requestStart;
        this.recordMetric('ttfb', ttfb);

        // TTI approximation (when main thread becomes idle)
        const tti = nav.domInteractive - nav.fetchStart;
        this.recordMetric('tti', tti);
      }
    }
  }

  private trackResourceTiming() {
    if (!performance.getEntriesByType) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const store = usePerformanceStore.getState();
    
    // Calculate total bundle size
    let bundleSize = 0;
    resources.forEach((resource) => {
      if (resource.name.includes('.js') || resource.name.includes('.css')) {
        bundleSize += resource.transferSize || 0;
      }
    });

    // Store resource timing data
    const currentMetrics = this.getCurrentMetrics();
    if (currentMetrics) {
      currentMetrics.bundleSize = bundleSize;
      currentMetrics.resourceTiming = resources.slice(-20); // Keep last 20 resources
      store.addMetric(currentMetrics);
    }
  }

  private trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return undefined;
  }

  private trackNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return undefined;
  }

  private recordMetric(metric: keyof CoreWebVitals, value: number) {
    const store = usePerformanceStore.getState();
    const threshold = store.thresholds[metric];
    
    // Check if metric exceeds thresholds
    if (threshold && value > threshold.needsImprovement) {
      const alert: PerformanceAlert = {
        id: `${metric}-${Date.now()}`,
        type: value > threshold.needsImprovement * 1.5 ? 'error' : 'warning',
        metric,
        value,
        threshold: threshold.needsImprovement,
        message: `${metric.toUpperCase()} is ${value.toFixed(2)}ms, exceeding threshold of ${threshold.needsImprovement}ms`,
        timestamp: Date.now(),
        url: window.location.href,
      };
      store.addAlert(alert);
    }

    // Store the metric
    this.updateCurrentMetrics(metric, value);
  }

  private currentMetrics: PerformanceMetrics | null = null;

  private getCurrentMetrics(): PerformanceMetrics | null {
    if (!this.currentMetrics) {
      this.currentMetrics = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType(),
        coreWebVitals: {},
        loadTime: performance.now() - this.startTime,
        domContentLoaded: this.getDOMContentLoadedTime(),
        resourceTiming: [],
        memoryUsage: this.trackMemoryUsage(),
        networkInfo: this.trackNetworkInfo(),
      };
    }
    return this.currentMetrics;
  }

  private updateCurrentMetrics(metric: keyof CoreWebVitals, value: number) {
    const metrics = this.getCurrentMetrics();
    if (metrics) {
      metrics.coreWebVitals[metric] = value;
    }
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getDOMContentLoadedTime(): number {
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
             if (navigationEntries.length > 0) {
         return navigationEntries[0].domContentLoadedEventEnd - navigationEntries[0].fetchStart;
       }
    }
    return 0;
  }

  private schedulePerformanceSnapshots() {
    // Take performance snapshots every 30 seconds
    setInterval(() => {
      if (this.isTracking && document.visibilityState === 'visible') {
        this.takePerformanceSnapshot();
      }
    }, 30000);
  }

  private takePerformanceSnapshot() {
    const metrics = this.getCurrentMetrics();
    if (metrics) {
      const store = usePerformanceStore.getState();
      store.addMetric({ ...metrics });
      
      // Reset current metrics for next snapshot
      this.currentMetrics = null;
    }
  }

  private setupRouteChangeTracking() {
    // Track route changes in SPA
    let currentPath = window.location.pathname;
    
    const trackRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.startTime = performance.now();
        this.currentMetrics = null; // Reset metrics for new route
        
        // Start tracking for new route
        setTimeout(() => {
          this.takePerformanceSnapshot();
        }, 1000); // Wait 1 second for route to stabilize
      }
    };

    // Listen for browser navigation
    window.addEventListener('popstate', trackRouteChange);
    
    // Override pushState and replaceState for SPA navigation
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

  // Public methods for external access
  public getPerformanceReport() {
    const store = usePerformanceStore.getState();
    return {
      averageMetrics: store.getAverageMetrics(),
      performanceScore: store.getPerformanceScore(),
      recentAlerts: store.alerts.slice(-10),
      metrics: store.metrics.slice(-10),
    };
  }

  public exportPerformanceData() {
    const store = usePerformanceStore.getState();
    const data = {
      metrics: store.metrics,
      alerts: store.alerts,
      thresholds: store.thresholds,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  public clearAllData() {
    const store = usePerformanceStore.getState();
    store.clearMetrics();
    store.clearAlerts();
  }
}

// Initialize and export singleton
export const performanceTracker = PerformanceTracker.getInstance();

// React hook for performance data
export function usePerformanceTracking() {
  const store = usePerformanceStore();
  
  return {
    ...store,
    report: performanceTracker.getPerformanceReport(),
    exportData: performanceTracker.exportPerformanceData,
    clearData: performanceTracker.clearAllData,
  };
}

export default PerformanceTracker; 