import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/shared/components/common/LoadingStates';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

// Module Federation types
interface MicroFrontendConfig {
  name: string;
  entry: string;
  scope: string;
  module: string;
  fallback?: React.ComponentType;
  errorBoundary?: boolean;
  preload?: boolean;
}

interface ModuleInfo {
  name: string;
  version: string;
  status: 'loading' | 'loaded' | 'error' | 'offline';
  lastLoaded?: Date;
  error?: Error;
}

interface MicroFrontendShellProps {
  config: MicroFrontendConfig;
  fallback?: React.ComponentType;
  onModuleLoad?: (info: ModuleInfo) => void;
  onModuleError?: (error: Error, info: ModuleInfo) => void;
  className?: string;
}

// Global module registry for tracking loaded modules
const moduleRegistry = new Map<string, ModuleInfo>();

// Module Federation dynamic import utility
async function loadMicroFrontend(config: MicroFrontendConfig): Promise<React.ComponentType> {
  try {
    // Update module status
    const moduleInfo: ModuleInfo = {
      name: config.name,
      version: '1.0.0', // Would come from module manifest
      status: 'loading',
    };
    moduleRegistry.set(config.name, moduleInfo);

    // In a real micro frontend setup, this would use Module Federation
    // For now, we'll simulate the loading process
    const module = await import(/* @vite-ignore */ config.entry);

    moduleInfo.status = 'loaded';
    moduleInfo.lastLoaded = new Date();
    moduleRegistry.set(config.name, moduleInfo);

    return module.default || module[config.module];
  } catch (error) {
    const moduleInfo: ModuleInfo = {
      name: config.name,
      version: '1.0.0',
      status: 'error',
      error: error as Error,
    };
    moduleRegistry.set(config.name, moduleInfo);
    throw error;
  }
}

// Hook for managing micro frontend lifecycle
function useMicroFrontend(config: MicroFrontendConfig) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!online) {
      setError(new Error('Offline: Cannot load micro frontend'));
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if module is already loaded
        const existingModule = moduleRegistry.get(config.name);
        if (existingModule?.status === 'loaded') {
          // Module already loaded, use cached version
          const module = await loadMicroFrontend(config);
          if (mounted) {
            setComponent(() => module);
            setLoading(false);
          }
          return;
        }

        // Load the micro frontend
        const LoadedComponent = await loadMicroFrontend(config);

        if (mounted) {
          setComponent(() => LoadedComponent);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, [config, online]);

  return { Component, loading, error, online };
}

// Fallback component for failed micro frontends
const MicroFrontendFallback: React.FC<{
  config: MicroFrontendConfig;
  error?: Error;
  offline?: boolean;
}> = ({ config, error, offline }) => (
  <Card className="border-yellow-200 bg-yellow-50">
    <CardContent className="p-6">
      <div className="flex items-start gap-3">
        {offline ? (
          <WifiOff className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h3 className="font-medium text-yellow-900">
            {offline ? 'Offline Mode' : 'Module Loading Failed'}
          </h3>
          <p className="text-yellow-700 text-sm mt-1">
            {offline
              ? `Cannot load ${config.name} while offline. Some features may be unavailable.`
              : `Failed to load the ${config.name} module. ${error?.message || 'Unknown error'}`}
          </p>
          {!offline && (
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-yellow-800 text-sm underline hover:no-underline"
            >
              Reload page
            </button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main micro frontend shell component
export const MicroFrontendShell: React.FC<MicroFrontendShellProps> = ({
  config,
  fallback: CustomFallback,
  onModuleLoad,
  onModuleError,
  className,
}) => {
  const { Component, loading, error, online } = useMicroFrontend(config);

  // Notify parent of module lifecycle events
  useEffect(() => {
    const moduleInfo = moduleRegistry.get(config.name);
    if (moduleInfo?.status === 'loaded' && onModuleLoad) {
      onModuleLoad(moduleInfo);
    }
  }, [Component, config.name, onModuleLoad]);

  useEffect(() => {
    if (error && onModuleError) {
      const moduleInfo = moduleRegistry.get(config.name) || {
        name: config.name,
        version: '1.0.0',
        status: 'error' as const,
        error,
      };
      onModuleError(error, moduleInfo);
    }
  }, [error, config.name, onModuleError]);

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground text-sm mt-2 text-center">Loading {config.name}...</p>
      </div>
    );
  }

  // Error state
  if (error || !Component) {
    const FallbackComponent = CustomFallback || config.fallback || MicroFrontendFallback;
    return (
      <div className={className}>
        <FallbackComponent config={config} error={error || undefined} offline={!online} />
      </div>
    );
  }

  // Success state - render the micro frontend
  const content = <Component />;

  // Wrap in error boundary if configured
  if (config.errorBoundary !== false) {
    return (
      <div className={className}>
        <ErrorBoundary
          level="section"
          onError={(error, errorInfo) => {
            console.error(`Error in micro frontend ${config.name}:`, error, errorInfo);
            onModuleError?.(
              error,
              moduleRegistry.get(config.name) || {
                name: config.name,
                version: '1.0.0',
                status: 'error',
                error,
              }
            );
          }}
        >
          {content}
        </ErrorBoundary>
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};

// Utility for preloading micro frontends
export const preloadMicroFrontend = async (config: MicroFrontendConfig): Promise<void> => {
  try {
    await loadMicroFrontend(config);
    console.log(`Preloaded micro frontend: ${config.name}`);
  } catch (error) {
    console.warn(`Failed to preload micro frontend ${config.name}:`, error);
  }
};

// Hook for getting module registry information
export const useModuleRegistry = () => {
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    const updateModules = () => {
      setModules(Array.from(moduleRegistry.values()));
    };

    // Initial load
    updateModules();

    // Set up periodic updates (in a real app, you'd use events)
    const interval = setInterval(updateModules, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    modules,
    getModule: (name: string) => moduleRegistry.get(name),
    getAllModules: () => Array.from(moduleRegistry.values()),
    getLoadedModules: () => Array.from(moduleRegistry.values()).filter(m => m.status === 'loaded'),
    getErrorModules: () => Array.from(moduleRegistry.values()).filter(m => m.status === 'error'),
  };
};

// Component for displaying module status
export const ModuleStatusDashboard: React.FC = () => {
  const { modules } = useModuleRegistry();

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No micro frontends loaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium mb-4">Micro Frontend Status</h3>
        <div className="space-y-3">
          {modules.map(module => (
            <div key={module.name} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{module.name}</span>
                <span className="text-muted-foreground text-sm ml-2">v{module.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    module.status === 'loaded'
                      ? 'bg-green-500'
                      : module.status === 'loading'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                <span className="text-sm capitalize">{module.status}</span>
                {module.lastLoaded && (
                  <span className="text-xs text-muted-foreground">
                    {module.lastLoaded.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Export types for external use
export type { MicroFrontendConfig, ModuleInfo, MicroFrontendShellProps };
