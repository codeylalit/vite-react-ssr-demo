import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceAudit } from '../services/monitoring/PerformanceAudit';
import type { PerformanceAuditResult, CoreWebVitalsMetrics } from '../services/monitoring/PerformanceAudit';

// Performance monitoring hook interfaces
interface PerformanceMonitoringOptions {
  enableCoreWebVitals?: boolean;
  enableLighthouse?: boolean;
  enableBundleAnalysis?: boolean;
  reportingInterval?: number; // in milliseconds
  thresholds?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    tti?: number;
  };
  onMetricUpdate?: (metric: string, value: number) => void;
  onThresholdExceeded?: (metric: string, value: number, threshold: number) => void;
}

interface PerformanceState {
  isLoading: boolean;
  metrics: CoreWebVitalsMetrics | null;
  lastAudit: PerformanceAuditResult | null;
  alerts: PerformanceAlert[];
  history: PerformanceHistoryEntry[];
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface PerformanceHistoryEntry {
  timestamp: Date;
  metrics: CoreWebVitalsMetrics;
  url: string;
  userAgent: string;
}

interface PerformanceActions {
  runAudit: () => Promise<void>;
  clearAlerts: () => void;
  acknowledgeAlert: (alertId: string) => void;
  exportData: () => string;
  resetHistory: () => void;
}

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
  
  // Custom metrics
  domContentLoaded: number | null;
  loadComplete: number | null;
  bundleSize: number | null;
  
  // Performance score
  performanceScore: number | null;
}

interface PerformanceThresholds {
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  fcp: { good: number; poor: number };
  ttfb: { good: number; poor: number };
  tti: { good: number; poor: number };
}

const defaultOptions: Required<PerformanceMonitoringOptions> = {
  enableCoreWebVitals: true,
  enableLighthouse: false, // Expensive operation, disabled by default
  enableBundleAnalysis: false,
  reportingInterval: 30000, // 30 seconds
  thresholds: {
    lcp: 2500, // 2.5s good, 4s needs improvement
    fid: 100, // 100ms good, 300ms needs improvement
    cls: 0.1, // 0.1 good, 0.25 needs improvement
    fcp: 1800, // 1.8s good, 3s needs improvement
    ttfb: 800, // 800ms good, 1.8s needs improvement
    tti: 3800, // 3.8s good, 7.3s needs improvement
  },
  onMetricUpdate: () => {},
  onThresholdExceeded: () => {},
};

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, poor: 4000 },  // LCP should be ≤ 2.5s
  fid: { good: 100, poor: 300 },    // FID should be ≤ 100ms
  cls: { good: 0.1, poor: 0.25 },   // CLS should be ≤ 0.1
  fcp: { good: 1800, poor: 3000 },  // FCP should be ≤ 1.8s
  ttfb: { good: 800, poor: 1800 },  // TTFB should be ≤ 800ms
  tti: { good: 3800, poor: 7300 },  // TTI should be ≤ 3.8s
};

