import React from 'react';

interface PWAInstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAUpdateEvent extends Event {
  waiting?: ServiceWorker;
}

interface PWAServiceConfig {
  skipWaitingOnUpdate?: boolean;
  showUpdateNotification?: boolean;
  installPromptDelay?: number;
  enableAnalytics?: boolean;
}

interface InstallPromptData {
  canInstall: boolean;
  installEvent: PWAInstallEvent | null;
  isInstalled: boolean;
  platform: string;
}

interface UpdateData {
  updateAvailable: boolean;
  newWorker: ServiceWorker | null;
  isUpdating: boolean;
}

class PWAService {
  private config: PWAServiceConfig;
  private installPrompt: PWAInstallEvent | null = null;
  private updateWorker: ServiceWorker | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private isInitialized = false;

  private defaultConfig: PWAServiceConfig = {
    skipWaitingOnUpdate: false,
    showUpdateNotification: true,
    installPromptDelay: 3000, // 3 seconds
    enableAnalytics: true,
  };

  constructor(config?: Partial<PWAServiceConfig>) {
    this.config = { ...this.defaultConfig, ...config };
  }

  // Initialize PWA service
  initialize(): void {
    if (this.isInitialized) {
      console.warn('PWA Service already initialized');
      return;
    }

    this.setupInstallPrompt();
    this.setupServiceWorkerUpdates();
    this.setupAppStateDetection();
    this.setupNetworkDetection();
    
    this.isInitialized = true;
    console.log('PWA Service initialized');
  }

  // Install Prompt Management
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      const installEvent = event as PWAInstallEvent;
      
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      installEvent.preventDefault();
      
      // Stash the event so it can be triggered later
      this.installPrompt = installEvent;
      
      this.emit('installPromptAvailable', {
        canInstall: true,
        installEvent,
        isInstalled: this.isAppInstalled(),
        platform: this.getPlatform(),
      });

      if (this.config.enableAnalytics) {
        this.trackEvent('install_prompt_available');
      }
    });

    // Detect if app was successfully installed
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      
      this.emit('appInstalled', {
        timestamp: Date.now(),
        platform: this.getPlatform(),
      });

      if (this.config.enableAnalytics) {
        this.trackEvent('app_installed');
      }
    });
  }

  // Service Worker Update Management
  private setupServiceWorkerUpdates(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // A new service worker has taken control
        this.emit('appUpdated');
        
        if (this.config.enableAnalytics) {
          this.trackEvent('app_updated');
        }
      });

      // Listen for updates from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          this.updateWorker = event.data.newWorker;
          
          this.emit('updateAvailable', {
            updateAvailable: true,
            newWorker: this.updateWorker,
            isUpdating: false,
          });

          if (this.config.showUpdateNotification) {
            this.showUpdateNotification();
          }
        }
      });
    }
  }

  // App State Detection
  private setupAppStateDetection(): void {
    // Detect if running as installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      this.emit('runningAsApp', { standalone: true });
      document.body.classList.add('pwa-standalone');
    }

    // Detect display mode changes
    if ('matchMedia' in window) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', (event) => {
        this.emit('displayModeChanged', { 
          standalone: event.matches,
          displayMode: this.getDisplayMode(),
        });
      });
    }
  }

  // Network Detection
  private setupNetworkDetection(): void {
    // Online/Offline detection
    window.addEventListener('online', () => {
      this.emit('networkStateChanged', { 
        online: true,
        connectionType: this.getConnectionType(),
      });
    });

    window.addEventListener('offline', () => {
      this.emit('networkStateChanged', { 
        online: false,
        connectionType: 'none',
      });
    });

    // Connection quality detection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        this.emit('connectionChanged', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      });
    }
  }

  // Installation Methods
  async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      // Show the install prompt
      await this.installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.installPrompt.userChoice;
      
      this.emit('installPromptResult', {
        outcome,
        platform: this.getPlatform(),
        timestamp: Date.now(),
      });

      if (this.config.enableAnalytics) {
        this.trackEvent('install_prompt_result', { outcome });
      }

      // Clear the prompt
      this.installPrompt = null;
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Failed to show install prompt:', error);
      return false;
    }
  }

  canInstall(): boolean {
    return this.installPrompt !== null;
  }

  isAppInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
  }

  // Update Methods
  async applyUpdate(): Promise<void> {
    if (!this.updateWorker) {
      console.warn('No service worker update available');
      return;
    }

    try {
      this.emit('updateStarted');
      
      // Tell the new service worker to skip waiting
      this.updateWorker.postMessage({ type: 'SKIP_WAITING' });
      
      if (this.config.enableAnalytics) {
        this.trackEvent('app_update_applied');
      }
    } catch (error) {
      console.error('Failed to apply update:', error);
      this.emit('updateError', error);
    }
  }

  private showUpdateNotification(): void {
    // This would typically show a toast or modal
    // For now, we'll just emit an event
    this.emit('showUpdateNotification', {
      message: 'A new version is available',
      action: 'Refresh to update',
    });
  }

  // Share API
  async share(data: { title?: string; text?: string; url?: string; files?: File[] }): Promise<boolean> {
    if (!('share' in navigator)) {
      console.warn('Web Share API not supported');
      return false;
    }

    try {
      await (navigator as any).share(data);
      
      if (this.config.enableAnalytics) {
        this.trackEvent('content_shared', { 
          hasTitle: !!data.title,
          hasText: !!data.text,
          hasUrl: !!data.url,
          hasFiles: !!data.files?.length,
        });
      }
      
      return true;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }

  canShare(): boolean {
    return 'share' in navigator;
  }

  // Badge API
  setBadge(count?: number): void {
    if ('setAppBadge' in navigator) {
      (navigator as any).setAppBadge(count);
      
      if (this.config.enableAnalytics) {
        this.trackEvent('badge_set', { count });
      }
    }
  }

  clearBadge(): void {
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge();
      
      if (this.config.enableAnalytics) {
        this.trackEvent('badge_cleared');
      }
    }
  }

  // Utility Methods
  getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('windows')) return 'windows';
    if (userAgent.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  getDisplayMode(): string {
    if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
    if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
    if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
    return 'browser';
  }

  getConnectionType(): string {
    if (!navigator.onLine) return 'none';
    
    const connection = (navigator as any).connection;
    if (connection) {
      return connection.effectiveType || 'unknown';
    }
    
    return 'unknown';
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  // Feature Detection
  getCapabilities(): {
    canInstall: boolean;
    isInstalled: boolean;
    canShare: boolean;
    hasBadging: boolean;
    hasNotifications: boolean;
    hasBackgroundSync: boolean;
    hasPeriodicBackgroundSync: boolean;
  } {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isAppInstalled(),
      canShare: this.canShare(),
      hasBadging: 'setAppBadge' in navigator,
      hasNotifications: 'Notification' in window,
      hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      hasPeriodicBackgroundSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype,
    };
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in PWA event listener:', error);
        }
      });
    }
  }

  // Analytics
  private trackEvent(event: string, data?: any): void {
    // Integration with analytics service
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(`pwa_${event}`, data);
    }
  }
}

