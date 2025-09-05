import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cache Entry Interface
export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  version: number;
  tags: string[];
  size: number; // Estimated size in bytes
  accessCount: number;
  lastAccessed: number;
  metadata?: Record<string, any>;
}

// Cache Configuration
export interface CacheConfig {
  maxSize: number; // Maximum cache size in bytes
  maxEntries: number; // Maximum number of entries
  defaultTTL: number; // Default TTL in milliseconds
  enableCompression: boolean;
  enablePersistence: boolean;
  cleanupInterval: number; // Cleanup interval in milliseconds
  prefetchThreshold: number; // Prefetch when TTL is this close to expiring
}

// Cache Statistics
export interface CacheStats {
  size: number;
  entries: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRate: number;
  memoryUsage: number;
  lastCleanup: number;
}

// Background Sync Configuration
export interface SyncConfig {
  enableBackgroundSync: boolean;
  syncInterval: number;
  maxRetries: number;
  retryDelay: number;
  batchSize: number;
  syncOnVisibilityChange: boolean;
  syncOnNetworkReconnect: boolean;
}

// Cache Invalidation Patterns
export type InvalidationPattern = 
  | { type: 'key'; keys: string[] }
  | { type: 'tag'; tags: string[] }
  | { type: 'pattern'; patterns: string[] }
  | { type: 'all' };

// Data Cache Store Interface
interface DataCacheStore {
  entries: Map<string, CacheEntry>;
  config: CacheConfig;
  syncConfig: SyncConfig;
  stats: CacheStats;
  isOnline: boolean;
  syncQueue: Array<{ key: string; data: any; operation: 'set' | 'delete' }>;
  
  // Core cache operations
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, data: T, options?: Partial<CacheEntry>) => Promise<void>;
  delete: (key: string) => Promise<boolean>;
  clear: () => Promise<void>;
  has: (key: string) => boolean;
  
  // Batch operations
  getMany: <T>(keys: string[]) => Promise<Record<string, T | null>>;
  setMany: <T>(entries: Record<string, T>, options?: Partial<CacheEntry>) => Promise<void>;
  deleteMany: (keys: string[]) => Promise<number>;
  
  // Cache invalidation
  invalidate: (pattern: InvalidationPattern) => Promise<number>;
  invalidateByTag: (tags: string[]) => Promise<number>;
  invalidateByPattern: (patterns: string[]) => Promise<number>;
  
  // Advanced operations
  touch: (key: string) => Promise<boolean>;
  expire: (key: string, ttl: number) => Promise<boolean>;
  exists: (key: string) => boolean;
  keys: (pattern?: string) => string[];
  values: <T>() => T[];
  
  // Background sync
  enableBackgroundSync: () => void;
  disableBackgroundSync: () => void;
  syncNow: () => Promise<void>;
  addToSyncQueue: (key: string, data: any, operation: 'set' | 'delete') => void;
  
  // Cache management
  cleanup: () => Promise<number>;
  compress: () => Promise<number>;
  getStats: () => CacheStats;
  resetStats: () => void;
  
  // Configuration
  updateConfig: (config: Partial<CacheConfig>) => void;
  updateSyncConfig: (config: Partial<SyncConfig>) => void;
}

// Default configurations
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  maxEntries: 10000,
  defaultTTL: 60 * 60 * 1000, // 1 hour
  enableCompression: true,
  enablePersistence: true,
  cleanupInterval: 5 * 60 * 1000, // 5 minutes
  prefetchThreshold: 5 * 60 * 1000, // 5 minutes before expiry
};

const DEFAULT_SYNC_CONFIG: SyncConfig = {
  enableBackgroundSync: true,
  syncInterval: 30 * 1000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000,
  batchSize: 50,
  syncOnVisibilityChange: true,
  syncOnNetworkReconnect: true,
};

// Utility functions
function estimateSize(data: any): number {
  try {
    return JSON.stringify(data).length * 2; // Rough estimate (UTF-16)
  } catch {
    return 1024; // Default size if stringify fails
  }
}

