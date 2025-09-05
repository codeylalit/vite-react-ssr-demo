/**
 * Content Security Policy configuration
 * This helps prevent XSS attacks by controlling which resources can be loaded
 */

export interface CSPConfig {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'media-src': string[];
  'object-src': string[];
  'frame-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'manifest-src': string[];
  'worker-src': string[];
}

// Development CSP - more permissive for hot reloading
const developmentCSP: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Needed for Vite HMR in dev
    "'unsafe-eval'", // Needed for Vite HMR in dev
    'localhost:*',
    'ws://localhost:*',
    'ws://127.0.0.1:*',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Needed for CSS-in-JS and Tailwind
    'fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:', // For base64 images
    'blob:', // For dynamically generated images
    'https:', // Allow all HTTPS images
  ],
  'connect-src': [
    "'self'",
    'localhost:*',
    'ws://localhost:*',
    'ws://127.0.0.1:*',
    'https://api.example.com', // Replace with your API domain
  ],
  'font-src': ["'self'", 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com'],
  'media-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'manifest-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
};

// Production CSP - more restrictive
const productionCSP: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    // Add your CDN domains here if needed
    // 'https://cdn.example.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Unfortunately needed for Tailwind CSS
    'fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:', // You might want to restrict this to specific domains
  ],
  'connect-src': [
    "'self'",
    'https://api.example.com', // Replace with your API domain
    'https://analytics.google.com', // If using Google Analytics
    'https://sentry.io', // If using Sentry for error tracking
  ],
  'font-src': ["'self'", 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com'],
  'media-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'manifest-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
};

/**
 * Generates a CSP string from the configuration object
 */
export function generateCSPString(config: CSPConfig): string {
  return Object.entries(config)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Gets the appropriate CSP configuration based on environment
 */
export function getCSPConfig(): CSPConfig {
  return process.env.NODE_ENV === 'production' ? productionCSP : developmentCSP;
}

/**
 * Gets the CSP header value for the current environment
 */
export function getCSPHeader(): string {
  return generateCSPString(getCSPConfig());
}

/**
 * Applies CSP via meta tag (fallback for SPA)
 */
export function applyCSPViaMeta(): void {
  // Check if CSP meta tag already exists
  let cspMeta = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  ) as HTMLMetaElement;

  if (!cspMeta) {
    cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    document.head.appendChild(cspMeta);
  }

  cspMeta.content = getCSPHeader();
}

/**
 * Generates a nonce for inline scripts (if needed)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Security headers configuration for additional protection
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
} as const;

/**
 * Validates if a URL is allowed by the current CSP
 */
export function isURLAllowedByCSP(url: string, directive: keyof CSPConfig): boolean {
  const config = getCSPConfig();
  const sources = config[directive] || [];

  try {
    const urlObj = new URL(url);

    // Check against each source in the directive
    return sources.some(source => {
      if (source === "'self'") {
        return urlObj.origin === window.location.origin;
      }
      if (source === "'none'") {
        return false;
      }
      if (source === 'data:') {
        return url.startsWith('data:');
      }
      if (source === 'blob:') {
        return url.startsWith('blob:');
      }
      if (source === 'https:') {
        return urlObj.protocol === 'https:';
      }
      if (source.includes('*')) {
        // Simple wildcard matching
        const pattern = source.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(url);
      }

      // Exact domain match
      return urlObj.hostname === source || url.startsWith(source);
    });
  } catch {
    return false;
  }
}

/**
 * Reports CSP violations (for monitoring)
 */
export function setupCSPReporting(): void {
  document.addEventListener('securitypolicyviolation', event => {
    const violation = {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      disposition: event.disposition,
      documentURI: event.documentURI,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      timestamp: Date.now(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('CSP Violation:', violation);
    }

    // In production, send to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to your error tracking service
      fetch('/api/csp-violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation),
      }).catch(error => {
        console.error('Failed to report CSP violation:', error);
      });
    }
  });
}