// Create singleton instance
export const pwaService = new PWAService();

// React Hook for PWA functionality
export function usePWA() {
  const [installPrompt, setInstallPrompt] = React.useState<InstallPromptData>({
    canInstall: false,
    installEvent: null,
    isInstalled: pwaService.isAppInstalled(),
    platform: pwaService.getPlatform(),
  });

  const [updateData, setUpdateData] = React.useState<UpdateData>({
    updateAvailable: false,
    newWorker: null,
    isUpdating: false,
  });

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    // Initialize PWA service
    pwaService.initialize();

    // Set up event listeners
    const handleInstallPrompt = (data: InstallPromptData) => {
      setInstallPrompt(data);
    };

    const handleUpdateAvailable = (data: UpdateData) => {
      setUpdateData(data);
    };

    const handleNetworkChange = (data: { online: boolean }) => {
      setIsOnline(data.online);
    };

    pwaService.on('installPromptAvailable', handleInstallPrompt);
    pwaService.on('updateAvailable', handleUpdateAvailable);
    pwaService.on('networkStateChanged', handleNetworkChange);

    return () => {
      pwaService.off('installPromptAvailable', handleInstallPrompt);
      pwaService.off('updateAvailable', handleUpdateAvailable);
      pwaService.off('networkStateChanged', handleNetworkChange);
    };
  }, []);

  const install = React.useCallback(async () => {
    return await pwaService.showInstallPrompt();
  }, []);

  const update = React.useCallback(async () => {
    setUpdateData(prev => ({ ...prev, isUpdating: true }));
    await pwaService.applyUpdate();
  }, []);

  const share = React.useCallback(async (data: { title?: string; text?: string; url?: string }) => {
    return await pwaService.share(data);
  }, []);

  return {
    installPrompt,
    updateData,
    isOnline,
    install,
    update,
    share,
    capabilities: pwaService.getCapabilities(),
    platform: pwaService.getPlatform(),
    displayMode: pwaService.getDisplayMode(),
    pwaService,
  };
}

export default pwaService; 