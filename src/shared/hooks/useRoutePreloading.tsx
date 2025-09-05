import { useEffect } from 'react';

// Route preloading priorities
const PRELOAD_PRIORITIES = {
  high: ['dashboard', 'api-keys'],
  medium: ['usage', 'settings'],
  low: ['billing', 'docs', 'support'],
} as const;

// Preload functions for different routes
const routePreloaders = {
  dashboard: () =>
    import('@/pages/dashboard/Overview').then(module => ({ default: module.Overview })),
  'api-keys': () =>
    import('@/pages/dashboard/ApiKeys').then(module => ({ default: module.ApiKeys })),
  usage: () => import('@/pages/dashboard/Usage'),
  billing: () => import('@/pages/dashboard/Billing'),
  docs: () => import('@/pages/dashboard/Docs'),
  settings: () => import('@/pages/dashboard/Settings'),
  support: () => import('@/pages/dashboard/Support'),
} as const;

type RouteKey = keyof typeof routePreloaders;

// Cache to prevent duplicate preloading
const preloadCache = new Set<RouteKey>();

/**
 * Hook for intelligent route preloading
 * @param currentRoute - Current route to determine preloading strategy
 * @param userBehavior - Optional user behavior hints for smarter preloading
 */
export const useRoutePreloading = (
  currentRoute: string = '',
  userBehavior?: {
    frequentRoutes?: RouteKey[];
    lastVisited?: RouteKey[];
  }
) => {
  useEffect(() => {
    const preloadRoute = (routeKey: RouteKey, priority: 'high' | 'medium' | 'low' = 'medium') => {
      if (preloadCache.has(routeKey)) return;

      preloadCache.add(routeKey);

      // Delay preloading based on priority
      const delay = priority === 'high' ? 100 : priority === 'medium' ? 500 : 1500;

      setTimeout(() => {
        requestIdleCallback(() => {
          routePreloaders[routeKey]().catch(error => {
            console.warn(`Failed to preload route ${routeKey}:`, error);
            preloadCache.delete(routeKey);
          });
        });
      }, delay);
    };

    // Preload based on current route context
    if (currentRoute.includes('dashboard')) {
      // If on dashboard, preload frequently accessed routes
      PRELOAD_PRIORITIES.high.forEach(route => preloadRoute(route, 'high'));

      // Preload user's frequent routes if available
      userBehavior?.frequentRoutes?.forEach(route => preloadRoute(route, 'high'));

      // Preload medium priority routes after high priority ones
      setTimeout(() => {
        PRELOAD_PRIORITIES.medium.forEach(route => preloadRoute(route, 'medium'));
      }, 1000);
    }

    // Preload based on user behavior patterns
    if (userBehavior?.lastVisited) {
      userBehavior.lastVisited.slice(0, 3).forEach((route, index) => {
        const priority = index === 0 ? 'high' : index === 1 ? 'medium' : 'low';
        preloadRoute(route, priority);
      });
    }

    // On landing page, preload dashboard essentials
    if (currentRoute === '/' || currentRoute === '') {
      setTimeout(() => {
        preloadRoute('dashboard', 'medium');
        preloadRoute('api-keys', 'medium');
      }, 2000);
    }
  }, [currentRoute, userBehavior]);

  // Explicit preloading function for manual triggers
  const preloadRoutes = (routes: RouteKey[], priority: 'high' | 'medium' | 'low' = 'medium') => {
    routes.forEach(route => {
      if (!preloadCache.has(route)) {
        preloadCache.add(route);
        routePreloaders[route]().catch(error => {
          console.warn(`Failed to manually preload route ${route}:`, error);
          preloadCache.delete(route);
        });
      }
    });
  };

  return { preloadRoutes };
};

/**
 * Hook for mouse hover preloading
 * Preloads routes when user hovers over navigation links
 */
export const useHoverPreloading = () => {
  const handleHoverPreload = (routeKey: RouteKey) => {
    if (!preloadCache.has(routeKey)) {
      preloadCache.add(routeKey);
      routePreloaders[routeKey]().catch(error => {
        console.warn(`Failed to preload on hover ${routeKey}:`, error);
        preloadCache.delete(routeKey);
      });
    }
  };

  return { handleHoverPreload };
};

/**
 * Preload critical routes immediately for better UX
 */
export const preloadCriticalRoutes = () => {
  // Preload the most critical routes immediately
  const criticalRoutes: RouteKey[] = ['dashboard', 'api-keys'];

  criticalRoutes.forEach(route => {
    if (!preloadCache.has(route)) {
      preloadCache.add(route);
      routePreloaders[route]().catch(error => {
        console.warn(`Failed to preload critical route ${route}:`, error);
        preloadCache.delete(route);
      });
    }
  });
};
