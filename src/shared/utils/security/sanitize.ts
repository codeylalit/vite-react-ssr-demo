import DOMPurify from 'dompurify';

// Configuration for different sanitization levels
const SANITIZE_CONFIG = {
  strict: {
    ALLOWED_TAGS: [] as string[],
    ALLOWED_ATTR: [] as string[],
    ALLOW_DATA_ATTR: false,
  },
  moderate: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'] as string[],
    ALLOWED_ATTR: [] as string[],
    ALLOW_DATA_ATTR: false,
  },
  lenient: {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'u',
      'br',
      'p',
      'ul',
      'ol',
      'li',
      'a',
      'span',
    ] as string[],
    ALLOWED_ATTR: ['href', 'title', 'target'] as string[],
    ALLOW_DATA_ATTR: false,
  },
};

export type SanitizeLevel = keyof typeof SANITIZE_CONFIG;

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param level - The sanitization level (strict, moderate, lenient)
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string, level: SanitizeLevel = 'strict'): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, SANITIZE_CONFIG[level]);
}

/**
 * Sanitizes plain text by stripping all HTML tags
 * @param input - The input string to sanitize
 * @returns Plain text string
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitizes URLs to prevent javascript: and data: URIs
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove dangerous protocols
  const sanitized = url.replace(/^(javascript|data|vbscript):/i, '');

  // Validate URL format
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    // If not a valid absolute URL, check if it's a valid relative URL
    if (sanitized.startsWith('/') || sanitized.startsWith('./') || sanitized.startsWith('../')) {
      return sanitized;
    }
    return '';
  }
}

/**
 * Escapes special characters for use in HTML attributes
 * @param input - The input string to escape
 * @returns Escaped string
 */
export function escapeHtmlAttribute(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sanitizes form data by applying appropriate sanitization to each field
 * @param data - Object containing form data
 * @param fieldConfig - Configuration for each field's sanitization level
 * @returns Sanitized form data
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  fieldConfig: Partial<Record<keyof T, SanitizeLevel>> = {}
): T {
  const sanitized = { ...data };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      const level = fieldConfig[key as keyof T] || 'strict';
      sanitized[key as keyof T] = sanitizeHtml(value, level) as T[keyof T];
    }
  }

  return sanitized;
}

/**
 * Validates and sanitizes email addresses
 * @param email - Email address to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const sanitized = sanitizeText(email).toLowerCase().trim();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes phone numbers by removing non-digit characters except + and -
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/[^\d+\-().\s]/g, '').trim();
}
