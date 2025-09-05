import React, { Suspense, ComponentType, ReactElement, useState, useEffect } from 'react';
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/shared/components/common/LoadingStates';

// Preloading cache
const preloadCache = new Map<string, Promise<any>>();
const componentCache = new Map<string, ComponentType<any>>();

interface LazyLoadOptions {
  fallback?: ReactElement;
  errorFallback?: ReactElement;
  preload?: boolean;
  timeout?: number;
  retryCount?: number;
  onError?: (error: Error) => void;
  onLoad?: (componentName: string) => void;
}

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  componentName: string;
  options?: LazyLoadOptions;
  [key: string]: any;
}

// Default options
const defaultOptions: LazyLoadOptions = {
  fallback: <LoadingSpinner />,
  errorFallback: <div>Failed to load component</div>,
  preload: false,
  timeout: 10000, // 10 seconds
  retryCount: 3,
};

// Preload a component
export function preloadComponent(
  loader: () => Promise<{ default: ComponentType<any> }>,
  componentName: string
): Promise<ComponentType<any>> {
  if (componentCache.has(componentName)) {
    return Promise.resolve(componentCache.get(componentName)!);
  }

  if (preloadCache.has(componentName)) {
    return preloadCache.get(componentName)!;
  }

  const promise = loader()
    .then(module => {
      const component = module.default;
      componentCache.set(componentName, component);
      return component;
    })
    .catch(error => {
      preloadCache.delete(componentName);
      throw error;
    });

  preloadCache.set(componentName, promise);
  return promise;
}

// Create lazy component with enhanced features
export function createLazyComponent(
  loader: () => Promise<{ default: ComponentType<any> }>,
  componentName: string,
  options: LazyLoadOptions = {}
): ComponentType<any> {
  const config = { ...defaultOptions, ...options };

  const LazyComponent = React.lazy(() => {
    // Check cache first
    if (componentCache.has(componentName)) {
      return Promise.resolve({ default: componentCache.get(componentName)! });
    }

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Component "${componentName}" failed to load within ${config.timeout}ms`));
      }, config.timeout);
    });

    // Create retry logic
    const loadWithRetry = async (attempt = 1): Promise<{ default: ComponentType<any> }> => {
      try {
        const module = await Promise.race([loader(), timeoutPromise]);
        componentCache.set(componentName, module.default);

        if (config.onLoad) {
          config.onLoad(componentName);
        }

        return module;
      } catch (error) {
        if (attempt < config.retryCount!) {
          console.warn(
            `Failed to load ${componentName}, retrying... (${attempt}/${config.retryCount})`
          );
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
          return loadWithRetry(attempt + 1);
        }

        if (config.onError) {
          config.onError(error as Error);
        }

        throw error;
      }
    };

    return loadWithRetry();
  });

  // Preload if requested
  if (config.preload) {
    preloadComponent(loader, componentName);
  }

  return LazyComponent;
}

// Enhanced Lazy Component Loader with Suspense and Error Boundary
export function LazyComponentLoader({
  loader,
  componentName,
  options = {},
  ...props
}: LazyComponentProps) {
  const config = { ...defaultOptions, ...options };
  const [loadError, setLoadError] = useState<Error | null>(null);

  const LazyComponent = React.useMemo(() => {
    return createLazyComponent(loader, componentName, {
      ...config,
      onError: error => {
        setLoadError(error);
        config.onError?.(error);
      },
    });
  }, [loader, componentName, config]);

  // Preload on hover/focus for better UX
  const handlePreload = () => {
    if (!componentCache.has(componentName) && !preloadCache.has(componentName)) {
      preloadComponent(loader, componentName);
    }
  };

  if (loadError) {
    return config.errorFallback || <div>Failed to load {componentName}</div>;
  }

  return (
    <div onMouseEnter={handlePreload} onFocus={handlePreload}>
      <ErrorBoundary fallback={config.errorFallback} onError={config.onError}>
        <Suspense fallback={config.fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Hook for preloading components based on user interaction
export function useComponentPreloader() {
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());

  const preload = async (
    loader: () => Promise<{ default: ComponentType<any> }>,
    componentName: string
  ) => {
    if (preloadedComponents.has(componentName)) return;

    try {
      await preloadComponent(loader, componentName);
      setPreloadedComponents(prev => new Set([...prev, componentName]));
    } catch (error) {
      console.error(`Failed to preload component ${componentName}:`, error);
    }
  };

  const isPreloaded = (componentName: string) => {
    return componentCache.has(componentName) || preloadedComponents.has(componentName);
  };

  return { preload, isPreloaded, preloadedComponents: Array.from(preloadedComponents) };
}

// Preload components based on route prediction
export function useRoutePreloader() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const preloadRouteComponents = (
    routes: Array<{
      path: string;
      loader: () => Promise<{ default: ComponentType<any> }>;
      componentName: string;
    }>
  ) => {
    routes.forEach(({ loader, componentName }) => {
      // Preload components for likely next routes
      preloadComponent(loader, componentName).catch(() => {
        // Silently fail preloading
      });
    });
  };

  return { currentRoute, preloadRouteComponents };
}

// Bundle analyzer integration
export function getBundleInfo() {
  return {
    cachedComponents: Array.from(componentCache.keys()),
    preloadingComponents: Array.from(preloadCache.keys()),
    cacheSize: componentCache.size,
    preloadSize: preloadCache.size,
  };
}

// Clear caches (useful for memory management)
export function clearComponentCaches() {
  componentCache.clear();
  preloadCache.clear();
}

export type { LazyLoadOptions, LazyComponentProps };
