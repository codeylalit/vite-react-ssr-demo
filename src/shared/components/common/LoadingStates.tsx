import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, Zap } from 'lucide-react';

// Generic loading spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

// Page loading overlay
export const PageLoadingOverlay: React.FC<{ isLoading: boolean; text?: string }> = ({
  isLoading,
  text = 'Loading...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-auto min-w-[200px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">{text}</p>
              <LoadingSpinner size="sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard skeleton loader
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-10 w-[120px]" />
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[80px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Chart area */}
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>

    {/* Table area */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-[40px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// API Keys table skeleton
export const ApiKeysTableSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Usage chart skeleton
export const UsageChartSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[30px]" />
          ))}
        </div>
        <div className="flex items-end space-x-2 h-[200px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Settings form skeleton
export const SettingsFormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Billing information skeleton
export const BillingSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Current plan */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardContent>
    </Card>

    {/* Usage */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[80px]" />
        <Skeleton className="h-4 w-[180px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Billing history */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-4 w-[220px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded">
              <div className="space-y-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Generic card skeleton
export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </CardContent>
  </Card>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 border rounded">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    ))}
  </div>
);

// Button loading state
interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  [key: string]: any;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  loadingText,
  className,
  ...props
}) => {
  return (
    <button className={cn('flex items-center gap-2', className)} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading ? loadingText || 'Loading...' : children}
    </button>
  );
};
