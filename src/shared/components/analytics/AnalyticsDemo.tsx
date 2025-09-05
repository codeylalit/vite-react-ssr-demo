import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useSSRAnalyticsContext } from './SSRAnalyticsProvider';

export function AnalyticsDemo() {
  const analytics = useSSRAnalyticsContext();

  const handleTrackEvent = () => {
    analytics.trackEvent('button_click', 'interaction', {
      button_name: 'demo_button',
      page: 'analytics_demo',
    });
  };

  const handleTrackConversion = () => {
    analytics.trackConversion('demo_signup', 29.99, 'USD');
  };

  const handleTrackPerformance = () => {
    analytics.trackPerformance('custom_metric', 150, 'ms');
  };

  const handleTrackError = () => {
    analytics.trackError('Demo error for testing', 'demo', {
      component: 'AnalyticsDemo',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>SSR Analytics Demo</CardTitle>
        <CardDescription>
          Test SSR analytics functionality. Check the console for server-side events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Environment:</strong> {analytics.isServerSide ? 'Server' : 'Client'}
          </p>
          <p>
            <strong>Analytics Mode:</strong> {analytics.isServerSide ? 'SSR' : 'Client-side'}
          </p>
        </div>

        <div className="space-y-2">
          <Button onClick={handleTrackEvent} className="w-full">
            Track Custom Event
          </Button>

          <Button onClick={handleTrackConversion} variant="outline" className="w-full">
            Track Conversion
          </Button>

          <Button onClick={handleTrackPerformance} variant="outline" className="w-full">
            Track Performance
          </Button>

          <Button onClick={handleTrackError} variant="destructive" className="w-full">
            Track Error (Demo)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Server-side events are sent to /api/analytics/ssr</p>
          <p>• Client-side events use the existing analytics system</p>
          <p>• Check browser console and server logs for events</p>
        </div>
      </CardContent>
    </Card>
  );
}
