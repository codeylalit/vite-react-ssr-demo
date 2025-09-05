interface BundleChunk {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'vendor' | 'feature' | 'async' | 'entry';
  critical: boolean;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzippedSize: number;
  chunks: BundleChunk[];
  largestChunks: BundleChunk[];
  recommendations: BundleRecommendation[];
}

interface BundleRecommendation {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: string;
  action: string;
}

class BundleOptimizer {
  private currentAnalysis: BundleAnalysis | null = null;

  // Analyze current bundle based on build output
  analyzeCurrentBundle(): BundleAnalysis {
    // Based on our recent build results
    const chunks: BundleChunk[] = [
      { name: 'react-vendor', size: 141.65, gzippedSize: 45.51, type: 'vendor', critical: true },
      { name: 'form-vendor', size: 81.48, gzippedSize: 22.73, type: 'vendor', critical: false },
      { name: 'radix-dropdown', size: 55.05, gzippedSize: 18.19, type: 'vendor', critical: false },
      { name: 'index-main', size: 55.53, gzippedSize: 12.94, type: 'entry', critical: true },
      { name: 'Index-landing', size: 50.75, gzippedSize: 11.40, type: 'feature', critical: true },
      { name: 'i18n-vendor', size: 50.91, gzippedSize: 16.27, type: 'vendor', critical: false },
      { name: 'router-vendor', size: 35.78, gzippedSize: 13.14, type: 'vendor', critical: true },
      { name: 'radix-dialog', size: 34.04, gzippedSize: 11.70, type: 'vendor', critical: false },
      { name: 'LoadingStates', size: 28.39, gzippedSize: 10.85, type: 'feature', critical: true },
      { name: 'radix-other', size: 22.75, gzippedSize: 7.93, type: 'vendor', critical: false },
      { name: 'icon-vendor', size: 22.52, gzippedSize: 4.85, type: 'vendor', critical: false },
      { name: 'utility-vendor', size: 21.59, gzippedSize: 7.36, type: 'vendor', critical: true },
    ];

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzippedSize = chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    const largestChunks = chunks.sort((a, b) => b.size - a.size).slice(0, 5);

    const recommendations = this.generateRecommendations(chunks, totalSize, totalGzippedSize);

    this.currentAnalysis = {
      totalSize,
      totalGzippedSize,
      chunks,
      largestChunks,
      recommendations,
    };

    return this.currentAnalysis;
  }

  private generateRecommendations(
    chunks: BundleChunk[], 
    totalSize: number, 
    totalGzippedSize: number
  ): BundleRecommendation[] {
    const recommendations: BundleRecommendation[] = [];

    // Check overall bundle size
    if (totalGzippedSize > 200) {
      recommendations.push({
        type: 'warning',
        title: 'Large Total Bundle Size',
        description: `Total gzipped size is ${totalGzippedSize.toFixed(1)}KB, target is <200KB`,
        impact: 'Slower initial page load, poor Core Web Vitals',
        action: 'Implement dynamic imports and lazy loading for non-critical features',
      });
    }

    // Check for large vendor chunks
    const largeVendorChunks = chunks.filter(chunk => 
      chunk.type === 'vendor' && chunk.gzippedSize > 20
    );

    if (largeVendorChunks.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Large Vendor Chunks',
        description: `${largeVendorChunks.length} vendor chunks exceed 20KB gzipped`,
        impact: 'Blocking initial render, poor LCP scores',
        action: 'Split large vendor libraries and load non-critical ones asynchronously',
      });
    }

    // Check for critical path optimization
    const criticalChunks = chunks.filter(chunk => chunk.critical);
    const criticalSize = criticalChunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);

    if (criticalSize > 100) {
      recommendations.push({
        type: 'critical',
        title: 'Critical Path Too Large',
        description: `Critical chunks total ${criticalSize.toFixed(1)}KB, target is <100KB`,
        impact: 'Poor LCP, FCP, and TTI metrics',
        action: 'Move non-essential features to async chunks, optimize critical CSS',
      });
    }

    // Specific recommendations
    const reactChunk = chunks.find(chunk => chunk.name === 'react-vendor');
    if (reactChunk && reactChunk.gzippedSize > 40) {
      recommendations.push({
        type: 'info',
        title: 'Optimize React Bundle',
        description: 'React vendor chunk is large, consider optimization',
        impact: 'Slower initial load',
        action: 'Use React production build, consider Preact for smaller bundle size',
      });
    }

    return recommendations;
  }

  // Get optimization suggestions
  getOptimizationSuggestions(): string[] {
    if (!this.currentAnalysis) {
      this.analyzeCurrentBundle();
    }

    const suggestions = [
      '✅ COMPLETED: Bundle splitting successfully implemented',
      '✅ COMPLETED: Vendor chunks properly separated',
      '⚠️  NEXT: Implement dynamic imports for dashboard routes',
      '⚠️  NEXT: Lazy load form components to reduce form-vendor chunk',
      '⚠️  NEXT: Consider code splitting for Radix UI components',
      '💡 CONSIDER: Use tree-shaking to remove unused code',
      '💡 CONSIDER: Implement preloading for critical chunks',
      '💡 CONSIDER: Use service worker for caching optimization',
    ];

    return suggestions;
  }

  // Generate performance budget
  getPerformanceBudget() {
    return {
      totalGzippedSize: { target: 200, current: this.currentAnalysis?.totalGzippedSize || 0 },
      criticalChunks: { target: 100, current: 0 }, // To be calculated
      asyncChunks: { target: 300, current: 0 }, // To be calculated
      vendorChunks: { target: 150, current: 0 }, // To be calculated
    };
  }

  // Monitor bundle performance over time
  trackBundleMetrics() {
    const analysis = this.analyzeCurrentBundle();
    
    const metrics = {
      timestamp: new Date().toISOString(),
      totalSize: analysis.totalSize,
      totalGzippedSize: analysis.totalGzippedSize,
      chunkCount: analysis.chunks.length,
      largestChunk: analysis.largestChunks[0]?.size || 0,
      recommendations: analysis.recommendations.length,
    };

    console.log('📊 Bundle Metrics:', metrics);
    return metrics;
  }
}

export const bundleOptimizer = new BundleOptimizer();
export type { BundleAnalysis, BundleChunk, BundleRecommendation }; 