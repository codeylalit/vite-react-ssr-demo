import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  User,
  AuthTokens,
  AuthState,
  storeAuthTokens,
  storeUserData,
  getAuthTokens,
  getUserData,
  clearAuthTokens,
  clearUserData,
  refreshAccessToken,
} from '@/lib/security/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshTokens: () => Promise<boolean>;
  checkAuthStatus: () => void;
  setLoading: (loading: boolean) => void;

  // Computed values
  isTokenExpired: () => boolean;
  hasPermission: (permission: string) => boolean;

  // Session management
  extendSession: () => void;
  sessionExpiryTime: number | null;
}

const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    immer(
      persist(
        (set, get) => ({
          // Initial state
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          sessionExpiryTime: null,

          // Actions
          login: (user: User, tokens: AuthTokens) => {
            set(state => {
              state.user = user;
              state.tokens = tokens;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.sessionExpiryTime = tokens.expiresAt;
            });

            // Store in secure storage
            storeAuthTokens(tokens);
            storeUserData(user);
          },

          logout: () => {
            set(state => {
              state.user = null;
              state.tokens = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.sessionExpiryTime = null;
            });

            // Clear from storage
            clearAuthTokens();
            clearUserData();

            // Redirect to login page
            window.location.href = '/';
          },

          updateUser: (updates: Partial<User>) => {
            set(state => {
              if (state.user) {
                Object.assign(state.user, updates);
                // Update storage
                storeUserData(state.user);
              }
            });
          },

          refreshTokens: async () => {
            const { tokens } = get();
            if (!tokens) return false;

            try {
              const newTokens = await refreshAccessToken();
              if (newTokens) {
                set(state => {
                  state.tokens = newTokens;
                  state.sessionExpiryTime = newTokens.expiresAt;
                });
                return true;
              }
              return false;
            } catch (error) {
              console.error('Token refresh failed:', error);
              get().logout();
              return false;
            }
          },

          checkAuthStatus: () => {
            set(state => {
              state.isLoading = true;
            });

            try {
              const tokens = getAuthTokens();
              const user = getUserData();

              if (tokens && user && Date.now() < tokens.expiresAt) {
                set(state => {
                  state.user = user;
                  state.tokens = tokens;
                  state.isAuthenticated = true;
                  state.sessionExpiryTime = tokens.expiresAt;
                });
              } else {
                // Clear invalid auth data
                get().logout();
              }
            } finally {
              set(state => {
                state.isLoading = false;
              });
            }
          },

          setLoading: (loading: boolean) => {
            set(state => {
              state.isLoading = loading;
            });
          },

          // Computed values
          isTokenExpired: () => {
            const { tokens } = get();
            return !tokens || Date.now() >= tokens.expiresAt;
          },

          hasPermission: (permission: string) => {
            const { user } = get();
            if (!user) return false;

            // Simple role-based permissions
            const rolePermissions: Record<string, string[]> = {
              admin: ['read', 'write', 'delete', 'manage_users', 'manage_billing'],
              user: ['read', 'write'],
              viewer: ['read'],
            };

            const userPermissions = rolePermissions[user.role] || [];
            return userPermissions.includes(permission);
          },

          // Session management
          extendSession: () => {
            const { tokens } = get();
            if (tokens) {
              const extendedExpiry = Date.now() + 30 * 60 * 1000; // Extend by 30 minutes
              const extendedTokens = { ...tokens, expiresAt: extendedExpiry };

              set(state => {
                state.tokens = extendedTokens;
                state.sessionExpiryTime = extendedExpiry;
              });

              storeAuthTokens(extendedTokens);
            }
          },
        }),
        {
          name: 'auth-store',
          storage: createJSONStorage(() => localStorage),
          partialize: state => ({
            // Only persist non-sensitive data
            user: state.user
              ? {
                  id: state.user.id,
                  email: state.user.email,
                  name: state.user.name,
                  role: state.user.role,
                  plan: state.user.plan,
                  isEmailVerified: state.user.isEmailVerified,
                }
              : null,
            isAuthenticated: state.isAuthenticated,
          }),
          version: 1,
          migrate: (persistedState: any, version: number) => {
            // Handle migration if store structure changes
            if (version === 0) {
              // Migrate from version 0 to 1
              return persistedState;
            }
            return persistedState;
          },
        }
      )
    )
  )
);

// Selectors for specific pieces of state
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useIsLoading = () => useAuthStore(state => state.isLoading);
export const useAuthActions = () =>
  useAuthStore(state => ({
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
    refreshTokens: state.refreshTokens,
    checkAuthStatus: state.checkAuthStatus,
    setLoading: state.setLoading,
  }));

// Auto-refresh tokens before expiry
useAuthStore.subscribe(
  state => state.sessionExpiryTime,
  sessionExpiryTime => {
    if (sessionExpiryTime) {
      const timeUntilExpiry = sessionExpiryTime - Date.now();
      const refreshThreshold = 5 * 60 * 1000; // Refresh 5 minutes before expiry

      if (timeUntilExpiry > 0 && timeUntilExpiry <= refreshThreshold) {
        useAuthStore.getState().refreshTokens();
      }
    }
  }
);

// Session activity monitoring
let activityTimer: NodeJS.Timeout | null = null;
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetActivityTimer() {
  if (activityTimer) clearTimeout(activityTimer);

  activityTimer = setTimeout(() => {
    const { isAuthenticated, logout } = useAuthStore.getState();
    if (isAuthenticated) {
      console.log('Session expired due to inactivity');
      logout();
    }
  }, ACTIVITY_TIMEOUT);
}

// Track user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
activityEvents.forEach(event => {
  document.addEventListener(
    event,
    () => {
      const { isAuthenticated, extendSession } = useAuthStore.getState();
      if (isAuthenticated) {
        resetActivityTimer();
        extendSession();
      }
    },
    { passive: true }
  );
});

export default useAuthStore;
