import { z } from 'zod';

// Bundle analysis interfaces
interface BundleAsset {
  name: string;
  size: number;
  gzippedSize?: number;
  type: 'js' | 'css' | 'img' | 'font' | 'other';
  chunks: string[];
  modules?: BundleModule[];
}

interface BundleChunk {
  id: string;
  name: string;
  size: number;
  files: string[];
  parents: string[];
  children: string[];
  origins: ChunkOrigin[];
  modules: BundleModule[];
}

interface BundleModule {
  id: string;
  name: string;
  size: number;
  chunks: string[];
  issuer?: string;
  reasons: ModuleReason[];
  source?: string;
}

interface ChunkOrigin {
  moduleId: string;
  module: string;
  loc: string;
  request: string;
}

interface ModuleReason {
  moduleId: string;
  module: string;
  type: string;
  userRequest: string;
}

interface BundleStats {
  assets: BundleAsset[];
  chunks: BundleChunk[];
  modules: BundleModule[];
  entrypoints: Record<string, BundleEntrypoint>;
  outputPath: string;
  publicPath: string;
  hash: string;
  time: number;
  warnings: string[];
  errors: string[];
}

interface BundleEntrypoint {
  name: string;
  chunks: string[];
  assets: string[];
  size: number;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzippedSize: number;
  assetsByType: Record<string, BundleAsset[]>;
  largestAssets: BundleAsset[];
  duplicatedModules: BundleModule[];
  unusedAssets: BundleAsset[];
  chunkAnalysis: ChunkAnalysisResult;
  recommendations: BundleRecommendation[];
  timestamp: Date;
}

interface ChunkAnalysisResult {
  totalChunks: number;
  largestChunks: BundleChunk[];
  vendorChunks: BundleChunk[];
  appChunks: BundleChunk[];
  asyncChunks: BundleChunk[];
}

interface BundleRecommendation {
  type: 'size' | 'splitting' | 'loading' | 'optimization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  solution: string;
  code?: string;
  files?: string[];
}

// Configuration interface
interface BundleAnalyzerConfig {
  thresholds: {
    maxAssetSize: number; // in bytes
    maxChunkSize: number;
    maxGzippedSize: number;
    maxModuleSize: number;
  };
  analysis: {
    detectDuplicates: boolean;
    analyzeUnused: boolean;
    generateRecommendations: boolean;
    includeSourceMaps: boolean;
  };
  output: {
    generateReport: boolean;
    reportPath: string;
    openBrowser: boolean;
  };
}

const defaultConfig: BundleAnalyzerConfig = {
  thresholds: {
    maxAssetSize: 500 * 1024, // 500KB
    maxChunkSize: 1024 * 1024, // 1MB
    maxGzippedSize: 250 * 1024, // 250KB
    maxModuleSize: 100 * 1024, // 100KB
  },
  analysis: {
    detectDuplicates: true,
    analyzeUnused: true,
    generateRecommendations: true,
    includeSourceMaps: false,
  },
  output: {
    generateReport: true,
    reportPath: './bundle-analysis-report.html',
    openBrowser: false,
  },
};

class BundleAnalyzer {
  private config: BundleAnalyzerConfig;
  private lastAnalysis: BundleAnalysis | null = null;

