import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { User, Mail, Shield, Bell, Globe, Trash2 } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    timezone: 'UTC',
    notifications: {
      email: true,
      usage: true,
      billing: false,
      security: true,
    },
  });

  const handleSave = () => {
    // Mock save functionality
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and security settings
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-[#2d4cc8]" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>Update your basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={e => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={value => setSettings({ ...settings, timezone: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-[#2d4cc8]" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'usage', label: 'Usage Alerts', desc: 'Notify when approaching usage limits' },
            { key: 'billing', label: 'Billing Updates', desc: 'Payment and invoice notifications' },
            { key: 'security', label: 'Security Alerts', desc: 'Account security notifications' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
              <Switch
                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                onCheckedChange={checked =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [item.key]: checked },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#2d4cc8]" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Password</h4>
              <p className="text-sm text-gray-600 mb-3">Last changed 30 days ago</p>
              <Button variant="outline">Change Password</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="destructive">Disabled</Badge>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-[#2d4cc8]" />
            <span>API Settings</span>
          </CardTitle>
          <CardDescription>Configure your API preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Default Language</h4>
            <Select defaultValue="en-US">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
                <SelectItem value="de-DE">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Rate Limiting</h4>
            <p className="text-sm text-gray-600">Current plan: 10 requests/second</p>
            <Button variant="outline" className="mt-2">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
