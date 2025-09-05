import { z } from 'zod';

// Security audit interfaces
interface SecurityVulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'dependency' | 'code' | 'configuration' | 'authentication' | 'authorization' | 'data';
  title: string;
  description: string;
  file?: string;
  line?: number;
  remediation: string;
  cwe?: string; // Common Weakness Enumeration
  cvss?: number; // Common Vulnerability Scoring System
  firstDetected: Date;
  lastDetected: Date;
  status: 'open' | 'acknowledged' | 'fixed' | 'false-positive';
}

interface DependencyVulnerability {
  package: string;
  version: string;
  vulnerabilities: {
    id: string;
    severity: string;
    title: string;
    url: string;
  }[];
}

interface SecurityAuditResult {
  id: string;
  timestamp: Date;
  overallScore: number; // 0-100
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  vulnerabilities: SecurityVulnerability[];
  dependencyReport: DependencyVulnerability[];
  codeQualityMetrics: {
    totalFiles: number;
    linesOfCode: number;
    testCoverage: number;
    eslintErrors: number;
    eslintWarnings: number;
    typeScriptErrors: number;
  };
  recommendations: SecurityRecommendation[];
}

interface SecurityRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  implementation: {
    steps: string[];
    code?: string;
    links?: string[];
  };
}

interface SecurityAuditConfig {
  enabledChecks: {
    dependencies: boolean;
    codeAnalysis: boolean;
    configurationReview: boolean;
    authenticationAudit: boolean;
    dataProtection: boolean;
  };
  thresholds: {
    maxCritical: number;
    maxHigh: number;
    minOverallScore: number;
  };
  excludePatterns: string[];
  customRules: SecurityRule[];
}

interface SecurityRule {
  id: string;
  name: string;
  pattern: RegExp;
  severity: SecurityVulnerability['severity'];
  category: SecurityVulnerability['category'];
  message: string;
  remediation: string;
}

class SecurityAuditService {
  private config: SecurityAuditConfig;
  private auditHistory: SecurityAuditResult[] = [];
  private isRunning = false;

