import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Key, BarChart3, Clock, Globe, TrendingUp, Zap, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    {
      title: 'API Calls This Month',
      value: '2,847',
      change: '+12.3%',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active API Keys',
      value: '3',
      change: '+1',
      icon: Key,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Response Time',
      value: '47ms',
      change: '-2ms',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Languages Used',
      value: '8',
      change: '+2',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const quickActions = [
    {
      title: 'Generate API Key',
      description: 'Create a new API key for your projects',
      icon: Plus,
      action: '/dashboard/api-keys',
      color: 'bg-[#2d4cc8]',
    },
    {
      title: 'View Documentation',
      description: 'Learn how to integrate our SDK',
      icon: ExternalLink,
      action: '/dashboard/docs',
      color: 'bg-[#1a1947]',
    },
    {
      title: 'Check Usage',
      description: 'Monitor your API usage and analytics',
      icon: TrendingUp,
      action: '/dashboard/usage',
      color: 'bg-[#4c7cf0]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p
                      className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-[#2d4cc8]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.action}>
                  <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 border-2 hover:border-[#2d4cc8]/20">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-full ${action.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  endpoint: '/v1/transcribe',
                  time: '2 minutes ago',
                  status: 'success',
                  language: 'English',
                },
                {
                  endpoint: '/v1/transcribe',
                  time: '5 minutes ago',
                  status: 'success',
                  language: 'Spanish',
                },
                {
                  endpoint: '/v1/transcribe',
                  time: '8 minutes ago',
                  status: 'success',
                  language: 'French',
                },
                {
                  endpoint: '/v1/transcribe',
                  time: '12 minutes ago',
                  status: 'error',
                  language: 'German',
                },
                {
                  endpoint: '/v1/transcribe',
                  time: '15 minutes ago',
                  status: 'success',
                  language: 'Japanese',
                },
              ].map((call, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${call.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{call.endpoint}</p>
                      <p className="text-sm text-gray-500">{call.language}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{call.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/dashboard/usage">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Current Plan</span>
                <span className="font-medium text-gray-900">{user.plan}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Monthly Usage</span>
                <span className="font-medium text-gray-900">2,847 / 100,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">API Keys</span>
                <span className="font-medium text-gray-900">3 / 10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] h-2 rounded-full"
                  style={{ width: '28%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">28% of monthly quota used</p>
              <div className="mt-4">
                <Link to="/dashboard/billing">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Plan
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
