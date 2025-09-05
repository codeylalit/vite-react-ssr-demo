import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Theme Configuration
export interface ThemeConfig {
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'system';
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: boolean;
  shadows: boolean;
  blur: boolean;
}

// Dashboard Preferences
export interface DashboardPreferences {
  layout: 'grid' | 'list' | 'kanban';
  gridColumns: 1 | 2 | 3 | 4 | 6 | 12;
  showWelcomeMessage: boolean;
  defaultView: 'overview' | 'analytics' | 'usage' | 'api-keys';
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  enableNotifications: boolean;
  compactMode: boolean;
  showSidebar: boolean;
  sidebarCollapsed: boolean;
  widgetOrder: string[];
  pinnedWidgets: string[];
}

// Language and Localization
export interface LocalizationPreferences {
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';
  timeFormat: '12h' | '24h';
  numberFormat: 'US' | 'EU' | 'IN';
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';
}

// Accessibility Preferences
export interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  focusIndicators: boolean;
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  textSpacing: 'normal' | 'increased' | 'wide';
}

// Privacy and Security
export interface PrivacyPreferences {
  analyticsEnabled: boolean;
  crashReporting: boolean;
  usageTracking: boolean;
  personalization: boolean;
  locationSharing: boolean;
  cookiePreferences: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    advertising: boolean;
  };
  dataRetention: '30d' | '90d' | '1y' | 'forever';
}

// Notification Preferences
export interface NotificationPreferences {
  enabled: boolean;
  types: {
    system: boolean;
    updates: boolean;
    usage: boolean;
    billing: boolean;
    security: boolean;
    marketing: boolean;
  };
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
}

// Complete User Preferences Interface
export interface UserPreferences {
  theme: ThemeConfig;
  dashboard: DashboardPreferences;
  localization: LocalizationPreferences;
  accessibility: AccessibilityPreferences;
  privacy: PrivacyPreferences;
  notifications: NotificationPreferences;
  version: string;
  lastUpdated: number;
}

// Default Preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: {
    colorScheme: 'auto',
    primaryColor: '#2d4cc8',
    accentColor: '#4c7cf0',
    borderRadius: 'md',
    fontFamily: 'inter',
    fontSize: 'base',
    density: 'comfortable',
    animations: true,
    shadows: true,
    blur: true,
  },
  dashboard: {
    layout: 'grid',
    gridColumns: 3,
    showWelcomeMessage: true,
    defaultView: 'overview',
    autoRefresh: true,
    refreshInterval: 30,
    enableNotifications: true,
    compactMode: false,
    showSidebar: true,
    sidebarCollapsed: false,
    widgetOrder: [],
    pinnedWidgets: [],
  },
  localization: {
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: 'US',
    currency: 'USD',
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    keyboardNavigation: false,
    screenReader: false,
    focusIndicators: true,
    colorBlindnessMode: 'none',
    textSpacing: 'normal',
  },
  privacy: {
    analyticsEnabled: true,
    crashReporting: true,
    usageTracking: true,
    personalization: true,
    locationSharing: false,
    cookiePreferences: {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: false,
    },
    dataRetention: '1y',
  },
  notifications: {
    enabled: true,
    types: {
      system: true,
      updates: true,
      usage: true,
      billing: true,
      security: true,
      marketing: false,
    },
    channels: {
      inApp: true,
      email: true,
      push: false,
      sms: false,
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  },
  version: '1.0.0',
  lastUpdated: Date.now(),
};

// Zustand Store
interface UserPreferencesStore {
  preferences: UserPreferences;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Actions
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateDashboard: (dashboard: Partial<DashboardPreferences>) => void;
  updateLocalization: (localization: Partial<LocalizationPreferences>) => void;
  updateAccessibility: (accessibility: Partial<AccessibilityPreferences>) => void;
  updatePrivacy: (privacy: Partial<PrivacyPreferences>) => void;
  updateNotifications: (notifications: Partial<NotificationPreferences>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => Promise<boolean>;
  syncPreferences: () => Promise<void>;
  applyThemeToDOM: () => void;
  applyAccessibilityToDOM: () => void;
}

export const useUserPreferences = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,
      isLoading: false,
      hasUnsavedChanges: false,