  constructor(config: Partial<BundleAnalyzerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Analyze bundle from stats JSON
  async analyzeBundle(statsPath: string): Promise<BundleAnalysis> {
    try {
      const stats = await this.loadStats(statsPath);
      const analysis = await this.performAnalysis(stats);
      this.lastAnalysis = analysis;
      
      if (this.config.output.generateReport) {
        await this.generateReport(analysis);
      }
      
      return analysis;
    } catch (error) {
      console.error('Bundle analysis failed:', error);
      throw error;
    }
  }

  // Load webpack stats
  private async loadStats(statsPath: string): Promise<BundleStats> {
    const fs = await import('fs/promises');
    const statsContent = await fs.readFile(statsPath, 'utf-8');
    return JSON.parse(statsContent);
  }

  // Perform comprehensive analysis
  private async performAnalysis(stats: BundleStats): Promise<BundleAnalysis> {
    const totalSize = this.calculateTotalSize(stats.assets);
    const totalGzippedSize = this.calculateTotalGzippedSize(stats.assets);
    const assetsByType = this.groupAssetsByType(stats.assets);
    const largestAssets = this.findLargestAssets(stats.assets);
    const duplicatedModules = this.findDuplicatedModules(stats.modules);
    const unusedAssets = this.findUnusedAssets(stats);
    const chunkAnalysis = this.analyzeChunks(stats.chunks);
    const recommendations = this.generateRecommendations(stats, {
      totalSize,
      totalGzippedSize,
      largestAssets,
      duplicatedModules,
      unusedAssets,
      chunkAnalysis,
    });

    return {
      totalSize,
      totalGzippedSize,
      assetsByType,
      largestAssets,
      duplicatedModules,
      unusedAssets,
      chunkAnalysis,
      recommendations,
      timestamp: new Date(),
    };
  }

  // Calculate total bundle size
  private calculateTotalSize(assets: BundleAsset[]): number {
    return assets.reduce((total, asset) => total + asset.size, 0);
  }

  // Calculate total gzipped size
  private calculateTotalGzippedSize(assets: BundleAsset[]): number {
    return assets.reduce((total, asset) => total + (asset.gzippedSize || asset.size * 0.3), 0);
  }

  // Group assets by type
  private groupAssetsByType(assets: BundleAsset[]): Record<string, BundleAsset[]> {
    return assets.reduce((groups, asset) => {
      const type = asset.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(asset);
      return groups;
    }, {} as Record<string, BundleAsset[]>);
  }

  // Find largest assets
  private findLargestAssets(assets: BundleAsset[], limit = 10): BundleAsset[] {
    return [...assets]
      .sort((a, b) => b.size - a.size)
      .slice(0, limit);
  }

  // Find duplicated modules
  private findDuplicatedModules(modules: BundleModule[]): BundleModule[] {
    const moduleMap = new Map<string, BundleModule[]>();
    
    modules.forEach(module => {
      const normalizedName = this.normalizeModuleName(module.name);
      if (!moduleMap.has(normalizedName)) {
        moduleMap.set(normalizedName, []);
      }
      moduleMap.get(normalizedName)!.push(module);
    });

    const duplicated: BundleModule[] = [];
    moduleMap.forEach((moduleList, name) => {
      if (moduleList.length > 1) {
        duplicated.push(...moduleList);
      }
    });

    return duplicated;
  }

  // Find unused assets
  private findUnusedAssets(stats: BundleStats): BundleAsset[] {
    const usedAssets = new Set<string>();
    
    // Mark assets used by chunks
    stats.chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        usedAssets.add(file);
      });
    });

    // Mark assets used by entrypoints
    Object.values(stats.entrypoints).forEach(entrypoint => {
      entrypoint.assets.forEach(asset => {
        usedAssets.add(asset);
      });
    });

    return stats.assets.filter(asset => !usedAssets.has(asset.name));
  }

  // Analyze chunks
  private analyzeChunks(chunks: BundleChunk[]): ChunkAnalysisResult {
    const largestChunks = [...chunks]
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    const vendorChunks = chunks.filter(chunk => 
      chunk.name.includes('vendor') || 
      chunk.name.includes('node_modules')
    );

    const appChunks = chunks.filter(chunk => 
      !chunk.name.includes('vendor') && 
      !chunk.name.includes('node_modules') &&
      chunk.parents.length === 0
    );

    const asyncChunks = chunks.filter(chunk => 
      chunk.parents.length > 0
    );

    return {
      totalChunks: chunks.length,
      largestChunks,
      vendorChunks,
      appChunks,
      asyncChunks,
    };
  }

  // Generate optimization recommendations
  private generateRecommendations(
    stats: BundleStats,
    analysis: Partial<BundleAnalysis>
  ): BundleRecommendation[] {
    const recommendations: BundleRecommendation[] = [];

    // Large bundle size
    if (analysis.totalSize! > this.config.thresholds.maxAssetSize * 2) {
      recommendations.push({
        type: 'size',
        severity: 'critical',
        title: 'Bundle size too large',
        description: `Total bundle size (${this.formatBytes(analysis.totalSize!)}) exceeds recommended threshold`,
        impact: 'Slow initial loading, poor user experience',
        solution: 'Implement code splitting, lazy loading, and remove unused dependencies',
        code: `
// Implement dynamic imports
const LazyComponent = lazy(() => import('./components/LazyComponent'));

// Use React.Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
        `,
      });
    }

    // Large individual assets
    analysis.largestAssets?.forEach(asset => {
      if (asset.size > this.config.thresholds.maxAssetSize) {
        recommendations.push({
          type: 'size',
          severity: asset.size > this.config.thresholds.maxAssetSize * 2 ? 'high' : 'medium',
          title: `Large asset: ${asset.name}`,
          description: `Asset size (${this.formatBytes(asset.size)}) exceeds threshold`,
          impact: 'Increased loading time for this resource',
          solution: 'Consider compression, optimization, or lazy loading',
          files: [asset.name],
        });
      }
    });

    // Duplicated modules
    if (analysis.duplicatedModules && analysis.duplicatedModules.length > 0) {
      recommendations.push({
        type: 'optimization',
        severity: 'high',
        title: 'Duplicated modules detected',
        description: `${analysis.duplicatedModules.length} modules are duplicated across chunks`,
        impact: 'Increased bundle size and memory usage',
        solution: 'Configure webpack optimization.splitChunks to extract common modules',
        code: `
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      common: {
        minChunks: 2,
        chunks: 'all',
        enforce: true,
      },
    },
  },
}
        `,
      });
    }

    // Too many chunks
    if (analysis.chunkAnalysis && analysis.chunkAnalysis.totalChunks > 50) {
      recommendations.push({
        type: 'splitting',
        severity: 'medium',
        title: 'Too many chunks',
        description: `${analysis.chunkAnalysis.totalChunks} chunks may cause HTTP/2 overhead`,
        impact: 'Potential performance degradation with many small chunks',
        solution: 'Optimize chunk splitting configuration',
        code: `
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000,
    maxSize: 244000,
  },
}
        `,
      });
    }

    // Unused assets
    if (analysis.unusedAssets && analysis.unusedAssets.length > 0) {
      recommendations.push({
        type: 'optimization',
        severity: 'low',
        title: 'Unused assets detected',
        description: `${analysis.unusedAssets.length} assets appear to be unused`,
        impact: 'Increased build time and deployment size',
        solution: 'Remove unused assets from build',
        files: analysis.unusedAssets.map(asset => asset.name),
      });
    }

    return recommendations;
  }

  // Generate HTML report
  private async generateReport(analysis: BundleAnalysis): Promise<void> {
    const html = this.generateReportHTML(analysis);
    const fs = await import('fs/promises');
    await fs.writeFile(this.config.output.reportPath, html);
    console.log(`Bundle analysis report generated: ${this.config.output.reportPath}`);
  }

  // Generate HTML report content
  private generateReportHTML(analysis: BundleAnalysis): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Analysis Report</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 20px; line-height: 1.6; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
    .metric-label { font-size: 0.9em; color: #6c757d; }
    .section { margin: 30px 0; }
    .recommendation { 
      border: 1px solid #dee2e6; 
      border-radius: 8px; 
      padding: 15px; 
      margin: 10px 0; 
    }
    .recommendation.critical { border-left: 4px solid #dc3545; }
    .recommendation.high { border-left: 4px solid #fd7e14; }
    .recommendation.medium { border-left: 4px solid #ffc107; }
    .recommendation.low { border-left: 4px solid #20c997; }
    .asset-list { max-height: 400px; overflow-y: auto; }
    .asset-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px; 
      border-bottom: 1px solid #eee; 
    }
    code { 
      background: #f8f9fa; 
      padding: 2px 4px; 
      border-radius: 4px; 
      font-size: 0.9em; 
    }
    pre { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 8px; 
      overflow-x: auto; 
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Bundle Analysis Report</h1>
    <p>Generated on ${analysis.timestamp.toLocaleString()}</p>
    
    <div class="metric">
      <div class="metric-value">${this.formatBytes(analysis.totalSize)}</div>
      <div class="metric-label">Total Bundle Size</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">${this.formatBytes(analysis.totalGzippedSize)}</div>
      <div class="metric-label">Gzipped Size</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">${analysis.duplicatedModules.length}</div>
      <div class="metric-label">Duplicated Modules</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">${analysis.chunkAnalysis.totalChunks}</div>
      <div class="metric-label">Total Chunks</div>
    </div>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    ${analysis.recommendations.map(rec => `
      <div class="recommendation ${rec.severity}">
        <h3>${rec.title}</h3>
        <p><strong>Impact:</strong> ${rec.impact}</p>
        <p><strong>Solution:</strong> ${rec.solution}</p>
        ${rec.code ? `<pre><code>${rec.code}</code></pre>` : ''}
        ${rec.files ? `<p><strong>Files:</strong> ${rec.files.join(', ')}</p>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Largest Assets</h2>
    <div class="asset-list">
      ${analysis.largestAssets.map(asset => `
        <div class="asset-item">
          <span>${asset.name}</span>
          <span>${this.formatBytes(asset.size)}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Assets by Type</h2>
    ${Object.entries(analysis.assetsByType).map(([type, assets]) => `
      <h3>${type.toUpperCase()} (${assets.length} files)</h3>
      <div class="asset-list">
        ${assets.map(asset => `
          <div class="asset-item">
            <span>${asset.name}</span>
            <span>${this.formatBytes(asset.size)}</span>
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;
  }

  // Utility methods
  private normalizeModuleName(name: string): string {
    // Remove webpack-specific prefixes and version numbers
    return name
      .replace(/^\.\//, '')
      .replace(/\?.*$/, '')
      .replace(/@[\d.]+/, '')
      .replace(/node_modules\//, '');
  }

  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Public API methods
  getLastAnalysis(): BundleAnalysis | null {
    return this.lastAnalysis;
  }

  updateConfig(config: Partial<BundleAnalyzerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Compare two analyses
  compareAnalyses(previous: BundleAnalysis, current: BundleAnalysis) {
    return {
      sizeDelta: current.totalSize - previous.totalSize,
      gzippedSizeDelta: current.totalGzippedSize - previous.totalGzippedSize,
      newAssets: current.largestAssets.filter(
        asset => !previous.largestAssets.find(prev => prev.name === asset.name)
      ),
      removedAssets: previous.largestAssets.filter(
        asset => !current.largestAssets.find(curr => curr.name === asset.name)
      ),
      chunksDelta: current.chunkAnalysis.totalChunks - previous.chunkAnalysis.totalChunks,
    };
  }
}

// Export types and class
export type {
  BundleAsset,
  BundleChunk,
  BundleModule,
  BundleStats,
  BundleAnalysis,
  BundleRecommendation,
  BundleAnalyzerConfig,
};

export { BundleAnalyzer };

// Create singleton instance
export const bundleAnalyzer = new BundleAnalyzer(); 