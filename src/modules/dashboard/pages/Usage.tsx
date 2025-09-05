import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { BarChart3, TrendingUp, Clock, Globe } from 'lucide-react';

const Usage = () => {
  // Mock data for demonstration
  const usageData = {
    currentPlan: 'Developer',
    apiCalls: {
      used: 2847,
      limit: 10000,
      percentage: 28.47,
    },
    languages: [
      { name: 'English', calls: 1200, percentage: 42 },
      { name: 'Spanish', calls: 680, percentage: 24 },
      { name: 'French', calls: 420, percentage: 15 },
      { name: 'German', calls: 315, percentage: 11 },
      { name: 'Others', calls: 232, percentage: 8 },
    ],
    responseTime: {
      average: 47,
      trend: -2,
    },
    regions: [
      { name: 'North America', calls: 1423, percentage: 50 },
      { name: 'Europe', calls: 854, percentage: 30 },
      { name: 'Asia Pacific', calls: 427, percentage: 15 },
      { name: 'Others', calls: 143, percentage: 5 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor your API usage and performance metrics</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {usageData.currentPlan} Plan
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#2d4cc8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {usageData.apiCalls.used.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              of {usageData.apiCalls.limit.toLocaleString()} limit
            </p>
            <Progress value={usageData.apiCalls.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-[#2d4cc8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {usageData.responseTime.average}ms
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(usageData.responseTime.trend)}ms faster than last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Used</CardTitle>
            <Globe className="h-4 w-4 text-[#2d4cc8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{usageData.languages.length}</div>
            <p className="text-xs text-gray-500">Active languages this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2d4cc8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">99.8%</div>
            <p className="text-xs text-gray-500">API success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>API calls by language this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]"
                    style={{ opacity: 1 - index * 0.15 }}
                  />
                  <span className="text-sm font-medium">{lang.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{lang.calls.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">({lang.percentage}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>API calls by region this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageData.regions.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.name}</span>
                  <span className="text-sm text-gray-600">
                    {region.calls.toLocaleString()} ({region.percentage}%)
                  </span>
                </div>
                <Progress value={region.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage Limits</CardTitle>
          <CardDescription>Your current plan limits and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Monthly API Calls</h4>
                <p className="text-sm text-gray-600">
                  Used {usageData.apiCalls.used.toLocaleString()} of{' '}
                  {usageData.apiCalls.limit.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {usageData.apiCalls.percentage.toFixed(1)}%
                </div>
                <Progress value={usageData.apiCalls.percentage} className="w-24 h-2 mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Concurrent Requests</h4>
                <p className="text-sm text-gray-600">Up to 10 concurrent requests</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">Available</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Data Retention</h4>
                <p className="text-sm text-gray-600">30 days of usage analytics</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usage;
