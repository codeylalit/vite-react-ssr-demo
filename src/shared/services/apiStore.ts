import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

export interface ApiKey {
  id: string;
  name: string;
  description?: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  usageCount: number;
  rateLimit: {
    limit: number;
    window: string;
    current: number;
    resetAt: string;
  };
}

export interface UsageMetrics {
  daily: {
    date: string;
    requests: number;
    errors: number;
    responseTime: number;
  }[];
  monthly: {
    month: string;
    requests: number;
    costs: number;
  }[];
  realTime: {
    requests: number;
    errors: number;
    successRate: number;
    avgResponseTime: number;
    lastUpdated: string;
  };
}

export interface QuotaLimits {
  monthly: {
    limit: number;
    used: number;
    resetDate: string;
  };
  daily: {
    limit: number;
    used: number;
    resetDate: string;
  };
}

interface ApiStore {
  apiKeys: ApiKey[];
  selectedApiKey: ApiKey | null;
  usage: UsageMetrics | null;
  quotas: QuotaLimits | null;
  isLoading: boolean;
  error: string | null;

  fetchApiKeys: () => Promise<void>;
  createApiKey: (
    keyData: Omit<ApiKey, 'id' | 'key' | 'createdAt' | 'usageCount' | 'rateLimit'>
  ) => Promise<ApiKey>;
  updateApiKey: (id: string, updates: Partial<ApiKey>) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;
  toggleApiKey: (id: string) => Promise<void>;
  regenerateApiKey: (id: string) => Promise<string>;
  fetchUsageMetrics: (timeRange?: string) => Promise<void>;
  fetchQuotaLimits: () => Promise<void>;
  updateUsage: (apiKeyId: string) => void;
  selectApiKey: (apiKey: ApiKey | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getActiveApiKeys: () => ApiKey[];
  getApiKeyById: (id: string) => ApiKey | undefined;
  isQuotaExceeded: () => boolean;
  getRemainingQuota: () => { daily: number; monthly: number };
}

const useApiStore = create<ApiStore>()(
  subscribeWithSelector(
    immer(
      persist(
        (set, get) => ({
          apiKeys: [],
          selectedApiKey: null,
          usage: null,
          quotas: null,
          isLoading: false,
          error: null,

          fetchApiKeys: async () => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 1000));

              const mockApiKeys: ApiKey[] = [
                {
                  id: 'key_1',
                  name: 'Production API Key',
                  description: 'Main production key for voice synthesis',
                  key: 'zvi_prod_****************************',
                  permissions: ['voice.synthesize', 'voice.list', 'usage.view'],
                  isActive: true,
                  createdAt: '2024-01-15T10:30:00Z',
                  lastUsed: '2024-01-20T14:25:00Z',
                  usageCount: 12450,
                  rateLimit: {
                    limit: 1000,
                    window: '1h',
                    current: 45,
                    resetAt: '2024-01-20T15:00:00Z',
                  },
                },
              ];

              set(state => {
                state.apiKeys = mockApiKeys;
                state.isLoading = false;
              });
            } catch (error) {
              set(state => {
                state.error = error instanceof Error ? error.message : 'Failed to fetch API keys';
                state.isLoading = false;
              });
            }
          },

          createApiKey: async keyData => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 800));

              const newApiKey: ApiKey = {
                ...keyData,
                id: `key_${Date.now()}`,
                key: `zvi_${keyData.name.toLowerCase().replace(/\s+/g, '_')}_${'*'.repeat(28)}`,
                createdAt: new Date().toISOString(),
                usageCount: 0,
                rateLimit: {
                  limit: 100,
                  window: '1h',
                  current: 0,
                  resetAt: new Date(Date.now() + 3600000).toISOString(),
                },
              };

              set(state => {
                state.apiKeys.push(newApiKey);
                state.isLoading = false;
              });

