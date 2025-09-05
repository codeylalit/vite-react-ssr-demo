import React, { useState, useMemo } from 'react';
import { WidgetBase, WidgetConfig } from './WidgetBase';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  Calendar,
  RefreshCcw
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartWidgetProps {
  config: WidgetConfig;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onConfigure?: (id: string) => void;
  data?: ChartDataPoint[];
}

type ChartType = 'line' | 'bar' | 'pie' | 'area';
type TimePeriod = '24h' | '7d' | '30d' | '90d';

const defaultData: ChartDataPoint[] = [
  { label: 'Jan', value: 4000, color: '#8884d8' },
  { label: 'Feb', value: 3000, color: '#82ca9d' },
  { label: 'Mar', value: 2000, color: '#ffc658' },
  { label: 'Apr', value: 2780, color: '#ff7300' },
  { label: 'May', value: 1890, color: '#00ff00' },
  { label: 'Jun', value: 2390, color: '#ff00ff' },
  { label: 'Jul', value: 3490, color: '#00ffff' },
];

export function ChartWidget({
  config,
  onUpdate,
  onRemove,
  onConfigure,
  data = defaultData
}: ChartWidgetProps) {
  const [chartType, setChartType] = useState<ChartType>(
    config.settings?.chartType || 'line'
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    config.settings?.timePeriod || '7d'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const chartSettings = useMemo(() => ({
    ...config.settings,
    chartType,
    timePeriod,
  }), [config.settings, chartType, timePeriod]);

  const handleChartTypeChange = (newType: ChartType) => {
    setChartType(newType);
    onUpdate({
      ...config,
      settings: { ...chartSettings, chartType: newType },
    });
  };

  const handleTimePeriodChange = (newPeriod: TimePeriod) => {
    setTimePeriod(newPeriod);
    onUpdate({
      ...config,
      settings: { ...chartSettings, timePeriod: newPeriod },
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getChartIcon = (type: ChartType) => {
    switch (type) {
      case 'line':
        return <LineChart className="h-4 w-4" />;
      case 'bar':
        return <BarChart3 className="h-4 w-4" />;
      case 'pie':
        return <PieChart className="h-4 w-4" />;
      case 'area':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <LineChart className="h-4 w-4" />;
    }
  };

  const renderSimpleLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <div className="w-full h-full relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 380 + 10;
              const y = 190 - ((point.value - minValue) / range) * 170;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 380 + 10;
            const y = 190 - ((point.value - minValue) / range) * 170;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="hover:r-4 transition-all"
              />
            );
          })}
          
          {/* Labels */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 380 + 10;
            return (
              <text
                key={index}
                x={x}
                y="195"
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderSimpleBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = 380 / data.length - 10;

    return (
      <div className="w-full h-full relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {data.map((point, index) => {
            const height = (point.value / maxValue) * 160;
            const x = index * (380 / data.length) + 20;
            const y = 170 - height;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill={point.color || '#3b82f6'}
                  className="hover:opacity-80 transition-opacity"
                />
                <text
                  x={x + barWidth / 2}
                  y="190"
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {point.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-800"
                >
                  {point.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderSimplePieChart = () => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;
    const radius = 70;
    const centerX = 200;
    const centerY = 100;

    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <svg className="w-full h-full max-w-sm" viewBox="0 0 400 200">
          {data.map((point, index) => {
            const angle = (point.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={point.color || `hsl(${index * 60}, 70%, 50%)`}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
          
          {/* Legend */}
          {data.map((point, index) => (
            <g key={`legend-${index}`}>
              <rect
                x={320}
                y={20 + index * 20}
                width={12}
                height={12}
                fill={point.color || `hsl(${index * 60}, 70%, 50%)`}
              />
              <text
                x={340}
                y={30 + index * 20}
                className="text-xs fill-gray-600"
              >
                {point.label}: {point.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderSimpleBarChart();
      case 'pie':
        return renderSimplePieChart();
      case 'line':
      case 'area':
      default:
        return renderSimpleLineChart();
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
        {/* Chart Controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            {getChartIcon(chartType)}
            <Select value={chartType} onValueChange={handleChartTypeChange}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCcw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 overflow-hidden bg-muted/20 rounded-lg p-4">
          {isRefreshing ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderChart()
          )}
        </div>

        {/* Chart Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-medium">
                {data.reduce((sum, point) => sum + point.value, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-sm font-medium">
                {Math.round(data.reduce((sum, point) => sum + point.value, 0) / data.length).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Period</p>
              <p className="text-sm font-medium">{timePeriod}</p>
            </div>
          </div>
        </div>
      </div>
    </WidgetBase>
  );
} 