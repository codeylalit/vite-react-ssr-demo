import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Performance Audit Types
export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: Array<{
      name: string;
      size: number;
    }>;
  }>;
  duplicates: Array<{
    module: string;
    count: number;
    totalSize: number;
  }>;
}

export interface PerformanceAuditResult {
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connection: string;
  lighthouse: LighthouseMetrics;
  coreWebVitals: CoreWebVitals;
  bundleAnalysis: BundleAnalysis;
  recommendations: PerformanceRecommendation[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface PerformanceRecommendation {
  id: string;
  type: 'critical' | 'important' | 'minor';
  category: 'loading' | 'runtime' | 'bundle' | 'accessibility' | 'seo';
  title: string;
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  implementation: {
    code?: string;
    files?: string[];
    description: string;
  };
}

export interface PerformanceAuditConfig {
  enabled: boolean;
  auditInterval: number;
  auditUrls: string[];
  thresholds: {
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
      pwa: number;
    };
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
      fcp: number;
      ttfb: number;
      tti: number;
    };
    bundle: {
      maxSize: number;
      maxChunks: number;
      maxDuplicates: number;
    };
  };
  alerting: {
    enabled: boolean;
    email?: string;
    webhook?: string;
    slack?: string;
  };
}

// Performance Audit Store Interface
interface PerformanceAuditStore {
  config: PerformanceAuditConfig;
  audits: PerformanceAuditResult[];
  isRunningAudit: boolean;
  lastAuditTime: number;
  
  runAudit: (url?: string) => Promise<PerformanceAuditResult>;
  scheduleAudit: () => void;
  stopScheduledAudit: () => void;
  updateConfig: (config: Partial<PerformanceAuditConfig>) => void;
  clearAudits: () => void;
  exportAudits: () => string;
  getRecommendations: () => PerformanceRecommendation[];
}

// Default configuration
const DEFAULT_CONFIG: PerformanceAuditConfig = {
  enabled: true,
  auditInterval: 24 * 60 * 60 * 1000, // 24 hours
  auditUrls: ['/'],
  thresholds: {
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 90,
      pwa: 80,
    },
    coreWebVitals: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      fcp: 1800,
      ttfb: 600,
      tti: 3800,
    },
    bundle: {
      maxSize: 500 * 1024, // 500KB
      maxChunks: 10,
      maxDuplicates: 5,
    },
  },
  alerting: {
    enabled: true,
  },
};

// Utility functions
function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Mock implementations for demo (in production, these would be real implementations)
async function runLighthouseAudit(url: string): Promise<LighthouseMetrics> {
  // Simulate audit delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data with realistic ranges
  return {
    performance: Math.floor(Math.random() * 20) + 80, // 80-100
    accessibility: Math.floor(Math.random() * 15) + 85, // 85-100
    bestPractices: Math.floor(Math.random() * 10) + 90, // 90-100
    seo: Math.floor(Math.random() * 15) + 85, // 85-100
    pwa: Math.floor(Math.random() * 20) + 70, // 70-90
  };
}

async function analyzeBundleSize(): Promise<BundleAnalysis> {
  return {
    totalSize: Math.floor(Math.random() * 200000) + 300000, // 300KB-500KB
    gzippedSize: Math.floor(Math.random() * 100000) + 100000, // 100KB-200KB
    chunks: [
      {
        name: 'main',
        size: Math.floor(Math.random() * 100000) + 200000,
        modules: [
          { name: 'react', size: 45000 },
          { name: 'react-dom', size: 120000 },
          { name: 'app', size: 35000 },
        ],
      },
      {
        name: 'vendor',
        size: Math.floor(Math.random() * 50000) + 100000,
        modules: [
          { name: 'lodash', size: 70000 },
          { name: 'axios', size: 25000 },
        ],
      },
    ],
    duplicates: [
      {
        module: 'lodash',
        count: 2,
        totalSize: 140000,
      },
    ],
  };
}