      updateTheme: (theme) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme: { ...state.preferences.theme, ...theme },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
        
        // Apply theme changes immediately
        get().applyThemeToDOM();
      },

      updateDashboard: (dashboard) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            dashboard: { ...state.preferences.dashboard, ...dashboard },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
      },

      updateLocalization: (localization) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            localization: { ...state.preferences.localization, ...localization },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
      },

      updateAccessibility: (accessibility) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            accessibility: { ...state.preferences.accessibility, ...accessibility },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
        
        // Apply accessibility changes immediately
        get().applyAccessibilityToDOM();
      },

      updatePrivacy: (privacy) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            privacy: { ...state.preferences.privacy, ...privacy },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
      },

      updateNotifications: (notifications) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: { ...state.preferences.notifications, ...notifications },
            lastUpdated: Date.now(),
          },
          hasUnsavedChanges: true,
        }));
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences, lastUpdated: Date.now() },
          hasUnsavedChanges: true,
        }));
      },

      resetPreferences: () => {
        set({
          preferences: { ...DEFAULT_PREFERENCES, lastUpdated: Date.now() },
          hasUnsavedChanges: true,
        });
        
        // Apply defaults to DOM
        get().applyThemeToDOM();
        get().applyAccessibilityToDOM();
      },

      exportPreferences: () => {
        const { preferences } = get();
        return JSON.stringify(preferences, null, 2);
      },

      importPreferences: async (data) => {
        try {
          const imported = JSON.parse(data) as UserPreferences;
          
          // Validate the imported data
          if (imported && typeof imported === 'object' && imported.version) {
            set({
              preferences: { ...imported, lastUpdated: Date.now() },
              hasUnsavedChanges: true,
            });
            
            // Apply imported settings
            get().applyThemeToDOM();
            get().applyAccessibilityToDOM();
            
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to import preferences:', error);
          return false;
        }
      },

      syncPreferences: async () => {
        set({ isLoading: true });
        
        try {
          // In a real app, this would sync with the backend
          // For now, we'll just simulate a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ hasUnsavedChanges: false });
        } catch (error) {
          console.error('Failed to sync preferences:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      applyThemeToDOM: () => {
        const { theme } = get().preferences;
        const root = document.documentElement;
        
        // Apply color scheme
        if (theme.colorScheme === 'dark') {
          root.classList.add('dark');
        } else if (theme.colorScheme === 'light') {
          root.classList.remove('dark');
        } else {
          // Auto mode - check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.toggle('dark', prefersDark);
        }
        
        // Apply custom properties
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        root.style.setProperty('--border-radius', 
          theme.borderRadius === 'none' ? '0' :
          theme.borderRadius === 'sm' ? '0.125rem' :
          theme.borderRadius === 'md' ? '0.375rem' :
          theme.borderRadius === 'lg' ? '0.5rem' : '0.75rem'
        );
        
        // Apply font family
        root.style.setProperty('--font-family', 
          theme.fontFamily === 'inter' ? '"Inter", sans-serif' :
          theme.fontFamily === 'roboto' ? '"Roboto", sans-serif' :
          theme.fontFamily === 'opensans' ? '"Open Sans", sans-serif' :
          'system-ui, sans-serif'
        );
        
        // Apply font size
        root.style.setProperty('--base-font-size',
          theme.fontSize === 'xs' ? '12px' :
          theme.fontSize === 'sm' ? '14px' :
          theme.fontSize === 'base' ? '16px' :
          theme.fontSize === 'lg' ? '18px' : '20px'
        );
        
        // Apply density
        root.style.setProperty('--spacing-multiplier',
          theme.density === 'compact' ? '0.75' :
          theme.density === 'comfortable' ? '1' : '1.25'
        );
        
        // Apply effects
        root.classList.toggle('no-animations', !theme.animations);
        root.classList.toggle('no-shadows', !theme.shadows);
        root.classList.toggle('no-blur', !theme.blur);
      },

      applyAccessibilityToDOM: () => {
        const { accessibility } = get().preferences;
        const root = document.documentElement;
        
        // Apply accessibility classes
        root.classList.toggle('reduce-motion', accessibility.reduceMotion);
        root.classList.toggle('high-contrast', accessibility.highContrast);
        root.classList.toggle('large-text', accessibility.largeText);
        root.classList.toggle('keyboard-navigation', accessibility.keyboardNavigation);
        root.classList.toggle('screen-reader', accessibility.screenReader);
        root.classList.toggle('enhanced-focus', accessibility.focusIndicators);
        
        // Apply color blindness filter
        root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        if (accessibility.colorBlindnessMode !== 'none') {
          root.classList.add(accessibility.colorBlindnessMode);
        }
        
        // Apply text spacing
        root.style.setProperty('--text-spacing-multiplier',
          accessibility.textSpacing === 'normal' ? '1' :
          accessibility.textSpacing === 'increased' ? '1.2' : '1.5'
        );
      },
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences }),
      onRehydrateStorage: () => (state) => {
        // Apply preferences after rehydration
        if (state) {
          setTimeout(() => {
            state.applyThemeToDOM();
            state.applyAccessibilityToDOM();
          }, 0);
        }
      },
    }
  )
);

