import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  MoreVertical, 
  Settings, 
  X, 
  Maximize2, 
  Minimize2,
  GripVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface WidgetConfig {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large' | 'xl';
  position: { x: number; y: number };
  minimized: boolean;
  settings?: Record<string, any>;
}

interface WidgetBaseProps {
  config: WidgetConfig;
  children: React.ReactNode;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function WidgetBase({
  config,
  children,
  onUpdate,
  onRemove,
  onConfigure,
  className,
  isDragging,
  dragHandleProps,
}: WidgetBaseProps) {
  const [isHovered, setIsHovered] = useState(false);

  const toggleMinimized = () => {
    onUpdate({
      ...config,
      minimized: !config.minimized,
    });
  };

  const handleSizeChange = (newSize: WidgetConfig['size']) => {
    onUpdate({
      ...config,
      size: newSize,
    });
  };

  const sizeClasses = {
    small: 'w-full h-48',
    medium: 'w-full h-64',
    large: 'w-full h-80',
    xl: 'w-full h-96',
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 relative group',
        sizeClasses[config.size],
        isDragging && 'shadow-lg scale-105 z-50',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className={cn(
              'cursor-grab active:cursor-grabbing p-1 rounded',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              isHovered && 'opacity-100'
            )}
            aria-label={`Drag ${config.title} widget`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <CardTitle className="text-sm font-medium truncate">
            {config.title}
          </CardTitle>
        </div>

        {/* Widget Controls */}
        <div className={cn(
          'flex items-center space-x-1',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          isHovered && 'opacity-100'
        )}>
          {/* Minimize/Maximize */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMinimized}
            className="h-6 w-6 p-0"
            aria-label={config.minimized ? 'Maximize widget' : 'Minimize widget'}
          >
            {config.minimized ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <Minimize2 className="h-3 w-3" />
            )}
          </Button>

          {/* Settings Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                aria-label="Widget options"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onConfigure && (
                <>
                  <DropdownMenuItem onClick={() => onConfigure(config.id)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem 
                onClick={() => handleSizeChange('small')}
                className={config.size === 'small' ? 'bg-accent' : ''}
              >
                Small Size
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleSizeChange('medium')}
                className={config.size === 'medium' ? 'bg-accent' : ''}
              >
                Medium Size
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleSizeChange('large')}
                className={config.size === 'large' ? 'bg-accent' : ''}
              >
                Large Size
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleSizeChange('xl')}
                className={config.size === 'xl' ? 'bg-accent' : ''}
              >
                Extra Large
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onRemove(config.id)}
                className="text-destructive focus:text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Remove Widget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Widget Content */}
      {!config.minimized && (
        <CardContent className="p-4 pt-0 h-full overflow-hidden">
          <div className="h-full w-full">
            {children}
          </div>
        </CardContent>
      )}

      {/* Minimized Placeholder */}
      {config.minimized && (
        <CardContent className="p-4 pt-0 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Widget minimized</span>
        </CardContent>
      )}
    </Card>
  );
}

// Widget wrapper for drag and drop functionality
interface DraggableWidgetProps extends Omit<WidgetBaseProps, 'dragHandleProps' | 'isDragging'> {
  index: number;
}

export function DraggableWidget(props: DraggableWidgetProps) {
  // This will be enhanced with actual drag-and-drop logic
  return <WidgetBase {...props} />;
} 