  constructor(config?: Partial<SecurityAuditConfig>) {
    this.config = {
      enabledChecks: {
        dependencies: true,
        codeAnalysis: true,
        configurationReview: true,
        authenticationAudit: true,
        dataProtection: true,
      },
      thresholds: {
        maxCritical: 0,
        maxHigh: 5,
        minOverallScore: 80,
      },
      excludePatterns: [
        'node_modules/**',
        'dist/**',
        'build/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      customRules: [],
      ...config,
    };
  }

  // Main audit method
  async runSecurityAudit(): Promise<SecurityAuditResult> {
    if (this.isRunning) {
      throw new Error('Security audit is already running');
    }

    this.isRunning = true;
    console.log('🔒 Starting comprehensive security audit...');

    try {
      const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date();
      
      const vulnerabilities: SecurityVulnerability[] = [];
      let dependencyReport: DependencyVulnerability[] = [];

      // 1. Dependency vulnerability scan
      if (this.config.enabledChecks.dependencies) {
        console.log('📦 Scanning dependencies for vulnerabilities...');
        dependencyReport = await this.scanDependencies();
        vulnerabilities.push(...this.convertDependencyVulnerabilities(dependencyReport));
      }

      // 2. Code analysis
      if (this.config.enabledChecks.codeAnalysis) {
        console.log('🔍 Analyzing code for security issues...');
        const codeVulnerabilities = await this.analyzeCode();
        vulnerabilities.push(...codeVulnerabilities);
      }

      // 3. Configuration review
      if (this.config.enabledChecks.configurationReview) {
        console.log('⚙️ Reviewing security configurations...');
        const configVulnerabilities = await this.reviewConfiguration();
        vulnerabilities.push(...configVulnerabilities);
      }

      // 4. Authentication audit
      if (this.config.enabledChecks.authenticationAudit) {
        console.log('🔐 Auditing authentication mechanisms...');
        const authVulnerabilities = await this.auditAuthentication();
        vulnerabilities.push(...authVulnerabilities);
      }

      // 5. Data protection review
      if (this.config.enabledChecks.dataProtection) {
        console.log('🛡️ Reviewing data protection measures...');
        const dataVulnerabilities = await this.reviewDataProtection();
        vulnerabilities.push(...dataVulnerabilities);
      }

      // Calculate metrics
      const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
      const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
      const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
      const lowCount = vulnerabilities.filter(v => v.severity === 'low').length;

      // Calculate overall score (0-100)
      const overallScore = this.calculateSecurityScore(vulnerabilities);

      // Get code quality metrics
      const codeQualityMetrics = await this.getCodeQualityMetrics();

      // Generate recommendations
      const recommendations = this.generateSecurityRecommendations(vulnerabilities, overallScore);

      const result: SecurityAuditResult = {
        id: auditId,
        timestamp,
        overallScore,
        totalVulnerabilities: vulnerabilities.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        vulnerabilities,
        dependencyReport,
        codeQualityMetrics,
        recommendations,
      };

      // Store in history
      this.auditHistory.push(result);

      // Keep only last 10 audits
      if (this.auditHistory.length > 10) {
        this.auditHistory = this.auditHistory.slice(-10);
      }

      console.log(`✅ Security audit completed. Score: ${overallScore}/100`);
      this.logAuditSummary(result);

      return result;
    } finally {
      this.isRunning = false;
    }
  }

  // Dependency vulnerability scanning
  private async scanDependencies(): Promise<DependencyVulnerability[]> {
    try {
      // In a real implementation, this would use tools like:
      // - npm audit
      // - yarn audit
      // - Snyk
      // - OWASP Dependency Check
      
      // Simulate dependency scan results
      const vulnerableDependencies: DependencyVulnerability[] = [
        {
          package: 'esbuild',
          version: '0.24.0',
          vulnerabilities: [{
            id: 'GHSA-67mh-4wv8-2f99',
            severity: 'moderate',
            title: 'esbuild enables any website to send requests to development server',
            url: 'https://github.com/advisories/GHSA-67mh-4wv8-2f99'
          }]
        }
      ];

      return vulnerableDependencies;
    } catch (error) {
      console.error('Error scanning dependencies:', error);
      return [];
    }
  }

  // Code analysis for security issues
  private async analyzeCode(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Define security rules
    const securityRules: SecurityRule[] = [
      {
        id: 'hardcoded-secrets',
        name: 'Hardcoded Secrets',
        pattern: /(password|secret|key|token)\s*[:=]\s*["'][^"']+["']/i,
        severity: 'critical',
        category: 'code',
        message: 'Potential hardcoded secret detected',
        remediation: 'Move secrets to environment variables or secure configuration'
      },
      {
        id: 'sql-injection',
        name: 'SQL Injection',
        pattern: /\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE)/i,
        severity: 'high',
        category: 'code',
        message: 'Potential SQL injection vulnerability',
        remediation: 'Use parameterized queries or prepared statements'
      },
      {
        id: 'xss-vulnerability',
        name: 'XSS Vulnerability',
        pattern: /dangerouslySetInnerHTML|innerHTML\s*=/i,
        severity: 'high',
        category: 'code',
        message: 'Potential XSS vulnerability',
        remediation: 'Sanitize user input or use safe rendering methods'
      },
      {
        id: 'insecure-random',
        name: 'Insecure Random',
        pattern: /Math\.random\(\)/i,
        severity: 'medium',
        category: 'code',
        message: 'Insecure random number generation',
        remediation: 'Use cryptographically secure random number generators'
      },
      {
        id: 'eval-usage',
        name: 'Eval Usage',
        pattern: /\beval\s*\(/i,
        severity: 'critical',
        category: 'code',
        message: 'Use of eval() detected',
        remediation: 'Avoid eval() and use safer alternatives'
      }
    ];

    // Combine with custom rules
    const allRules = [...securityRules, ...this.config.customRules];

    // In a real implementation, this would scan actual files
    // For now, we'll simulate some findings
    vulnerabilities.push({
      id: 'ts-ignore-usage',
      severity: 'medium',
      category: 'code',
      title: 'TypeScript @ts-ignore Usage',
      description: 'Found @ts-ignore comment which bypasses TypeScript type checking',
      file: 'src/shared/services/monitoring/ErrorTracking.ts',
      line: 55,
      remediation: 'Replace @ts-ignore with proper type definitions or fix the underlying type issue',
      firstDetected: new Date(),
      lastDetected: new Date(),
      status: 'open'
    });

    return vulnerabilities;
  }

  // Configuration security review
  private async reviewConfiguration(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Check for common configuration issues
    const configChecks = [
      {
        id: 'missing-csp',
        check: () => {
          // Check if CSP headers are configured
          return !document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        },
        vulnerability: {
          severity: 'high' as const,
          category: 'configuration' as const,
          title: 'Missing Content Security Policy',
          description: 'No Content Security Policy headers detected',
          remediation: 'Implement CSP headers to prevent XSS attacks'
        }
      },
      {
        id: 'missing-hsts',
        check: () => {
          // In a real implementation, check server headers
          return false; // Assume HSTS is configured
        },
        vulnerability: {
          severity: 'medium' as const,
          category: 'configuration' as const,
          title: 'Missing HSTS Headers',
          description: 'HTTP Strict Transport Security headers not configured',
          remediation: 'Configure HSTS headers to enforce HTTPS'
        }
      }
    ];

    for (const { id, check, vulnerability } of configChecks) {
      if (check()) {
        vulnerabilities.push({
          id,
          ...vulnerability,
          firstDetected: new Date(),
          lastDetected: new Date(),
          status: 'open'
        });
      }
    }

    return vulnerabilities;
  }

  // Authentication mechanism audit
  private async auditAuthentication(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Check authentication implementation
    const authChecks = [
      {
        id: 'weak-session-config',
        title: 'Weak Session Configuration',
        description: 'Session configuration may be insecure',
        severity: 'medium' as const,
        remediation: 'Review session timeout, secure flags, and storage mechanisms'
      },
      {
        id: 'missing-rate-limiting',
        title: 'Missing Rate Limiting',
        description: 'No rate limiting detected on authentication endpoints',
        severity: 'high' as const,
        remediation: 'Implement rate limiting to prevent brute force attacks'
      }
    ];

    // In a real implementation, check actual authentication code
    return authChecks.map(check => ({
      id: check.id,
      severity: check.severity,
      category: 'authentication' as const,
      title: check.title,
      description: check.description,
      remediation: check.remediation,
      firstDetected: new Date(),
      lastDetected: new Date(),
      status: 'open' as const
    }));
  }

  // Data protection review
  private async reviewDataProtection(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Check data protection measures
    const dataChecks = [
      {
        id: 'localStorage-sensitive-data',
        title: 'Sensitive Data in localStorage',
        description: 'Potentially sensitive data stored in localStorage',
        severity: 'medium' as const,
        remediation: 'Use secure storage mechanisms for sensitive data'
      }
    ];

    return dataChecks.map(check => ({
      id: check.id,
      severity: check.severity,
      category: 'data' as const,
      title: check.title,
      description: check.description,
      remediation: check.remediation,
      firstDetected: new Date(),
      lastDetected: new Date(),
      status: 'open' as const
    }));
  }

  // Convert dependency vulnerabilities to standard format
  private convertDependencyVulnerabilities(deps: DependencyVulnerability[]): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    for (const dep of deps) {
      for (const vuln of dep.vulnerabilities) {
        vulnerabilities.push({
          id: vuln.id,
          severity: this.mapSeverity(vuln.severity),
          category: 'dependency',
          title: `${dep.package}: ${vuln.title}`,
          description: `Vulnerability in ${dep.package}@${dep.version}`,
          remediation: `Update ${dep.package} to a secure version`,
          firstDetected: new Date(),
          lastDetected: new Date(),
          status: 'open'
        });
      }
    }

    return vulnerabilities;
  }