// React Hook for Theme Management
export function useTheme() {
  const { preferences, updateTheme } = useUserPreferences();
  
  React.useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (preferences.theme.colorScheme === 'auto') {
        useUserPreferences.getState().applyThemeToDOM();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme.colorScheme]);
  
  return {
    theme: preferences.theme,
    updateTheme,
    isDark: preferences.theme.colorScheme === 'dark' || 
           (preferences.theme.colorScheme === 'auto' && 
            window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}

// React Hook for Accessibility
export function useAccessibility() {
  const { preferences, updateAccessibility } = useUserPreferences();
  
  return {
    accessibility: preferences.accessibility,
    updateAccessibility,
  };
}

// React Hook for Dashboard Preferences
export function useDashboardPreferences() {
  const { preferences, updateDashboard } = useUserPreferences();
  
  return {
    dashboard: preferences.dashboard,
    updateDashboard,
  };
}

// Utility Functions
export const preferencesUtils = {
  // Generate theme CSS variables
  generateThemeCSS: (theme: ThemeConfig): string => {
    return `
      :root {
        --primary-color: ${theme.primaryColor};
        --accent-color: ${theme.accentColor};
        --border-radius: ${theme.borderRadius === 'none' ? '0' : `var(--radius-${theme.borderRadius})`};
        --font-family: ${theme.fontFamily === 'system' ? 'system-ui' : theme.fontFamily};
        --base-font-size: ${theme.fontSize}px;
        --spacing-multiplier: ${
          theme.density === 'compact' ? '0.75' :
          theme.density === 'comfortable' ? '1' : '1.25'
        };
      }
    `;
  },

  // Validate preferences object
  validatePreferences: (preferences: any): boolean => {
    try {
      return (
        preferences &&
        typeof preferences === 'object' &&
        preferences.theme &&
        preferences.dashboard &&
        preferences.localization &&
        preferences.accessibility &&
        preferences.privacy &&
        preferences.notifications &&
        preferences.version
      );
    } catch {
      return false;
    }
  },

  // Migrate old preferences format
  migratePreferences: (oldPreferences: any): UserPreferences => {
    // In case we need to migrate from an older format
    return { ...DEFAULT_PREFERENCES, ...oldPreferences };
  },
};

export default useUserPreferences; 