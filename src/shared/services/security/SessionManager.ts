import { rateLimiter } from './RateLimiter';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  userAgent: string;
  ip?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  lastActive: number;
  trusted: boolean;
}

interface Session {
  id: string;
  userId: string;
  deviceId: string;
  token: string;
  refreshToken: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  active: boolean;
  ipAddress?: string;
  userAgent: string;
}

interface SecurityEvent {
  id: string;
  userId: string;
  sessionId: string;
  type: 'login' | 'logout' | 'suspicious_activity' | 'device_change' | 'token_refresh' | 'session_expired';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: number;
  resolved: boolean;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private devices: Map<string, DeviceInfo> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REFRESH_TOKEN_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_SESSIONS_PER_USER = 5;
  private readonly MAX_SECURITY_EVENTS = 1000;

  constructor() {
    this.startActivityMonitoring();
    this.loadFromStorage();
  }

  // Device Detection and Management
  async detectDevice(): Promise<DeviceInfo> {
    const userAgent = navigator.userAgent;
    const deviceId = this.generateDeviceId();
    
    const deviceInfo: DeviceInfo = {
      id: deviceId,
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      userAgent,
      lastActive: Date.now(),
      trusted: false,
    };

    // Try to get location info (requires permission)
    try {
      const position = await this.getCurrentPosition();
      const location = await this.getLocationFromCoords(position.coords);
      deviceInfo.location = location;
    } catch (error) {
      // Location not available or permission denied
      console.debug('Location detection failed:', error);
    }

    this.devices.set(deviceId, deviceInfo);
    this.saveToStorage();

    return deviceInfo;
  }

  private generateDeviceId(): string {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('device_id');
    
    if (!deviceId) {
      // Generate new device fingerprint
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
      }
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
        navigator.hardwareConcurrency || 'unknown',
        navigator.maxTouchPoints || 0,
      ].join('|');
      