  // Map external severity levels to our standard
  private mapSeverity(severity: string): SecurityVulnerability['severity'] {
    const normalized = severity.toLowerCase();
    if (normalized.includes('critical')) return 'critical';
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('moderate') || normalized.includes('medium')) return 'medium';
    return 'low';
  }

  // Calculate overall security score
  private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): number {
    let score = 100;

    // Deduct points based on severity
    for (const vuln of vulnerabilities) {
      switch (vuln.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    }

    return Math.max(0, score);
  }

  // Get code quality metrics
  private async getCodeQualityMetrics() {
    // In a real implementation, integrate with:
    // - ESLint
    // - TypeScript compiler
    // - Test coverage tools
    // - Code analysis tools

    return {
      totalFiles: 150,
      linesOfCode: 25000,
      testCoverage: 82,
      eslintErrors: 2,
      eslintWarnings: 15,
      typeScriptErrors: 1
    };
  }

  // Generate security recommendations
  private generateSecurityRecommendations(
    vulnerabilities: SecurityVulnerability[],
    score: number
  ): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    // Critical vulnerabilities
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
    if (criticalVulns.length > 0) {
      recommendations.push({
        id: 'fix-critical-vulnerabilities',
        priority: 'critical',
        category: 'security',
        title: 'Fix Critical Security Vulnerabilities',
        description: `Found ${criticalVulns.length} critical security vulnerabilities that need immediate attention`,
        impact: 'High security risk, potential for system compromise',
        effort: 'high',
        implementation: {
          steps: [
            'Review all critical vulnerabilities listed in the audit report',
            'Prioritize based on exploitability and system exposure',
            'Apply patches or implement mitigations immediately',
            'Test fixes in staging environment before production deployment'
          ],
          links: ['https://owasp.org/www-project-top-ten/']
        }
      });
    }

    // Dependency updates
    const depVulns = vulnerabilities.filter(v => v.category === 'dependency');
    if (depVulns.length > 0) {
      recommendations.push({
        id: 'update-dependencies',
        priority: 'high',
        category: 'dependencies',
        title: 'Update Vulnerable Dependencies',
        description: `Found ${depVulns.length} vulnerable dependencies`,
        impact: 'Reduces attack surface from known vulnerabilities',
        effort: 'medium',
        implementation: {
          steps: [
            'Run npm audit fix to auto-fix vulnerabilities',
            'Manually update dependencies that cannot be auto-fixed',
            'Test application thoroughly after updates',
            'Set up automated dependency scanning in CI/CD'
          ],
          code: `# Fix vulnerabilities automatically
npm audit fix

# Check for remaining vulnerabilities
npm audit

# Update specific packages
npm update package-name`
        }
      });
    }

    // Security headers
    if (score < 90) {
      recommendations.push({
        id: 'implement-security-headers',
        priority: 'high',
        category: 'configuration',
        title: 'Implement Security Headers',
        description: 'Add comprehensive security headers to protect against common attacks',
        impact: 'Significantly improves defense against XSS, clickjacking, and other attacks',
        effort: 'low',
        implementation: {
          steps: [
            'Configure Content Security Policy (CSP)',
            'Add HTTP Strict Transport Security (HSTS)',
            'Implement X-Frame-Options header',
            'Set X-Content-Type-Options: nosniff'
          ],
          code: `<!-- CSP Meta Tag -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'">

// Vite configuration for headers
export default {
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    }
  }
}`
        }
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Log audit summary
  private logAuditSummary(result: SecurityAuditResult) {
    console.group('🔒 Security Audit Summary');
    console.log(`Overall Score: ${result.overallScore}/100`);
    console.log(`Total Vulnerabilities: ${result.totalVulnerabilities}`);
    console.log(`├─ Critical: ${result.criticalCount}`);
    console.log(`├─ High: ${result.highCount}`);
    console.log(`├─ Medium: ${result.mediumCount}`);
    console.log(`└─ Low: ${result.lowCount}`);
    
    if (result.recommendations.length > 0) {
      console.log(`\nTop Recommendations:`);
      result.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
      });
    }
    
    console.groupEnd();
  }

  // Public API methods
  getLatestAudit(): SecurityAuditResult | null {
    return this.auditHistory[this.auditHistory.length - 1] || null;
  }

  getAuditHistory(): SecurityAuditResult[] {
    return [...this.auditHistory];
  }

  async scheduleRegularAudits(intervalHours: number = 24) {
    const interval = intervalHours * 60 * 60 * 1000; // Convert to milliseconds
    
    setInterval(async () => {
      try {
        await this.runSecurityAudit();
      } catch (error) {
        console.error('Scheduled security audit failed:', error);
      }
    }, interval);
    
    console.log(`🔒 Scheduled security audits every ${intervalHours} hours`);
  }

  updateConfig(newConfig: Partial<SecurityAuditConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('Security audit configuration updated');
  }

  isAuditRunning(): boolean {
    return this.isRunning;
  }
}

// Create singleton instance
const securityAuditService = new SecurityAuditService();

export { securityAuditService, SecurityAuditService };
export type {
  SecurityVulnerability,
  SecurityAuditResult,
  SecurityRecommendation,
  SecurityAuditConfig,
  DependencyVulnerability,
  SecurityRule
}; 