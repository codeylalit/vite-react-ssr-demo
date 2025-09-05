import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { usePerformanceMonitoring } from '../../hooks/usePerformanceMonitoring';

export function PerformanceMonitor() {
  const [state, actions] = usePerformanceMonitoring();
  const { metrics, alerts, isLoading, history } = state;
  const { runAudit, clearAlerts, acknowledgeAlert, exportData } = actions;

  // Format metric values
  const formatMetric = (value: number | undefined, unit = 'ms'): string => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  // Get metric status color
  const getMetricStatus = (value: number | undefined, good: number, poor: number) => {
    if (value === undefined) return 'gray';
    if (value <= good) return 'green';
    if (value <= poor) return 'yellow';
    return 'red';
  };

  // Get metric progress value
  const getMetricProgress = (value: number | undefined, max: number) => {
    if (value === undefined) return 0;
    return Math.min((value / max) * 100, 100);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time Core Web Vitals and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={runAudit} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Performance Alerts</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={clearAlerts}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map(alert => (
              <Alert key={alert.id} className="flex items-center justify-between">
                <AlertDescription className="flex-1">
                  <span className="font-medium">{alert.metric.toUpperCase()}:</span> {alert.message}
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="ml-2"
                >
                  Acknowledge
                </Button>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Largest Contentful Paint */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Contentful Paint</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.lcp)}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.lcp, 4000)} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.lcp, 2500, 4000) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.lcp, 2500, 4000) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* First Input Delay */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Input Delay</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.fid)}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.fid, 300)} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.fid, 100, 300) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.fid, 100, 300) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cumulative Layout Shift */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative Layout Shift</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.cls, '')}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.cls, 0.25) * 100} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.cls, 0.1, 0.25) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.cls, 0.1, 0.25) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* First Contentful Paint */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Contentful Paint</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.fcp)}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.fcp, 3000)} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.fcp, 1800, 3000) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.fcp, 1800, 3000) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Time to First Byte */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to First Byte</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.ttfb)}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.ttfb, 1800)} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.ttfb, 800, 1800) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.ttfb, 800, 1800) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Time to Interactive */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Interactive</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(metrics?.tti)}</div>
            <div className="mt-2">
              <Progress value={getMetricProgress(metrics?.tti, 7300)} className="h-2" />
            </div>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  getMetricStatus(metrics?.tti, 3800, 7300) === 'green' ? 'default' : 'destructive'
                }
              >
                {getMetricStatus(metrics?.tti, 3800, 7300) === 'green' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>
              Recent performance measurements ({history.length} entries)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              History tracking is active. Data points are collected every 30 seconds.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