      deviceId = this.hashString(fingerprint);
      localStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
  }

  private getDeviceName(): string {
    const userAgent = navigator.userAgent;
    
    // Mobile devices
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Android/i.test(userAgent)) {
      const match = userAgent.match(/Android.*?;\s*([^)]+)/);
      return match ? match[1].trim() : 'Android Device';
    }
    
    // Desktop browsers
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return 'Chrome Browser';
    if (/Firefox/i.test(userAgent)) return 'Firefox Browser';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari Browser';
    if (/Edge/i.test(userAgent)) return 'Edge Browser';
    
    return 'Unknown Device';
  }

  private getDeviceType(): DeviceInfo['type'] {
    const userAgent = navigator.userAgent;
    
    if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) return 'mobile';
    if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
    if (/Desktop|Windows|Macintosh|Linux/i.test(userAgent)) return 'desktop';
    
    return 'unknown';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) {
      const match = userAgent.match(/Chrome\/([0-9.]+)/);
      return `Chrome ${match ? match[1] : 'Unknown'}`;
    }
    if (/Firefox/i.test(userAgent)) {
      const match = userAgent.match(/Firefox\/([0-9.]+)/);
      return `Firefox ${match ? match[1] : 'Unknown'}`;
    }
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      const match = userAgent.match(/Version\/([0-9.]+)/);
      return `Safari ${match ? match[1] : 'Unknown'}`;
    }
    if (/Edge/i.test(userAgent)) {
      const match = userAgent.match(/Edge\/([0-9.]+)/);
      return `Edge ${match ? match[1] : 'Unknown'}`;
    }
    
    return 'Unknown Browser';
  }

  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    
    if (/Windows NT/i.test(userAgent)) {
      const match = userAgent.match(/Windows NT ([0-9.]+)/);
      return `Windows ${match ? match[1] : 'Unknown'}`;
    }
    if (/Mac OS X/i.test(userAgent)) {
      const match = userAgent.match(/Mac OS X ([0-9_.]+)/);
      return `macOS ${match ? match[1].replace(/_/g, '.') : 'Unknown'}`;
    }
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) {
      const match = userAgent.match(/Android ([0-9.]+)/);
      return `Android ${match ? match[1] : 'Unknown'}`;
    }
    if (/iPhone|iPad/i.test(userAgent)) {
      const match = userAgent.match(/OS ([0-9_]+)/);
      return `iOS ${match ? match[1].replace(/_/g, '.') : 'Unknown'}`;
    }
    
    return 'Unknown OS';
  }

  private async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        enableHighAccuracy: false,
      });
    });
  }

  private async getLocationFromCoords(coords: GeolocationCoordinates): Promise<DeviceInfo['location']> {
    // In a real app, you'd use a geolocation API
    // For now, we'll just get timezone
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // Session Management
  async createSession(userId: string, token: string, refreshToken: string): Promise<Session> {
    const deviceInfo = await this.detectDevice();
    const sessionId = this.generateSessionId();
    const now = Date.now();
    
    const session: Session = {
      id: sessionId,
      userId,
      deviceId: deviceInfo.id,
      token,
      refreshToken,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + this.SESSION_TIMEOUT,
      active: true,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    // Check for too many sessions
    const userSessions = this.getUserSessions(userId);
    if (userSessions.length >= this.MAX_SESSIONS_PER_USER) {
      // Remove oldest session
      const oldestSession = userSessions.sort((a, b) => a.lastActivity - b.lastActivity)[0];
      this.terminateSession(oldestSession.id);
      
      this.logSecurityEvent({
        userId,
        sessionId,
        type: 'suspicious_activity',
        severity: 'medium',
        details: {
          reason: 'Too many active sessions',
          action: 'Oldest session terminated',
          sessionCount: userSessions.length,
        },
      });
    }

    this.sessions.set(sessionId, session);
    this.saveToStorage();

    this.logSecurityEvent({
      userId,
      sessionId,
      type: 'login',
      severity: 'low',
      details: {
        deviceInfo,
        timestamp: now,
      },
    });

    return session;
  }

  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.active) {
      return null;
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.terminateSession(sessionId);
      return null;
    }
    
    return session;
  }

  updateSessionActivity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.active) {
      return false;
    }
    
    session.lastActivity = Date.now();
    this.sessions.set(sessionId, session);
    
    // Update device activity
    const device = this.devices.get(session.deviceId);
    if (device) {
      device.lastActive = Date.now();
      this.devices.set(session.deviceId, device);
    }
    
    this.saveToStorage();
    return true;
  }

  async refreshSession(sessionId: string, newToken: string, newRefreshToken: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.active) {
      return false;
    }
    
    const now = Date.now();
    
    session.token = newToken;
    session.refreshToken = newRefreshToken;
    session.lastActivity = now;
    session.expiresAt = now + this.SESSION_TIMEOUT;
    
    this.sessions.set(sessionId, session);
    this.saveToStorage();
    
    this.logSecurityEvent({
      userId: session.userId,
      sessionId,
      type: 'token_refresh',
      severity: 'low',
      details: {
        timestamp: now,
      },
    });
    
    return true;
  }

  terminateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return false;
    }
    
    session.active = false;
    this.sessions.set(sessionId, session);
    
    this.logSecurityEvent({
      userId: session.userId,
      sessionId,
      type: 'logout',
      severity: 'low',
      details: {
        timestamp: Date.now(),
        reason: 'Manual logout',
      },
    });
    
    this.saveToStorage();
    return true;
  }

  terminateAllUserSessions(userId: string, exceptSessionId?: string): number {
    const sessions = this.getUserSessions(userId);
    let terminated = 0;
    
    sessions.forEach(session => {
      if (session.id !== exceptSessionId) {
        this.terminateSession(session.id);
        terminated++;
      }
    });
    
    if (terminated > 0) {
      this.logSecurityEvent({
        userId,
        sessionId: exceptSessionId || 'unknown',
        type: 'logout',
        severity: 'medium',
        details: {
          reason: 'All sessions terminated',
          count: terminated,
          timestamp: Date.now(),
        },
      });
    }
    
    return terminated;
  }

  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(
      session => session.userId === userId && session.active
    );
  }

  // Device Management
  trustDevice(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    
    if (!device) {
      return false;
    }
    
    device.trusted = true;
    this.devices.set(deviceId, device);
    this.saveToStorage();
    
    return true;
  }

  isDeviceTrusted(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    return device ? device.trusted : false;
  }

  getUserDevices(userId: string): DeviceInfo[] {
    const userSessions = this.getUserSessions(userId);
    const deviceIds = [...new Set(userSessions.map(session => session.deviceId))];
    
    return deviceIds
      .map(deviceId => this.devices.get(deviceId))
      .filter((device): device is DeviceInfo => device !== undefined);
  }

  // Security Monitoring
  private logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      resolved: false,
      ...event,
    };
    
    this.securityEvents.push(securityEvent);
    
    // Keep only recent events
    if (this.securityEvents.length > this.MAX_SECURITY_EVENTS) {
      this.securityEvents = this.securityEvents.slice(-this.MAX_SECURITY_EVENTS);
    }
    
    // Log to console for debugging
    console.log(`Security Event [${event.severity.toUpperCase()}]:`, securityEvent);
    
    // In a real app, you'd send this to your backend
    this.saveToStorage();
  }

  detectSuspiciousActivity(userId: string, sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    const device = this.devices.get(session.deviceId);
    if (!device) return false;
    
    let suspicious = false;
    const reasons: string[] = [];
    
    // Check for rapid IP changes
    const recentSessions = this.getUserSessions(userId)
      .filter(s => Date.now() - s.lastActivity < 60 * 60 * 1000) // Last hour
      .map(s => s.ipAddress)
      .filter((ip, index, arr) => arr.indexOf(ip) === index);
    
    if (recentSessions.length > 3) {
      suspicious = true;
      reasons.push('Multiple IP addresses in short time');
    }
    
    // Check for unusual login times
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      const recentLogins = this.securityEvents
        .filter(event => 
          event.userId === userId && 
          event.type === 'login' &&
          Date.now() - event.timestamp < 7 * 24 * 60 * 60 * 1000 // Last week
        );
      
      const unusualHourLogins = recentLogins.filter(event => {
        const loginHour = new Date(event.timestamp).getHours();
        return loginHour < 6 || loginHour > 22;
      });
      
      if (unusualHourLogins.length === 0) {
        suspicious = true;
        reasons.push('Unusual login time');
      }
    }
    
    if (suspicious) {
      this.logSecurityEvent({
        userId,
        sessionId,
        type: 'suspicious_activity',
        severity: 'high',
        details: {
          reasons,
          deviceInfo: device,
          timestamp: Date.now(),
        },
      });
    }
    
    return suspicious;
  }

  getSecurityEvents(userId: string, limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .filter(event => event.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Activity Monitoring
  private startActivityMonitoring(): void {
    setInterval(() => {
      this.checkExpiredSessions();
      this.detectInactiveSessions();
    }, this.ACTIVITY_CHECK_INTERVAL);
    
    // Listen for user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        const currentSessionId = localStorage.getItem('session_id');
        if (currentSessionId) {
          this.updateSessionActivity(currentSessionId);
        }
      }, { passive: true });
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const currentSessionId = localStorage.getItem('session_id');
        if (currentSessionId) {
          this.updateSessionActivity(currentSessionId);
        }
      }
    });
  }

  private checkExpiredSessions(): void {
    const now = Date.now();
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.active && now > session.expiresAt) {
        session.active = false;
        this.sessions.set(sessionId, session);
        
        this.logSecurityEvent({
          userId: session.userId,
          sessionId,
          type: 'session_expired',
          severity: 'low',
          details: {
            expiredAt: session.expiresAt,
            currentTime: now,
          },
        });
      }
    }
    
    this.saveToStorage();
  }

  private detectInactiveSessions(): void {
    const now = Date.now();
    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.active && now - session.lastActivity > inactivityThreshold) {
        // Don't automatically terminate, but log for monitoring
        this.logSecurityEvent({
          userId: session.userId,
          sessionId,
          type: 'suspicious_activity',
          severity: 'low',
          details: {
            reason: 'Long period of inactivity',
            lastActivity: session.lastActivity,
            inactiveFor: now - session.lastActivity,
          },
        });
      }
    }
  }

  // Storage Management
  private saveToStorage(): void {
    try {
      const data = {
        sessions: Array.from(this.sessions.entries()),
        devices: Array.from(this.devices.entries()),
        securityEvents: this.securityEvents.slice(-100), // Keep only recent events
      };
      
      localStorage.setItem('session_manager_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('session_manager_data');
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      this.sessions = new Map(parsed.sessions || []);
      this.devices = new Map(parsed.devices || []);
      this.securityEvents = parsed.securityEvents || [];
      
      // Clean up expired sessions on load
      this.checkExpiredSessions();
    } catch (error) {
      console.error('Failed to load session data:', error);
    }
  }

  // Utility Methods
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private generateSessionId(): string {
    return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateEventId(): string {
    return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real app, you'd get this from your backend
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

export default sessionManager; 