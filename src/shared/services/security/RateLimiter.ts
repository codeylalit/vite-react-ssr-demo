interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (context: any) => string; // Custom key generator
}

interface RateLimitRule {
  endpoint: string;
  method?: string;
  config: RateLimitConfig;
}

interface RateLimitState {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class RateLimiter {
  private limits: Map<string, RateLimitState> = new Map();
  private rules: RateLimitRule[] = [];
  private defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  };

  constructor() {
    this.setupDefaultRules();
    this.startCleanupTimer();
  }

  private setupDefaultRules() {
    // Authentication endpoints - stricter limits
    this.addRule({
      endpoint: '/auth/login',
      method: 'POST',
      config: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5, // 5 login attempts per 15 minutes
        skipSuccessfulRequests: true,
      },
    });

    this.addRule({
      endpoint: '/auth/register',
      method: 'POST',
      config: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3, // 3 registration attempts per hour
      },
    });

    this.addRule({
      endpoint: '/auth/forgot-password',
      method: 'POST',
      config: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3, // 3 password reset requests per hour
      },
    });

    // API key operations - moderate limits
    this.addRule({
      endpoint: '/api-keys',
      method: 'POST',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5, // 5 API key creations per minute
      },
    });

    this.addRule({
      endpoint: '/api-keys',
      method: 'DELETE',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 deletions per minute
      },
    });

    // General API calls - lenient limits
    this.addRule({
      endpoint: '/api/*',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 1000, // 1000 API calls per minute
        skipSuccessfulRequests: false,
      },
    });

    // File uploads - very strict limits
    this.addRule({
      endpoint: '/upload',
      method: 'POST',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 uploads per minute
      },
    });
  }

  addRule(rule: RateLimitRule): void {
    this.rules.push(rule);
  }

  removeRule(endpoint: string, method?: string): void {
    this.rules = this.rules.filter(
      rule => !(rule.endpoint === endpoint && rule.method === method)
    );
  }

  async checkRateLimit(
    endpoint: string,
    method: string = 'GET',
    context: any = {}
  ): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const rule = this.findMatchingRule(endpoint, method);
    const config = rule?.config || this.defaultConfig;
    
    const key = this.generateKey(endpoint, method, context, config);
    const now = Date.now();
    
    let state = this.limits.get(key);
    
    // Reset if window has expired
    if (!state || now >= state.resetTime) {
      state = {
        count: 0,
        resetTime: now + config.windowMs,
        blocked: false,
      };
    }
    
    // Check if currently blocked
    if (state.blocked && now < state.resetTime) {
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: state.resetTime,
        retryAfter: Math.ceil((state.resetTime - now) / 1000),
      };
    }
    
    // Check if limit would be exceeded
    if (state.count >= config.maxRequests) {
      state.blocked = true;
      this.limits.set(key, state);
      
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: state.resetTime,
        retryAfter: Math.ceil((state.resetTime - now) / 1000),
      };
    }
    
    // Allow request and increment counter
    state.count++;
    this.limits.set(key, state);
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - state.count,
      resetTime: state.resetTime,
    };
  }

  async recordRequest(
    endpoint: string,
    method: string,
    success: boolean,
    context: any = {}
  ): Promise<void> {
    const rule = this.findMatchingRule(endpoint, method);
    const config = rule?.config || this.defaultConfig;
    
    // Skip counting based on configuration
    if (
      (success && config.skipSuccessfulRequests) ||
      (!success && config.skipFailedRequests)
    ) {
      return;
    }
    
    // The counting is already done in checkRateLimit
    // This method can be used for additional logging or adjustments
  }

  private findMatchingRule(endpoint: string, method: string): RateLimitRule | null {
    // Find exact match first
    let rule = this.rules.find(
      r => r.endpoint === endpoint && (!r.method || r.method === method)
    );
    
    if (rule) return rule;
    
    // Find wildcard match
    rule = this.rules.find(r => {
      if (r.method && r.method !== method) return false;
      
      const pattern = r.endpoint.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(endpoint);
    });
    
    return rule || null;
  }

  private generateKey(
    endpoint: string,
    method: string,
    context: any,
    config: RateLimitConfig
  ): string {
    if (config.keyGenerator) {
      return config.keyGenerator(context);
    }
    
    // Default key generation based on user ID or IP
    const userId = context.userId || context.user?.id;
    const ip = context.ip || context.clientIP || 'unknown';
    
    return `${endpoint}:${method}:${userId || ip}`;
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, state] of this.limits.entries()) {
        if (now >= state.resetTime) {
          this.limits.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Get current rate limit status for debugging
  getStatus(endpoint: string, method: string, context: any = {}): RateLimitState | null {
    const rule = this.findMatchingRule(endpoint, method);
    const config = rule?.config || this.defaultConfig;
    const key = this.generateKey(endpoint, method, context, config);
    
    return this.limits.get(key) || null;
  }

  // Reset rate limit for a specific key (admin function)
  reset(endpoint: string, method: string, context: any = {}): void {
    const rule = this.findMatchingRule(endpoint, method);
    const config = rule?.config || this.defaultConfig;
    const key = this.generateKey(endpoint, method, context, config);
    
    this.limits.delete(key);
  }

  // Get all current limits (admin function)
  getAllLimits(): Map<string, RateLimitState> {
    return new Map(this.limits);
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Helper function for use in API interceptors
export async function checkRateLimit(
  url: string,
  method: string,
  context?: any
): Promise<{
  allowed: boolean;
  headers: Record<string, string>;
  retryAfter?: number;
}> {
  const result = await rateLimiter.checkRateLimit(url, method, context);
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
  
  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return {
    allowed: result.allowed,
    headers,
    retryAfter: result.retryAfter,
  };
}

export default rateLimiter; 