              return newApiKey;
            } catch (error) {
              set(state => {
                state.error = error instanceof Error ? error.message : 'Failed to create API key';
                state.isLoading = false;
              });
              throw error;
            }
          },

          updateApiKey: async (id, updates) => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 500));

              set(state => {
                const index = state.apiKeys.findIndex(key => key.id === id);
                if (index !== -1) {
                  Object.assign(state.apiKeys[index], updates);
                }
                state.isLoading = false;
              });
            } catch (error) {
              set(state => {
                state.error = error instanceof Error ? error.message : 'Failed to update API key';
                state.isLoading = false;
              });
            }
          },

          deleteApiKey: async id => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 500));

              set(state => {
                state.apiKeys = state.apiKeys.filter(key => key.id !== id);
                if (state.selectedApiKey?.id === id) {
                  state.selectedApiKey = null;
                }
                state.isLoading = false;
              });
            } catch (error) {
              set(state => {
                state.error = error instanceof Error ? error.message : 'Failed to delete API key';
                state.isLoading = false;
              });
            }
          },

          toggleApiKey: async id => {
            const apiKey = get().getApiKeyById(id);
            if (apiKey) {
              await get().updateApiKey(id, { isActive: !apiKey.isActive });
            }
          },

          regenerateApiKey: async id => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 800));

              const newKey = `zvi_regen_${'*'.repeat(28)}`;

              set(state => {
                const index = state.apiKeys.findIndex(key => key.id === id);
                if (index !== -1) {
                  state.apiKeys[index].key = newKey;
                }
                state.isLoading = false;
              });

              return newKey;
            } catch (error) {
              set(state => {
                state.error =
                  error instanceof Error ? error.message : 'Failed to regenerate API key';
                state.isLoading = false;
              });
              throw error;
            }
          },

          fetchUsageMetrics: async (timeRange = '30d') => {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await new Promise(resolve => setTimeout(resolve, 1000));

              const mockUsage: UsageMetrics = {
                daily: Array.from({ length: 30 }, (_, i) => ({
                  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  requests: Math.floor(Math.random() * 500) + 100,
                  errors: Math.floor(Math.random() * 10),
                  responseTime: Math.random() * 200 + 50,
                })).reverse(),
                monthly: [
                  { month: '2024-01', requests: 45000, costs: 89.5 },
                  { month: '2023-12', requests: 38000, costs: 76.0 },
                ],
                realTime: {
                  requests: 1250,
                  errors: 3,
                  successRate: 99.76,
                  avgResponseTime: 125.4,
                  lastUpdated: new Date().toISOString(),
                },
              };

              set(state => {
                state.usage = mockUsage;
                state.isLoading = false;
              });
            } catch (error) {
              set(state => {
                state.error =
                  error instanceof Error ? error.message : 'Failed to fetch usage metrics';
                state.isLoading = false;
              });
            }
          },

          fetchQuotaLimits: async () => {
            try {
              const mockQuotas: QuotaLimits = {
                monthly: {
                  limit: 100000,
                  used: 45230,
                  resetDate: '2024-02-01T00:00:00Z',
                },
                daily: {
                  limit: 5000,
                  used: 1250,
                  resetDate: '2024-01-21T00:00:00Z',
                },
              };

              set(state => {
                state.quotas = mockQuotas;
              });
            } catch (error) {
              set(state => {
                state.error =
                  error instanceof Error ? error.message : 'Failed to fetch quota limits';
              });
            }
          },

          updateUsage: apiKeyId => {
            set(state => {
              const index = state.apiKeys.findIndex(key => key.id === apiKeyId);
              if (index !== -1) {
                state.apiKeys[index].usageCount += 1;
                state.apiKeys[index].lastUsed = new Date().toISOString();
                state.apiKeys[index].rateLimit.current += 1;
              }

              if (state.quotas) {
                state.quotas.daily.used += 1;
                state.quotas.monthly.used += 1;
              }
            });
          },

          selectApiKey: apiKey => {
            set(state => {
              state.selectedApiKey = apiKey;
            });
          },

          setLoading: loading => {
            set(state => {
              state.isLoading = loading;
            });
          },

          setError: error => {
            set(state => {
              state.error = error;
            });
          },

          clearError: () => {
            set(state => {
              state.error = null;
            });
          },

          getActiveApiKeys: () => {
            return get().apiKeys.filter(key => key.isActive);
          },

          getApiKeyById: id => {
            return get().apiKeys.find(key => key.id === id);
          },

          isQuotaExceeded: () => {
            const { quotas } = get();
            if (!quotas) return false;

            return (
              quotas.daily.used >= quotas.daily.limit || quotas.monthly.used >= quotas.monthly.limit
            );
          },

          getRemainingQuota: () => {
            const { quotas } = get();
            if (!quotas) return { daily: 0, monthly: 0 };

            return {
              daily: Math.max(0, quotas.daily.limit - quotas.daily.used),
              monthly: Math.max(0, quotas.monthly.limit - quotas.monthly.used),
            };
          },
        }),
        {
          name: 'api-store',
          storage: createJSONStorage(() => localStorage),
          partialize: state => ({
            apiKeys: state.apiKeys.map(key => ({
              ...key,
              key: key.key.includes('****')
                ? key.key
                : `${key.key.substring(0, 8)}****************************`,
            })),
            selectedApiKey: state.selectedApiKey
              ? {
                  ...state.selectedApiKey,
                  key: state.selectedApiKey.key.includes('****')
                    ? state.selectedApiKey.key
                    : `${state.selectedApiKey.key.substring(0, 8)}****************************`,
                }
              : null,
          }),
          version: 1,
        }
      )
    )
  )
);

export const useApiKeys = () => useApiStore(state => state.apiKeys);
export const useSelectedApiKey = () => useApiStore(state => state.selectedApiKey);
export const useUsageMetrics = () => useApiStore(state => state.usage);
export const useQuotaLimits = () => useApiStore(state => state.quotas);
export const useApiLoading = () => useApiStore(state => state.isLoading);
export const useApiError = () => useApiStore(state => state.error);

export const useApiActions = () =>
  useApiStore(state => ({
    fetchApiKeys: state.fetchApiKeys,
    createApiKey: state.createApiKey,
    updateApiKey: state.updateApiKey,
    deleteApiKey: state.deleteApiKey,
    toggleApiKey: state.toggleApiKey,
    regenerateApiKey: state.regenerateApiKey,
    fetchUsageMetrics: state.fetchUsageMetrics,
    fetchQuotaLimits: state.fetchQuotaLimits,
    updateUsage: state.updateUsage,
    selectApiKey: state.selectApiKey,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));

export const useApiComputedValues = () =>
  useApiStore(state => ({
    getActiveApiKeys: state.getActiveApiKeys,
    getApiKeyById: state.getApiKeyById,
    isQuotaExceeded: state.isQuotaExceeded,
    getRemainingQuota: state.getRemainingQuota,
  }));

export default useApiStore;
