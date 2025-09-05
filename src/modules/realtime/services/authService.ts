export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
  user_id: string;
  permissions: string[];
}

export interface AuthConfig {
  baseUrl: string;
  clientId?: string;
}

class AuthService {
  private baseUrl: string;
  private token: AuthToken | null = null;
  private refreshTimer: number | null = null;

  constructor(config: AuthConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.loadTokenFromStorage();
  }

  /**
   * Create a guest token for anonymous real-time transcription
   */
  async createGuestToken(language: string = 'en', script?: string): Promise<string> {
    try {
      // For demo purposes, create a guest user token
      // In production, this would be an API call to your auth endpoint
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Mock token creation - in real app you'd call your backend auth endpoint
      const mockToken: AuthToken = {
        access_token: this.generateMockJWT(guestId, language, script),
        token_type: 'Bearer',
        expires_in: 3600, // 1 hour
        user_id: guestId,
        permissions: ['realtime_transcription']
      };

      this.token = mockToken;
      this.saveTokenToStorage();
      this.scheduleTokenRefresh();

      return mockToken.access_token;
    } catch (error) {
      console.error('Failed to create guest token:', error);
      throw new Error('Failed to authenticate. Please try again.');
    }
  }

  /**
   * Generate a mock JWT token for development/demo
   * In production, this would be handled by your backend auth service
   */
  private generateMockJWT(userId: string, language: string, script?: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      jti: `${userId}_${Date.now()}`,
      type: 'access',
      permissions: ['realtime_transcription'],
      rate_limits: {
        requests_per_minute: 60,
        concurrent_connections: 5,
        max_session_duration: 3600
      },
      session_data: {
        language,
        script,
        session_type: 'realtime'
      }
    };

    // Base64 encode without padding issues
    const base64UrlEncode = (obj: any) => {
      return btoa(JSON.stringify(obj))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const headerEncoded = base64UrlEncode(header);
    const payloadEncoded = base64UrlEncode(payload);
    
    // Mock signature (in production this would be properly signed by the backend)
    const signature = base64UrlEncode({ mock: `signature_${Date.now()}` });
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (!this.token) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      return null;
    }

    return this.token.access_token;
  }

  /**
   * Check if current token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(this.token.access_token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string | null> {
    if (!this.token?.refresh_token) {
      return null;
    }

    try {
      // In production, you would call your backend refresh endpoint
      // For now, create a new guest token
      const payload = JSON.parse(atob(this.token.access_token.split('.')[1]));
      return await this.createGuestToken(
        payload.session_data?.language || 'en',
        payload.session_data?.script
      );
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearToken();
      return null;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.token) return;

    // Refresh 5 minutes before expiry
    const refreshTime = (this.token.expires_in - 300) * 1000;
    
    this.refreshTimer = window.setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Auto refresh failed:', error);
      }
    }, refreshTime);
  }

  /**
   * Clear current token and cleanup
   */
  clearToken(): void {
    this.token = null;
    this.clearTokenFromStorage();
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Save token to localStorage
   */
  private saveTokenToStorage(): void {
    if (this.token) {
      localStorage.setItem('auth_token', JSON.stringify(this.token));
    }
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_token');
      if (stored) {
        const token = JSON.parse(stored);
        if (!this.isTokenExpiredStatic(token)) {
          this.token = token;
          this.scheduleTokenRefresh();
        } else {
          this.clearTokenFromStorage();
        }
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
      this.clearTokenFromStorage();
    }
  }

  /**
   * Clear token from localStorage
   */
  private clearTokenFromStorage(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Check if a token object is expired
   */
  private isTokenExpiredStatic(token: AuthToken): boolean {
    try {
      const payload = JSON.parse(atob(token.access_token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Get user info from current token
   */
  getUserInfo(): { userId: string; permissions: string[] } | null {
    if (!this.token) return null;

    try {
      const payload = JSON.parse(atob(this.token.access_token.split('.')[1]));
      return {
        userId: payload.sub,
        permissions: payload.permissions || []
      };
    } catch {
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.permissions.includes(permission) || false;
  }
}

// Create singleton instance
const authService = new AuthService({
  baseUrl: (window as any).REACT_APP_API_URL || 'http://localhost:8000'
});

export default authService; 