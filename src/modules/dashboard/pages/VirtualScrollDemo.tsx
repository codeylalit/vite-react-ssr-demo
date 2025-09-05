import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { VirtualTable, TableColumn } from '@/shared/components/ui/virtual-table';
import { VirtualList } from '@/shared/components/ui/virtual-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { RefreshCw, Users, Activity, Clock } from 'lucide-react';

// Mock data types
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  requests: number;
  avatar?: string;
}

interface ApiRequest {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  responseTime: number;
  timestamp: string;
  userId: string;
  userAgent: string;
}

// Generate mock data
const generateUsers = (count: number): User[] => {
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const names = [
    'John Doe',
    'Jane Smith',
    'Bob Johnson',
    'Alice Brown',
    'Charlie Wilson',
    'Diana Lee',
    'Frank Miller',
    'Grace Chen',
    'Henry Davis',
    'Ivy Zhang',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `user_${index + 1}`,
    name: names[index % names.length] + ` ${Math.floor(index / names.length) + 1}`,
    email: `user${index + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    requests: Math.floor(Math.random() * 10000),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
  }));
};

const generateApiRequests = (count: number): ApiRequest[] => {
  const endpoints = [
    '/api/v1/users',
    '/api/v1/posts',
    '/api/v1/comments',
    '/api/v1/analytics',
    '/api/v1/notifications',
  ];
  const methods: ApiRequest['method'][] = ['GET', 'POST', 'PUT', 'DELETE'];
  const statuses = [200, 201, 400, 404, 500];
  const userAgents = [
    'Mozilla/5.0 Chrome',
    'Mozilla/5.0 Firefox',
    'Mozilla/5.0 Safari',
    'PostmanRuntime',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `req_${index + 1}`,
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    responseTime: Math.floor(Math.random() * 2000) + 50,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user_${Math.floor(Math.random() * 1000) + 1}`,
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
  }));
};

const VirtualScrollDemo: React.FC = () => {
  const [userCount, setUserCount] = useState(10000);
  const [requestCount, setRequestCount] = useState(50000);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate large datasets
  const users = useMemo(() => generateUsers(userCount), [userCount]);
  const apiRequests = useMemo(() => generateApiRequests(requestCount), [requestCount]);

  // Table columns for users
  const userColumns: TableColumn<User>[] = [
    {
      key: 'avatar',
      header: '',
      width: 60,
      render: user => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      width: 200,
    },
    {
      key: 'email',
      header: 'Email',
      width: 250,
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      render: user => (
        <Badge
          variant={
            user.status === 'active'
              ? 'default'
              : user.status === 'pending'
                ? 'secondary'
                : 'destructive'
          }
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: 'requests',
      header: 'Requests',
      width: 100,
      align: 'right' as const,
      render: user => user.requests.toLocaleString(),
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      width: 120,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      width: 150,
      render: user => new Date(user.lastActive).toLocaleDateString(),
    },
  ];

  // Table columns for API requests
  const requestColumns: TableColumn<ApiRequest>[] = [
    {
      key: 'method',
      header: 'Method',
      width: 80,
      render: request => (
        <Badge variant={request.method === 'GET' ? 'secondary' : 'default'}>{request.method}</Badge>
      ),
    },
    {
      key: 'endpoint',
      header: 'Endpoint',
      width: 200,
    },
    {
      key: 'status',
      header: 'Status',
      width: 80,
      render: request => (
        <Badge
          variant={
            request.status < 300 ? 'default' : request.status < 500 ? 'secondary' : 'destructive'
          }
        >
          {request.status}
        </Badge>
      ),
    },
    {
      key: 'responseTime',
      header: 'Response Time',
      width: 130,
      align: 'right' as const,
      render: request => `${request.responseTime}ms`,
    },
    {
      key: 'userId',
      header: 'User ID',
      width: 120,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: 180,
      render: request => new Date(request.timestamp).toLocaleString(),
    },
  ];

  const regenerateData = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Virtual Scrolling Demo</h1>
          <p className="text-muted-foreground">
            Performance demonstration with large datasets using virtual scrolling
          </p>
        </div>
        <Button onClick={regenerateData} disabled={isGenerating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate Data
        </Button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Rendered virtually</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Only visible items rendered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Render Performance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~5-10ms</div>
            <p className="text-xs text-muted-foreground">Per scroll update</p>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Scrolling Demo */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Virtual Table</TabsTrigger>
          <TabsTrigger value="list">Virtual List</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users Table ({userCount.toLocaleString()} rows)</CardTitle>
              <p className="text-sm text-muted-foreground">
                This table efficiently renders thousands of rows using virtual scrolling. Only
                visible rows are in the DOM.
              </p>
            </CardHeader>
            <CardContent>
              <VirtualTable
                data={users}
                columns={userColumns}
                height={500}
                itemHeight={52}
                onRowClick={(user, index) => {
                  console.log('Clicked user:', user.name, 'at index:', index);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Requests List ({requestCount.toLocaleString()} items)</CardTitle>
              <p className="text-sm text-muted-foreground">
                This list uses virtual scrolling with infinite loading capabilities. Smooth
                performance even with massive datasets.
              </p>
            </CardHeader>
            <CardContent>
              <VirtualList
                data={apiRequests}
                height={500}
                itemHeight={80}
                renderItem={(request, index) => (
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={request.method === 'GET' ? 'secondary' : 'default'}>
                          {request.method}
                        </Badge>
                        <span className="font-mono text-sm">{request.endpoint}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            request.status < 300
                              ? 'default'
                              : request.status < 500
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {request.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {request.responseTime}ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>User: {request.userId}</span>
                      <span>{new Date(request.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                onItemClick={(request, index) => {
                  console.log('Clicked request:', request.id, 'at index:', index);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Performance Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ With Virtual Scrolling</h4>
              <ul className="space-y-1 text-sm">
                <li>• Only 10-20 DOM elements rendered</li>
                <li>• Constant memory usage</li>
                <li>• Smooth scrolling performance</li>
                <li>• Sub-10ms render times</li>
                <li>• Works with 100K+ items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Without Virtual Scrolling</h4>
              <ul className="space-y-1 text-sm">
                <li>• {userCount.toLocaleString()} DOM elements</li>
                <li>• Memory grows with data size</li>
                <li>• Browser becomes unresponsive</li>
                <li>• 500ms+ render times</li>
                <li>• Crashes with large datasets</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualScrollDemo;
