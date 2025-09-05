import { getAuthHeader, refreshAccessToken } from '@/lib/security/auth';
import { sanitizeText } from '@/lib/security/sanitize';

// API Error types
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

class RateLimitError extends APIError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

// Request configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  validateResponse?: (response: Response) => boolean;
}

// Response wrapper
interface APIResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  success: boolean;
}

// Rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limits: Map<string, { count: number; window: number }> = new Map();

  setLimit(endpoint: string, count: number, windowMs: number): void {
    this.limits.set(endpoint, { count, window: windowMs });
  }

  canMakeRequest(endpoint: string): boolean {
    const limit = this.limits.get(endpoint);
    if (!limit) return true;

    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];

    // Clean old requests outside the window
    const validRequests = requests.filter(time => now - time < limit.window);

    this.requests.set(endpoint, validRequests);
    return validRequests.length < limit.count;
  }

  recordRequest(endpoint: string): void {
    const requests = this.requests.get(endpoint) || [];
    requests.push(Date.now());
    this.requests.set(endpoint, requests);
  }

  getRetryAfter(endpoint: string): number {
    const limit = this.limits.get(endpoint);
    if (!limit) return 0;

    const requests = this.requests.get(endpoint) || [];
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    return Math.max(0, limit.window - (Date.now() - oldestRequest));
  }
}

// Cache management
class ResponseCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

class APIClient {
  private baseURL: string;
  private defaultTimeout: number = 30000;
  private rateLimiter = new RateLimiter();
  private cache = new ResponseCache();
  private abortController: AbortController | null = null;

  constructor(baseURL: string = process.env.VITE_API_URL || '/api') {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash

    // Set default rate limits
    this.rateLimiter.setLimit('/auth', 5, 60 * 1000); // 5 requests per minute
    this.rateLimiter.setLimit('/voice', 100, 60 * 1000); // 100 requests per minute
    this.rateLimiter.setLimit('/usage', 10, 60 * 1000); // 10 requests per minute
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private sanitizeRequestData(data: any): any {
    if (typeof data === 'string') {
      return sanitizeText(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeRequestData(value);
      }
      return sanitized;
    }

    return data;
  }

  private getCacheKey(url: string, config: RequestConfig): string {
    const method = config.method || 'GET';
    const body = config.body ? JSON.stringify(config.body) : '';
    return `${method}:${url}:${body}`;
  }

  private async makeRequest<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = config.method || 'GET';
    const cacheKey = this.getCacheKey(url, config);

    // Check cache for GET requests
    if (method === 'GET' && config.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check rate limiting
    if (!this.rateLimiter.canMakeRequest(endpoint)) {
      const retryAfter = this.rateLimiter.getRetryAfter(endpoint);
      throw new RateLimitError(
        `Rate limit exceeded for ${endpoint}. Try again in ${Math.ceil(retryAfter / 1000)} seconds.`,
        retryAfter
      );
    }

    // Prepare request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeader(),
      ...config.headers,
    };

    // Sanitize request body
    const body = config.body ? JSON.stringify(this.sanitizeRequestData(config.body)) : undefined;

    // Setup abort controller
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      this.abortController?.abort();
    }, config.timeout || this.defaultTimeout);

    try {
      // Record request for rate limiting
      this.rateLimiter.recordRequest(endpoint);

      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: this.abortController.signal,
      });

      clearTimeout(timeoutId);

      // Custom response validation
      if (config.validateResponse && !config.validateResponse(response)) {
        throw new APIError('Response validation failed', response.status);
      }

      // Handle non-JSON responses
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token once
          try {
            await refreshAccessToken();
            // Retry the request with new token
            return this.makeRequest(endpoint, config);
          } catch {
            throw new APIError('Authentication failed', 401, 'UNAUTHORIZED');
          }
        }

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60') * 1000;
          throw new RateLimitError('Rate limit exceeded', retryAfter);
        }

        throw new APIError(
          (data as any)?.message || `HTTP ${response.status}`,
          response.status,
          (data as any)?.code
        );
      }

      const result: APIResponse<T> = {
        data,
        status: response.status,
        headers: response.headers,
        success: true,
      };

      // Cache successful GET requests
      if (method === 'GET' && config.cache !== false) {
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }

      if (error instanceof APIError || error instanceof RateLimitError) {
        throw error;
      }

      throw new NetworkError('Network request failed', error);
    }
  }

  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<APIResponse<T>> {
    const retries = config.retries || 3;
    const retryDelay = config.retryDelay || 1000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.makeRequest<T>(endpoint, config);
      } catch (error) {
        // Don't retry on client errors (4xx) except 429
        if (
          error instanceof APIError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          throw error;
        }

        // Handle rate limiting
        if (error instanceof RateLimitError) {
          await this.sleep(error.retryAfter || retryDelay);
          continue;
        }

        // Exponential backoff for other errors
        const delay = retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw new NetworkError('Max retries exceeded');
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  async delete<T = any>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Upload file with progress
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              data,
              status: xhr.status,
              headers: new Headers(),
              success: true,
            });
          } else {
            reject(new APIError(data.message || `HTTP ${xhr.status}`, xhr.status));
          }
        } catch (error) {
          reject(new NetworkError('Failed to parse response'));
        }
      };

      xhr.onerror = () => {
        reject(new NetworkError('Upload failed'));
      };

      xhr.open('POST', `${this.baseURL}${endpoint}`);

      // Add auth headers
      const authHeaders = getAuthHeader();
      Object.entries(authHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);
    });
  }

  // Cancel ongoing requests
  cancelRequests(): void {
    this.abortController?.abort();
  }

  // Clear cache
  clearCache(pattern?: string): void {
    if (pattern) {
      this.cache.delete(pattern);
    } else {
      this.cache.clear();
    }
  }

  // Set rate limit for specific endpoint
  setRateLimit(endpoint: string, count: number, windowMs: number): void {
    this.rateLimiter.setLimit(endpoint, count, windowMs);
  }
}

// Create default instance
export const apiClient = new APIClient();

// Export types and classes
export { APIClient, APIError, NetworkError, RateLimitError };
export type { RequestConfig, APIResponse };