async function collectCoreWebVitals(): Promise<CoreWebVitals> {
  return new Promise((resolve) => {
    const vitals: CoreWebVitals = {
      lcp: Math.floor(Math.random() * 1000) + 2000, // 2000-3000ms
      fid: Math.floor(Math.random() * 50) + 50, // 50-100ms
      cls: Math.random() * 0.2, // 0-0.2
      fcp: Math.floor(Math.random() * 500) + 1500, // 1500-2000ms
      ttfb: Math.floor(Math.random() * 200) + 400, // 400-600ms
      tti: Math.floor(Math.random() * 1000) + 3000, // 3000-4000ms
    };

    // Simulate collection time
    setTimeout(() => resolve(vitals), 500);
  });
}

function generateRecommendations(
  lighthouse: LighthouseMetrics,
  coreWebVitals: CoreWebVitals,
  bundleAnalysis: BundleAnalysis,
  thresholds: PerformanceAuditConfig['thresholds']
): PerformanceRecommendation[] {
  const recommendations: PerformanceRecommendation[] = [];

  // Performance recommendations
  if (lighthouse.performance < thresholds.lighthouse.performance) {
    recommendations.push({
      id: 'improve-performance',
      type: 'critical',
      category: 'loading',
      title: 'Improve Performance Score',
      description: `Performance score is ${lighthouse.performance}, below threshold of ${thresholds.lighthouse.performance}`,
      impact: thresholds.lighthouse.performance - lighthouse.performance,
      effort: 'medium',
      implementation: {
        description: 'Optimize images, enable compression, reduce unused JavaScript, and implement code splitting.',
        code: `// Enable code splitting
const LazyComponent = React.lazy(() => import('./Component'));

// Optimize images
<img loading="lazy" src="image.webp" alt="description" />

// Preload critical resources
<link rel="preload" href="critical.css" as="style" />`,
      },
    });
  }

  // Core Web Vitals recommendations
  if (coreWebVitals.lcp > thresholds.coreWebVitals.lcp) {
    recommendations.push({
      id: 'improve-lcp',
      type: 'critical',
      category: 'loading',
      title: 'Reduce Largest Contentful Paint',
      description: `LCP is ${coreWebVitals.lcp}ms, should be under ${thresholds.coreWebVitals.lcp}ms`,
      impact: 85,
      effort: 'high',
      implementation: {
        description: 'Optimize server response times, preload important resources, and optimize images.',
        files: ['index.html', 'main.css'],
      },
    });
  }

  if (coreWebVitals.cls > thresholds.coreWebVitals.cls) {
    recommendations.push({
      id: 'improve-cls',
      type: 'important',
      category: 'runtime',
      title: 'Reduce Cumulative Layout Shift',
      description: `CLS is ${coreWebVitals.cls.toFixed(3)}, should be under ${thresholds.coreWebVitals.cls}`,
      impact: 70,
      effort: 'medium',
      implementation: {
        description: 'Set explicit dimensions for images and embeds, avoid inserting content above existing content.',
        code: `// Set explicit dimensions
<img width="400" height="300" src="image.jpg" alt="description" />

// Use aspect-ratio CSS
.image-container {
  aspect-ratio: 16 / 9;
}`,
      },
    });
  }

  // Bundle recommendations
  if (bundleAnalysis.totalSize > thresholds.bundle.maxSize) {
    recommendations.push({
      id: 'reduce-bundle-size',
      type: 'important',
      category: 'bundle',
      title: 'Reduce Bundle Size',
      description: `Bundle size is ${Math.round(bundleAnalysis.totalSize / 1024)}KB, should be under ${Math.round(thresholds.bundle.maxSize / 1024)}KB`,
      impact: 60,
      effort: 'medium',
      implementation: {
        description: 'Remove unused dependencies, implement tree shaking, and optimize imports.',
        code: `// Use specific imports instead of full library
import { debounce } from 'lodash/debounce';
// Instead of: import _ from 'lodash';

// Dynamic imports for large dependencies
const Chart = React.lazy(() => import('chart.js'));`,
      },
    });
  }

  if (bundleAnalysis.duplicates.length > thresholds.bundle.maxDuplicates) {
    recommendations.push({
      id: 'remove-duplicates',
      type: 'important',
      category: 'bundle',
      title: 'Remove Duplicate Dependencies',
      description: `Found ${bundleAnalysis.duplicates.length} duplicate dependencies`,
      impact: 40,
      effort: 'low',
      implementation: {
        description: 'Configure webpack to resolve duplicates and audit package.json for duplicate dependencies.',
        code: `// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  }
};`,
      },
    });
  }

  // Accessibility recommendations
  if (lighthouse.accessibility < thresholds.lighthouse.accessibility) {
    recommendations.push({
      id: 'improve-accessibility',
      type: 'important',
      category: 'accessibility',
      title: 'Improve Accessibility Score',
      description: `Accessibility score is ${lighthouse.accessibility}, below threshold of ${thresholds.lighthouse.accessibility}`,
      impact: thresholds.lighthouse.accessibility - lighthouse.accessibility,
      effort: 'medium',
      implementation: {
        description: 'Add alt text to images, improve color contrast, and ensure keyboard navigation.',
        code: `// Add proper alt text
<img src="chart.png" alt="Sales increased 25% this quarter" />

// Improve focus management
<button 
  onFocus={handleFocus}
  aria-label="Close dialog"
>
  ×
</button>`,
      },
    });
  }

  return recommendations.sort((a, b) => {
    const typeOrder = { critical: 3, important: 2, minor: 1 };
    return typeOrder[b.type] - typeOrder[a.type] || b.impact - a.impact;
  });
}