export function usePerformanceMonitoring(
  options: PerformanceMonitoringOptions = {}
): [PerformanceState, PerformanceActions] {
  const config = { ...defaultOptions, ...options };
  const [state, setState] = useState<PerformanceState>({
    isLoading: false,
    metrics: null,
    lastAudit: null,
    alerts: [],
    history: [],
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const alertIdCounter = useRef(0);

  // Generate unique alert ID
  const generateAlertId = useCallback(() => {
    return `alert_${Date.now()}_${++alertIdCounter.current}`;
  }, []);

  // Add performance alert
  const addAlert = useCallback((
    type: PerformanceAlert['type'],
    metric: string,
    value: number,
    threshold: number,
    message: string
  ) => {
    const alert: PerformanceAlert = {
      id: generateAlertId(),
      type,
      metric,
      value,
      threshold,
      message,
      timestamp: new Date(),
      acknowledged: false,
    };

    setState(prev => ({
      ...prev,
      alerts: [...prev.alerts, alert],
    }));

    // Trigger callback
    config.onThresholdExceeded(metric, value, threshold);
  }, [config, generateAlertId]);

  // Check thresholds and generate alerts
  const checkThresholds = useCallback((metrics: CoreWebVitalsMetrics) => {
    Object.entries(config.thresholds).forEach(([metric, threshold]) => {
      const value = metrics[metric as keyof CoreWebVitalsMetrics];
      if (value && value > threshold) {
        const message = `${metric.toUpperCase()} (${value.toFixed(2)}) exceeds threshold (${threshold})`;
        addAlert('warning', metric, value, threshold, message);
      }
    });
  }, [config.thresholds, addAlert]);

  // Update metrics and trigger callbacks
  const updateMetrics = useCallback((newMetrics: CoreWebVitalsMetrics) => {
    setState(prev => {
      // Add to history
      const historyEntry: PerformanceHistoryEntry = {
        timestamp: new Date(),
        metrics: newMetrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Keep last 100 entries
      const updatedHistory = [...prev.history, historyEntry].slice(-100);

      return {
        ...prev,
        metrics: newMetrics,
        history: updatedHistory,
      };
    });

    // Check thresholds
    checkThresholds(newMetrics);

    // Trigger metric update callbacks
    Object.entries(newMetrics).forEach(([metric, value]) => {
      if (value) {
        config.onMetricUpdate(metric, value);
      }
    });
  }, [checkThresholds, config]);

  // Collect Core Web Vitals using PerformanceObserver
  const collectCoreWebVitals = useCallback(() => {
    if (!config.enableCoreWebVitals || !('PerformanceObserver' in window)) {
      return;
    }

    const metrics: Partial<CoreWebVitalsMetrics> = {};

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          metrics.lcp = lastEntry.startTime;
          updateMetrics({ ...state.metrics, ...metrics } as CoreWebVitalsMetrics);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            metrics.fid = entry.processingStart - entry.startTime;
            updateMetrics({ ...state.metrics, ...metrics } as CoreWebVitalsMetrics);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID measurement not supported');
    }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.cls = clsValue;
            updateMetrics({ ...state.metrics, ...metrics } as CoreWebVitalsMetrics);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS measurement not supported');
    }

    // FCP and other paint metrics
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
          if (entry.name === 'first-paint') {
            metrics.fp = entry.startTime;
          }
        });
        updateMetrics({ ...state.metrics, ...metrics } as CoreWebVitalsMetrics);
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint metrics not supported');
    }

    // Navigation timing metrics
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        // TTI approximation
        metrics.tti = navigation.domContentLoadedEventEnd - navigation.navigationStart;
        updateMetrics({ ...state.metrics, ...metrics } as CoreWebVitalsMetrics);
      }
    } catch (e) {
      console.warn('Navigation timing not available');
    }

    observerRef.current = null; // Multiple observers, so we don't store reference
  }, [config.enableCoreWebVitals, updateMetrics, state.metrics]);

  // Run full performance audit
  const runAudit = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const auditResult = await performanceAudit.runAudit({
        enableLighthouse: config.enableLighthouse,
        enableCoreWebVitals: config.enableCoreWebVitals,
        enableBundleAnalysis: config.enableBundleAnalysis,
      });

      setState(prev => ({
        ...prev,
        lastAudit: auditResult,
        isLoading: false,
      }));

      // Update metrics if Core Web Vitals were collected
      if (auditResult.coreWebVitals) {
        updateMetrics(auditResult.coreWebVitals);
      }
    } catch (error) {
      console.error('Performance audit failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      addAlert('error', 'audit', 0, 0, 'Performance audit failed');
    }
  }, [config, updateMetrics, addAlert]);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setState(prev => ({ ...prev, alerts: [] }));
  }, []);

  // Acknowledge specific alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  }, []);

  // Export performance data
  const exportData = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currentMetrics: state.metrics,
      lastAudit: state.lastAudit,
      alerts: state.alerts,
      history: state.history,
      config: config,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    return JSON.stringify(exportData, null, 2);
  }, [state, config]);

  // Reset history
  const resetHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  // Initialize monitoring
  useEffect(() => {
    if (config.enableCoreWebVitals) {
      collectCoreWebVitals();
    }

    // Set up periodic monitoring
    if (config.reportingInterval > 0) {
      intervalRef.current = setInterval(() => {
        if (config.enableCoreWebVitals) {
          collectCoreWebVitals();
        }
      }, config.reportingInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [config, collectCoreWebVitals]);

  // Page visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && config.enableCoreWebVitals) {
        // Restart monitoring when page becomes visible
        collectCoreWebVitals();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [config.enableCoreWebVitals, collectCoreWebVitals]);

  const actions: PerformanceActions = {
    runAudit,
    clearAlerts,
    acknowledgeAlert,
    exportData,
    resetHistory,
  };

  return [state, actions];
}

// Utility hook for performance metrics display
export function usePerformanceMetrics() {
  const [{ metrics, alerts }] = usePerformanceMonitoring({
    enableCoreWebVitals: true,
    reportingInterval: 5000, // 5 seconds for display purposes
  });

  const formatMetric = useCallback((value: number | undefined, unit: string = 'ms') => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  }, []);

  const getMetricStatus = useCallback((
    value: number | undefined,
    thresholds: { good: number; needsImprovement: number }
  ): 'good' | 'needs-improvement' | 'poor' | 'unknown' => {
    if (value === undefined) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }, []);

  return {
    metrics,
    alerts: alerts.filter(alert => !alert.acknowledged),
    formatMetric,
    getMetricStatus,
  };
}

export type {
  PerformanceMonitoringOptions,
  PerformanceState,
  PerformanceActions,
  PerformanceAlert,
  PerformanceHistoryEntry,
}; 