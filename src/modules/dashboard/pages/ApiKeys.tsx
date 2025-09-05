import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  usage: number;
  status: 'active' | 'revoked';
}

export const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production App',
      key: 'zvi_live_1234567890abcdef1234567890abcdef',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      usage: 1247,
      status: 'active',
    },
    {
      id: '2',
      name: 'Development',
      key: 'zvi_test_abcdef1234567890abcdef1234567890',
      created: '2024-01-10',
      lastUsed: '1 day ago',
      usage: 856,
      status: 'active',
    },
    {
      id: '3',
      name: 'Mobile App Beta',
      key: 'zvi_test_567890abcdef1234567890abcdef1234',
      created: '2024-01-05',
      lastUsed: '5 days ago',
      usage: 344,
      status: 'active',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateApiKey = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'zvi_live_';
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generateApiKey(),
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      usage: 0,
      status: 'active',
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setIsCreateModalOpen(false);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newHiddenKeys = new Set(hiddenKeys);
    if (newHiddenKeys.has(keyId)) {
      newHiddenKeys.delete(keyId);
    } else {
      newHiddenKeys.add(keyId);
    }
    setHiddenKeys(newHiddenKeys);
  };

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(
      apiKeys.map(key => (key.id === keyId ? { ...key, status: 'revoked' as const } : key))
    );
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + '••••••••••••••••••••' + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage your API keys for Zero Voice Infinity</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production App, Development"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={!newKeyName.trim()}
                  className="bg-[#2d4cc8] hover:bg-[#1a1947] text-white"
                >
                  Create Key
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">Keep your API keys secure</h3>
              <p className="text-sm text-orange-700 mt-1">
                Never share your API keys publicly or commit them to version control. Store them
                securely and rotate them regularly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map(apiKey => (
          <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Key className="h-5 w-5 text-[#2d4cc8]" />
                    <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                    <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                      {apiKey.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">API Key</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {hiddenKeys.has(apiKey.id) ? maskKey(apiKey.key) : apiKey.key}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="h-6 w-6 p-0"
                        >
                          {hiddenKeys.has(apiKey.id) ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {copiedKey === apiKey.id && (
                          <span className="text-xs text-green-600">Copied!</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500">Created</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-gray-900">{apiKey.created}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500">Usage This Month</p>
                      <p className="text-gray-900 mt-1">{apiKey.usage.toLocaleString()} calls</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-gray-500 text-sm">
                      Last used: <span className="text-gray-900">{apiKey.lastUsed}</span>
                    </p>
                  </div>
                </div>

                <div className="ml-6">
                  {apiKey.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeKey(apiKey.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
            <p className="text-sm text-gray-600 mb-3">
              Include your API key in the Authorization header of your requests:
            </p>
            <code className="block bg-gray-100 p-3 rounded text-sm font-mono">
              curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;https://api.zerovoiceinfinity.com/v1/transcribe
            </code>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rate Limits</h4>
            <p className="text-sm text-gray-600">
              • Developer Plan: 1,000 requests per hour
              <br />
              • Business Plan: 10,000 requests per hour
              <br />• Enterprise Plan: Custom limits
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