function checkThresholds(audit: PerformanceAuditResult, config: PerformanceAuditConfig) {
  if (!config.alerting.enabled) return;

  const alerts: string[] = [];

  // Check Lighthouse thresholds
  Object.entries(config.thresholds.lighthouse).forEach(([metric, threshold]) => {
    const value = audit.lighthouse[metric as keyof LighthouseMetrics];
    if (value < threshold) {
      alerts.push(`${metric} score (${value}) is below threshold (${threshold})`);
    }
  });

  // Check Core Web Vitals thresholds
  Object.entries(config.thresholds.coreWebVitals).forEach(([metric, threshold]) => {
    const value = audit.coreWebVitals[metric as keyof CoreWebVitals];
    if (value > threshold) {
      alerts.push(`${metric} (${value}) exceeds threshold (${threshold})`);
    }
  });

  // Send alerts if any
  if (alerts.length > 0) {
    console.warn('Performance thresholds exceeded:', alerts);
    // In production, this would send actual alerts
  }
}

// Create the performance audit store
export const usePerformanceAuditStore = create<PerformanceAuditStore>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      audits: [],
      isRunningAudit: false,
      lastAuditTime: 0,

      runAudit: async (url = window.location.origin): Promise<PerformanceAuditResult> => {
        set({ isRunningAudit: true });
        
        try {
          const timestamp = Date.now();
          
          // Run audits in parallel
          const [coreWebVitals, lighthouse, bundleAnalysis] = await Promise.all([
            collectCoreWebVitals(),
            runLighthouseAudit(url),
            analyzeBundleSize(),
          ]);
          
          // Calculate overall score
          const score = Math.round(
            (lighthouse.performance * 0.4 +
             lighthouse.accessibility * 0.2 +
             lighthouse.bestPractices * 0.2 +
             lighthouse.seo * 0.1 +
             lighthouse.pwa * 0.1)
          );
          
          // Generate recommendations
          const recommendations = generateRecommendations(
            lighthouse,
            coreWebVitals,
            bundleAnalysis,
            get().config.thresholds
          );
          
          const auditResult: PerformanceAuditResult = {
            id: `audit_${timestamp}`,
            timestamp,
            url,
            userAgent: navigator.userAgent,
            connection: (navigator as any).connection?.effectiveType || 'unknown',
            lighthouse,
            coreWebVitals,
            bundleAnalysis,
            recommendations,
            score,
            grade: calculateGrade(score),
          };
          
          // Update store
          set((state) => ({
            audits: [...state.audits, auditResult],
            lastAuditTime: timestamp,
          }));
          
          // Check thresholds and send alerts
          checkThresholds(auditResult, get().config);
          
          return auditResult;
        } finally {
          set({ isRunningAudit: false });
        }
      },

      scheduleAudit: () => {
        const config = get().config;
        if (!config.enabled) return;
        
        const interval = setInterval(() => {
          get().runAudit();
        }, config.auditInterval);
        
        // Store interval ID for cleanup
        (window as any).__performanceAuditInterval = interval;
      },

      stopScheduledAudit: () => {
        const intervalId = (window as any).__performanceAuditInterval;
        if (intervalId) {
          clearInterval(intervalId);
          delete (window as any).__performanceAuditInterval;
        }
      },

      updateConfig: (newConfig: Partial<PerformanceAuditConfig>) => {
        set((state) => ({
          config: { ...state.config, ...newConfig },
        }));
        
        // Restart scheduling if interval changed
        if (newConfig.auditInterval || newConfig.enabled !== undefined) {
          get().stopScheduledAudit();
          if (get().config.enabled) {
            get().scheduleAudit();
          }
        }
      },

      clearAudits: () => {
        set({ audits: [] });
      },

      exportAudits: (): string => {
        const { audits, config } = get();
        return JSON.stringify({ audits, config }, null, 2);
      },

      getRecommendations: (): PerformanceRecommendation[] => {
        const { audits } = get();
        if (audits.length === 0) return [];
        
        const latestAudit = audits[audits.length - 1];
        return latestAudit.recommendations;
      },
    }),
    {
      name: 'performance-audit-store',
      version: 1,
      partialize: (state) => ({
        config: state.config,
        audits: state.audits.slice(-20), // Keep only last 20 audits
        lastAuditTime: state.lastAuditTime,
      }),
    }
  )
);

