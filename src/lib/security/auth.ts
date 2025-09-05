import { sanitizeText } from './sanitize';

// Types for authentication
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Secure token storage using sessionStorage for sensitive data
const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'user_data';
const CSRF_TOKEN_KEY = 'csrf_token';

/**
 * Generates a random CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets the current CSRF token or generates a new one
 */
export function getCSRFToken(): string {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
}

/**
 * Validates CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return storedToken === token && token.length === 64;
}

/**
 * Securely stores authentication tokens in sessionStorage
 */
export function storeAuthTokens(tokens: AuthTokens): void {
  try {
    const encryptedTokens = btoa(JSON.stringify(tokens));
    sessionStorage.setItem(TOKEN_STORAGE_KEY, encryptedTokens);
  } catch (error) {
    console.error('Failed to store auth tokens:', error);
    throw new Error('Failed to store authentication data');
  }
}

/**
 * Retrieves authentication tokens from sessionStorage
 */
export function getAuthTokens(): AuthTokens | null {
  try {
    const encryptedTokens = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!encryptedTokens) return null;

    const tokens = JSON.parse(atob(encryptedTokens)) as AuthTokens;

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      clearAuthTokens();
      return null;
    }

    return tokens;
  } catch (error) {
    console.error('Failed to retrieve auth tokens:', error);
    clearAuthTokens();
    return null;
  }
}

/**
 * Stores user data securely
 */
export function storeUserData(user: User): void {
  try {
    // Sanitize user data before storing
    const sanitizedUser: User = {
      ...user,
      email: sanitizeText(user.email),
      name: sanitizeText(user.name),
      role: sanitizeText(user.role),
      plan: sanitizeText(user.plan),
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitizedUser));
  } catch (error) {
    console.error('Failed to store user data:', error);
    throw new Error('Failed to store user data');
  }
}

/**
 * Retrieves user data from storage
 */
export function getUserData(): User | null {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (!userData) return null;

    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    clearUserData();
    return null;
  }
}

/**
 * Clears authentication tokens from storage
 */
export function clearAuthTokens(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Clears user data from storage
 */
export function clearUserData(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Performs complete logout, clearing all sensitive data
 */
export function logout(): void {
  clearAuthTokens();
  clearUserData();

  // Clear any other sensitive data
  const sensitiveKeys = ['api_keys', 'billing_info', 'user_preferences'];
  sensitiveKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Redirect to login page
  window.location.href = '/';
}

/**
 * Checks if the current user is authenticated
 */
export function isAuthenticated(): boolean {
  const tokens = getAuthTokens();
  const user = getUserData();
  return !!(tokens && user);
}

/**
 * Gets the authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const tokens = getAuthTokens();
  const csrfToken = getCSRFToken();

  if (!tokens) return {};

  return {
    Authorization: `Bearer ${tokens.accessToken}`,
    'X-CSRF-Token': csrfToken,
  };
}

/**
 * Refreshes the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const tokens = getAuthTokens();
  if (!tokens || !tokens.refreshToken) return null;

  try {
    // This would normally call your refresh token endpoint
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCSRFToken(),
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const newTokens = (await response.json()) as AuthTokens;
    storeAuthTokens(newTokens);
    return newTokens;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return null;
  }
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Password must be at least 8 characters long');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password must contain lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password must contain uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Password must contain numbers');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Password must contain special characters');

  if (password.length >= 12) score += 1;

  const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score = Math.max(0, score - 2);
    feedback.push('Password contains common patterns');
  }

  return {
    isValid: score >= 4,
    score: Math.max(0, Math.min(5, score)),
    feedback,
  };
}

/**
 * Generates a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, byte => charset[byte % charset.length]).join('');
}
