import React from 'react';
import { WidgetBase, WidgetConfig } from './WidgetBase';
import { Card, CardContent } from '@/shared/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatData {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
  icon?: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
}

interface StatsWidgetProps {
  config: WidgetConfig;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onConfigure?: (id: string) => void;
  data?: StatData[];
}

const defaultStats: StatData[] = [
  {
    id: '1',
    label: 'Total API Calls',
    value: 125847,
    change: 12.5,
    changeType: 'increase',
    period: 'vs last month',
    icon: <Activity className="h-4 w-4" />,
    format: 'number'
  },
  {
    id: '2',
    label: 'Active Users',
    value: 2847,
    change: -3.2,
    changeType: 'decrease',
    period: 'vs last week',
    icon: <Users className="h-4 w-4" />,
    format: 'number'
  },
  {
    id: '3',
    label: 'Revenue',
    value: 48392,
    change: 8.7,
    changeType: 'increase',
    period: 'vs last month',
    icon: <DollarSign className="h-4 w-4" />,
    format: 'currency'
  },
  {
    id: '4',
    label: 'Success Rate',
    value: 99.2,
    change: 0.5,
    changeType: 'increase',
    period: 'vs last week',
    icon: <TrendingUp className="h-4 w-4" />,
    format: 'percentage'
  }
];

export function StatsWidget({
  config,
  onUpdate,
  onRemove,
  onConfigure,
  data = defaultStats
}: StatsWidgetProps) {
  
  const formatValue = (value: string | number, format: StatData['format']) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getChangeIcon = (changeType: StatData['changeType']) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="h-3 w-3" />;
      case 'decrease':
        return <ArrowDownRight className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: StatData['changeType']) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-50';
      case 'decrease':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderStatCard = (stat: StatData, index: number) => (
    <Card key={stat.id} className="border-0 shadow-none bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {stat.icon && (
              <div className="p-2 bg-primary/10 rounded-lg">
                {stat.icon}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-lg font-bold">
                {formatValue(stat.value, stat.format)}
              </p>
            </div>
          </div>
          
          {stat.change !== undefined && (
            <div className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              getChangeColor(stat.changeType)
            )}>
              {getChangeIcon(stat.changeType)}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
        
        {stat.period && (
          <p className="text-xs text-muted-foreground mt-2">
            {stat.period}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderGridLayout = () => {
    const visibleStats = data.slice(0, getMaxStatsForSize());
    
    switch (config.size) {
      case 'small':
        return (
          <div className="grid grid-cols-1 gap-2">
            {visibleStats.map(renderStatCard)}
          </div>
        );
      case 'medium':
        return (
          <div className="grid grid-cols-2 gap-3">
            {visibleStats.map(renderStatCard)}
          </div>
        );
      case 'large':
      case 'xl':
        return (
          <div className="grid grid-cols-2 gap-4">
            {visibleStats.map(renderStatCard)}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 gap-3">
            {visibleStats.map(renderStatCard)}
          </div>
        );
    }
  };

  const getMaxStatsForSize = () => {
    switch (config.size) {
      case 'small':
        return 2;
      case 'medium':
        return 4;
      case 'large':
        return 6;
      case 'xl':
        return 8;
      default:
        return 4;
    }
  };

  return (
    <WidgetBase
      config={config}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onConfigure={onConfigure}
    >
      <div className="h-full flex flex-col">
        {/* Header with period selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Live Statistics</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-hidden">
          {renderGridLayout()}
        </div>

        {/* Footer with additional info */}
        {data.length > getMaxStatsForSize() && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Showing {getMaxStatsForSize()} of {data.length} statistics
            </p>
          </div>
        )}
      </div>
    </WidgetBase>
  );
}