// Performance Audit Service
export class PerformanceAuditService {
  private static instance: PerformanceAuditService;
  private store = usePerformanceAuditStore;

  static getInstance(): PerformanceAuditService {
    if (!PerformanceAuditService.instance) {
      PerformanceAuditService.instance = new PerformanceAuditService();
    }
    return PerformanceAuditService.instance;
  }

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Start scheduled audits if enabled
    const config = this.store.getState().config;
    if (config.enabled) {
      this.store.getState().scheduleAudit();
    }

    // Listen for visibility changes to trigger audits
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Run audit when user returns to the page (debounced)
        this.runQuickAudit();
      }
    });
  }

  async runAudit(url?: string): Promise<PerformanceAuditResult> {
    return this.store.getState().runAudit(url);
  }

  async runQuickAudit(): Promise<Partial<PerformanceAuditResult>> {
    // Run a lightweight audit with just Core Web Vitals
    const coreWebVitals = await collectCoreWebVitals();
    
    return {
      timestamp: Date.now(),
      coreWebVitals,
      url: window.location.href,
    };
  }

  getLatestAudit(): PerformanceAuditResult | null {
    const audits = this.store.getState().audits;
    return audits.length > 0 ? audits[audits.length - 1] : null;
  }

  getRecommendations(): PerformanceRecommendation[] {
    return this.store.getState().getRecommendations();
  }

  updateConfig(config: Partial<PerformanceAuditConfig>): void {
    this.store.getState().updateConfig(config);
  }

  exportData(): string {
    return this.store.getState().exportAudits();
  }

  getAuditHistory(): PerformanceAuditResult[] {
    return this.store.getState().audits;
  }

  destroy(): void {
    this.store.getState().stopScheduledAudit();
  }
}

// Create and export singleton instance
export const performanceAuditService = PerformanceAuditService.getInstance();

// React hook for using performance audits
export function usePerformanceAudit() {
  const store = usePerformanceAuditStore();
  
  return {
    ...store,
    service: performanceAuditService,
  };
}

export default PerformanceAuditService; 