function compressData(data: any): string {
  try {
    // Simple compression using JSON stringify
    // In a real implementation, you might use LZ-string or similar
    return JSON.stringify(data);
  } catch {
    return '';
  }
}

function decompressData<T>(compressed: string): T | null {
  try {
    return JSON.parse(compressed) as T;
  } catch {
    return null;
  }
}

function matchesPattern(key: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${regexPattern}$`).test(key);
}

// Create the cache store
export const useDataCacheStore = create<DataCacheStore>()(
  persist(
    (set, get) => ({
      entries: new Map(),
      config: DEFAULT_CACHE_CONFIG,
      syncConfig: DEFAULT_SYNC_CONFIG,
      stats: {
        size: 0,
        entries: 0,
        hits: 0,
        misses: 0,
        evictions: 0,
        hitRate: 0,
        memoryUsage: 0,
        lastCleanup: Date.now(),
      },
      isOnline: navigator.onLine,
      syncQueue: [],

      get: async <T>(key: string): Promise<T | null> => {
        const state = get();
        const entry = state.entries.get(key);
        
        if (!entry) {
          // Cache miss
          set((state) => ({
            stats: {
              ...state.stats,
              misses: state.stats.misses + 1,
              hitRate: state.stats.hits / (state.stats.hits + state.stats.misses + 1) * 100,
            },
          }));
          return null;
        }

        // Check if entry has expired
        if (Date.now() > entry.timestamp + entry.ttl) {
          await get().delete(key);
          set((state) => ({
            stats: {
              ...state.stats,
              misses: state.stats.misses + 1,
              hitRate: state.stats.hits / (state.stats.hits + state.stats.misses + 1) * 100,
            },
          }));
          return null;
        }

        // Update access statistics
        const updatedEntry = {
          ...entry,
          accessCount: entry.accessCount + 1,
          lastAccessed: Date.now(),
        };

        set((state) => ({
          entries: new Map(state.entries).set(key, updatedEntry),
          stats: {
            ...state.stats,
            hits: state.stats.hits + 1,
            hitRate: (state.stats.hits + 1) / (state.stats.hits + state.stats.misses + 1) * 100,
          },
        }));

        // Check if prefetch is needed
        const timeToExpiry = entry.timestamp + entry.ttl - Date.now();
        if (timeToExpiry <= state.config.prefetchThreshold) {
          // Trigger background refresh (would be implemented by the consumer)
          console.debug(`Cache entry '${key}' needs prefetch`);
        }

        return entry.data as T;
      },

      set: async <T>(key: string, data: T, options: Partial<CacheEntry> = {}): Promise<void> => {
        const state = get();
        const timestamp = Date.now();
        const size = estimateSize(data);
        
        const entry: CacheEntry<T> = {
          key,
          data,
          timestamp,
          ttl: options.ttl || state.config.defaultTTL,
          version: options.version || 1,
          tags: options.tags || [],
          size,
          accessCount: 0,
          lastAccessed: timestamp,
          metadata: options.metadata,
        };

        // Check if we need to evict entries
        const newTotalSize = state.stats.memoryUsage + size;
        const newTotalEntries = state.stats.entries + 1;

        if (newTotalSize > state.config.maxSize || newTotalEntries > state.config.maxEntries) {
          await get().cleanup();
        }

        set((state) => {
          const newEntries = new Map(state.entries);
          const existingEntry = newEntries.get(key);
          const sizeChange = existingEntry ? size - existingEntry.size : size;
          
          newEntries.set(key, entry);

          return {
            entries: newEntries,
            stats: {
              ...state.stats,
              size: state.stats.size + sizeChange,
              entries: newEntries.size,
              memoryUsage: state.stats.memoryUsage + sizeChange,
            },
          };
        });

        // Add to sync queue if offline
        if (!state.isOnline && state.syncConfig.enableBackgroundSync) {
          get().addToSyncQueue(key, data, 'set');
        }
      },

      delete: async (key: string): Promise<boolean> => {
        const state = get();
        const entry = state.entries.get(key);
        
        if (!entry) {
          return false;
        }

        set((state) => {
          const newEntries = new Map(state.entries);
          newEntries.delete(key);
          
          return {
            entries: newEntries,
            stats: {
              ...state.stats,
              size: state.stats.size - entry.size,
              entries: newEntries.size,
              memoryUsage: state.stats.memoryUsage - entry.size,
            },
          };
        });

        // Add to sync queue if offline
        if (!state.isOnline && state.syncConfig.enableBackgroundSync) {
          get().addToSyncQueue(key, null, 'delete');
        }

        return true;
      },

      clear: async (): Promise<void> => {
        set((state) => ({
          entries: new Map(),
          stats: {
            ...state.stats,
            size: 0,
            entries: 0,
            memoryUsage: 0,
            evictions: state.stats.evictions + state.entries.size,
          },
          syncQueue: [],
        }));
      },

      has: (key: string): boolean => {
        const entry = get().entries.get(key);
        if (!entry) return false;
        
        // Check if expired
        return Date.now() <= entry.timestamp + entry.ttl;
      },

      getMany: async <T>(keys: string[]): Promise<Record<string, T | null>> => {
        const result: Record<string, T | null> = {};
        
        for (const key of keys) {
          result[key] = await get().get<T>(key);
        }
        
        return result;
      },

      setMany: async <T>(entries: Record<string, T>, options: Partial<CacheEntry> = {}): Promise<void> => {
        const promises = Object.entries(entries).map(([key, data]) =>
          get().set(key, data, options)
        );
        
        await Promise.all(promises);
      },

      deleteMany: async (keys: string[]): Promise<number> => {
        let deleted = 0;
        
        for (const key of keys) {
          if (await get().delete(key)) {
            deleted++;
          }
        }
        
        return deleted;
      },

      invalidate: async (pattern: InvalidationPattern): Promise<number> => {
        switch (pattern.type) {
          case 'key':
            return await get().deleteMany(pattern.keys);
          case 'tag':
            return await get().invalidateByTag(pattern.tags);
          case 'pattern':
            return await get().invalidateByPattern(pattern.patterns);
          case 'all':
            const count = get().entries.size;
            await get().clear();
            return count;
          default:
            return 0;
        }
      },

      invalidateByTag: async (tags: string[]): Promise<number> => {
        const state = get();
        const keysToDelete: string[] = [];
        
        for (const [key, entry] of state.entries) {
          if (entry.tags.some(tag => tags.includes(tag))) {
            keysToDelete.push(key);
          }
        }
        
        return await get().deleteMany(keysToDelete);
      },

      invalidateByPattern: async (patterns: string[]): Promise<number> => {
        const state = get();
        const keysToDelete: string[] = [];
        
        for (const [key] of state.entries) {
          if (patterns.some(pattern => matchesPattern(key, pattern))) {
            keysToDelete.push(key);
          }
        }
        
        return await get().deleteMany(keysToDelete);
      },

      touch: async (key: string): Promise<boolean> => {
        const state = get();
        const entry = state.entries.get(key);
        
        if (!entry) return false;
        
        const updatedEntry = {
          ...entry,
          timestamp: Date.now(),
          lastAccessed: Date.now(),
        };
        
        set((state) => ({
          entries: new Map(state.entries).set(key, updatedEntry),
        }));
        
        return true;
      },

      expire: async (key: string, ttl: number): Promise<boolean> => {
        const state = get();
        const entry = state.entries.get(key);
        
        if (!entry) return false;
        
        const updatedEntry = {
          ...entry,
          ttl,
        };
        
        set((state) => ({
          entries: new Map(state.entries).set(key, updatedEntry),
        }));
        
        return true;
      },

      exists: (key: string): boolean => {
        return get().has(key);
      },

      keys: (pattern?: string): string[] => {
        const state = get();
        const allKeys = Array.from(state.entries.keys());
        
        if (!pattern) return allKeys;
        
        return allKeys.filter(key => matchesPattern(key, pattern));
      },

      values: <T>(): T[] => {
        const state = get();
        return Array.from(state.entries.values()).map(entry => entry.data as T);
      },

      enableBackgroundSync: () => {
        set((state) => ({
          syncConfig: {
            ...state.syncConfig,
            enableBackgroundSync: true,
          },
        }));
        
        // Start sync interval
        get().syncNow();
      },

      disableBackgroundSync: () => {
        set((state) => ({
          syncConfig: {
            ...state.syncConfig,
            enableBackgroundSync: false,
          },
        }));
      },

      syncNow: async (): Promise<void> => {
        const state = get();
        
        if (!state.isOnline || state.syncQueue.length === 0) {
          return;
        }

        const batch = state.syncQueue.slice(0, state.syncConfig.batchSize);
        
        try {
          // Here you would implement the actual sync logic
          // For now, we'll just simulate it
          console.log(`Syncing ${batch.length} items to server`);
          
          // Remove synced items from queue
          set((state) => ({
            syncQueue: state.syncQueue.slice(state.syncConfig.batchSize),
          }));
        } catch (error) {
          console.error('Sync failed:', error);
          // Implement retry logic here
        }
      },

      addToSyncQueue: (key: string, data: any, operation: 'set' | 'delete') => {
        set((state) => ({
          syncQueue: [...state.syncQueue, { key, data, operation }],
        }));
      },

      cleanup: async (): Promise<number> => {
        const state = get();
        const now = Date.now();
        let evicted = 0;
        
        // Remove expired entries
        const validEntries = new Map<string, CacheEntry>();
        let newSize = 0;
        let newMemoryUsage = 0;
        
        for (const [key, entry] of state.entries) {
          if (now <= entry.timestamp + entry.ttl) {
            validEntries.set(key, entry);
            newSize += entry.size;
            newMemoryUsage += entry.size;
          } else {
            evicted++;
          }
        }
        
        // If still over limits, evict least recently used entries
        if (newMemoryUsage > state.config.maxSize || validEntries.size > state.config.maxEntries) {
          const sortedEntries = Array.from(validEntries.entries())
            .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
          
          const finalEntries = new Map<string, CacheEntry>();
          let finalSize = 0;
          let finalMemoryUsage = 0;
          
          for (const [key, entry] of sortedEntries) {
            if (finalMemoryUsage + entry.size <= state.config.maxSize && 
                finalEntries.size < state.config.maxEntries) {
              finalEntries.set(key, entry);
              finalSize += entry.size;
              finalMemoryUsage += entry.size;
            } else {
              evicted++;
            }
          }
          
          validEntries.clear();
          for (const [key, entry] of finalEntries) {
            validEntries.set(key, entry);
          }
          newSize = finalSize;
          newMemoryUsage = finalMemoryUsage;
        }
        
        set((state) => ({
          entries: validEntries,
          stats: {
            ...state.stats,
            size: newSize,
            entries: validEntries.size,
            memoryUsage: newMemoryUsage,
            evictions: state.stats.evictions + evicted,
            lastCleanup: now,
          },
        }));
        
        return evicted;
      },

      compress: async (): Promise<number> => {
        // In a real implementation, this would compress stored data
        // For now, we'll just return 0 as no compression was done
        return 0;
      },

      getStats: (): CacheStats => {
        return get().stats;
      },

      resetStats: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            hits: 0,
            misses: 0,
            evictions: 0,
            hitRate: 0,
          },
        }));
      },

      updateConfig: (config: Partial<CacheConfig>) => {
        set((state) => ({
          config: {
            ...state.config,
            ...config,
          },
        }));
      },

      updateSyncConfig: (config: Partial<SyncConfig>) => {
        set((state) => ({
          syncConfig: {
            ...state.syncConfig,
            ...config,
          },
        }));
      },
    }),
    {
      name: 'data-cache-store',
      version: 1,
      // Only persist certain parts of the state
      partialize: (state) => ({
        entries: Array.from(state.entries.entries()),
        config: state.config,
        syncConfig: state.syncConfig,
        syncQueue: state.syncQueue,
      }),
      // Restore the Map from the persisted array
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.entries)) {
          state.entries = new Map(state.entries as any);
        }
      },
    }
  )
);

// Data Cache Service Class
export class DataCacheService {
  private static instance: DataCacheService;
  private cleanupInterval?: NodeJS.Timeout;
  private syncInterval?: NodeJS.Timeout;
  private store = useDataCacheStore;

  static getInstance(): DataCacheService {
    if (!DataCacheService.instance) {
      DataCacheService.instance = new DataCacheService();
    }
    return DataCacheService.instance;
  }

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Set up cleanup interval
    this.setupCleanupInterval();
    
    // Set up sync interval
    this.setupSyncInterval();
    
    // Listen for online/offline events
    this.setupNetworkListeners();
    
    // Listen for visibility change
    this.setupVisibilityListener();
  }

  private setupCleanupInterval() {
    const config = this.store.getState().config;
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.store.getState().cleanup();
    }, config.cleanupInterval);
  }

  private setupSyncInterval() {
    const syncConfig = this.store.getState().syncConfig;
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (syncConfig.enableBackgroundSync) {
      this.syncInterval = setInterval(() => {
        this.store.getState().syncNow();
      }, syncConfig.syncInterval);
    }
  }

  private setupNetworkListeners() {
    const updateOnlineStatus = () => {
      this.store.setState({ isOnline: navigator.onLine });
      
      if (navigator.onLine && this.store.getState().syncConfig.syncOnNetworkReconnect) {
        this.store.getState().syncNow();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.store.getState().syncConfig.syncOnVisibilityChange) {
        this.store.getState().syncNow();
      }
    });
  }

  // Public API methods
  async get<T>(key: string): Promise<T | null> {
    return this.store.getState().get<T>(key);
  }

  async set<T>(key: string, data: T, options?: Partial<CacheEntry>): Promise<void> {
    return this.store.getState().set(key, data, options);
  }

  async delete(key: string): Promise<boolean> {
    return this.store.getState().delete(key);
  }

  async clear(): Promise<void> {
    return this.store.getState().clear();
  }

  has(key: string): boolean {
    return this.store.getState().has(key);
  }

  async invalidateByTag(tags: string[]): Promise<number> {
    return this.store.getState().invalidateByTag(tags);
  }

  async invalidateByPattern(patterns: string[]): Promise<number> {
    return this.store.getState().invalidateByPattern(patterns);
  }

  getStats(): CacheStats {
    return this.store.getState().getStats();
  }

  updateConfig(config: Partial<CacheConfig>): void {
    this.store.getState().updateConfig(config);
    this.setupCleanupInterval(); // Restart with new interval
  }

  updateSyncConfig(config: Partial<SyncConfig>): void {
    this.store.getState().updateSyncConfig(config);
    this.setupSyncInterval(); // Restart with new interval
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

// Create and export singleton instance
export const dataCacheService = DataCacheService.getInstance();

// React hook for using the cache
export function useDataCache() {
  const store = useDataCacheStore();
  
  return {
    ...store,
    service: dataCacheService,
  };
}

// Higher-order function for cached API calls
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string;
    ttl?: number;
    tags?: string[];
    enableOfflineFirst?: boolean;
  }
): T {
  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = options.keyGenerator(...args);
    const cache = dataCacheService;
    
    // Try to get from cache first
    const cached = await cache.get<Awaited<ReturnType<T>>>(key);
    if (cached !== null) {
      return cached;
    }
    
    // If offline and offline-first is enabled, return null or throw
    if (!navigator.onLine && options.enableOfflineFirst) {
      throw new Error(`Data not available offline: ${key}`);
    }
    
    try {
      // Call the original function
      const result = await fn(...args);
      
      // Cache the result
      await cache.set(key, result, {
        ttl: options.ttl,
        tags: options.tags,
      });
      
      return result;
    } catch (error) {
      // If offline, try to return stale data
      if (!navigator.onLine) {
        const stale = await cache.get<Awaited<ReturnType<T>>>(key);
        if (stale !== null) {
          console.warn(`Returning stale data for ${key} due to offline mode`);
          return stale;
        }
      }
      throw error;
    }
  }) as T;
}

export default DataCacheService; 