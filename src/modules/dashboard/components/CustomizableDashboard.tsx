import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WidgetBase, WidgetConfig } from './widgets/WidgetBase';
import { StatsWidget } from './widgets/StatsWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  Plus, 
  Save, 
  Upload, 
  Download, 
  Grid3X3, 
  BarChart3, 
  Activity, 
  FileText,
  Settings
} from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';

type WidgetType = 'stats' | 'chart' | 'table' | 'text';

interface WidgetTemplate {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultConfig: Partial<WidgetConfig>;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    type: 'stats',
    title: 'Statistics Widget',
    description: 'Display key metrics and KPIs',
    icon: <Activity className="h-6 w-6" />,
    defaultConfig: {
      title: 'Statistics',
      size: 'medium',
      minimized: false,
    },
  },
  {
    type: 'chart',
    title: 'Chart Widget',
    description: 'Visualize data with charts',
    icon: <BarChart3 className="h-6 w-6" />,
    defaultConfig: {
      title: 'Chart',
      size: 'large',
      minimized: false,
    },
  },
  {
    type: 'table',
    title: 'Data Table',
    description: 'Display tabular data',
    icon: <Grid3X3 className="h-6 w-6" />,
    defaultConfig: {
      title: 'Data Table',
      size: 'large',
      minimized: false,
    },
  },
  {
    type: 'text',
    title: 'Text Widget',
    description: 'Display text content or notes',
    icon: <FileText className="h-6 w-6" />,
    defaultConfig: {
      title: 'Notes',
      size: 'small',
      minimized: false,
    },
  },
];

interface SortableWidgetProps {
  widget: WidgetConfig;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onConfigure?: (id: string) => void;
}

function SortableWidget({ widget, onUpdate, onRemove, onConfigure }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'stats':
        return (
          <StatsWidget
            config={widget}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onConfigure={onConfigure}
          />
        );
      case 'chart':
        return (
          <ChartWidget
            config={widget}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onConfigure={onConfigure}
          />
        );
      default:
        return (
          <WidgetBase
            config={widget}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onConfigure={onConfigure}
            dragHandleProps={{ ...attributes, ...listeners }}
            isDragging={isDragging}
          >
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {widget.type} widget (coming soon)
            </div>
          </WidgetBase>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="widget-container">
      {React.cloneElement(renderWidget() as React.ReactElement, {
        dragHandleProps: { ...attributes, ...listeners },
        isDragging,
      })}
    </div>
  );
}

interface CustomizableDashboardProps {
  dashboardId?: string;
  className?: string;
}

export function CustomizableDashboard({ 
  dashboardId = 'default',
  className = '' 
}: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState('My Dashboard');

  // Load dashboard configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem(`dashboard-${dashboardId}`);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setWidgets(config.widgets || []);
        setDashboardTitle(config.title || 'My Dashboard');
      } catch (error) {
        console.error('Failed to load dashboard config:', error);
        loadDefaultWidgets();
      }
    } else {
      loadDefaultWidgets();
    }
  }, [dashboardId]);

  const loadDefaultWidgets = () => {
    const defaultWidgets: WidgetConfig[] = [
      {
        id: '1',
        title: 'API Statistics',
        type: 'stats',
        size: 'medium',
        position: { x: 0, y: 0 },
        minimized: false,
      },
      {
        id: '2',
        title: 'Usage Chart',
        type: 'chart',
        size: 'large',
        position: { x: 1, y: 0 },
        minimized: false,
        settings: {
          chartType: 'line',
          timePeriod: '7d',
        },
      },
    ];
    setWidgets(defaultWidgets);
  };

  // Save dashboard configuration
  const saveDashboard = useCallback(() => {
    const config = {
      title: dashboardTitle,
      widgets,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(`dashboard-${dashboardId}`, JSON.stringify(config));
    toast({
      title: 'Dashboard Saved',
      description: 'Your dashboard configuration has been saved.',
    });
  }, [dashboardId, dashboardTitle, widgets]);

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(saveDashboard, 2000);
    return () => clearTimeout(timer);
  }, [widgets, dashboardTitle, saveDashboard]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const addWidget = (type: WidgetType, template: WidgetTemplate) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      position: { x: 0, y: 0 },
      ...template.defaultConfig,
    } as WidgetConfig;

    setWidgets(prev => [...prev, newWidget]);
    setIsAddWidgetOpen(false);
    toast({
      title: 'Widget Added',
      description: `${template.title} has been added to your dashboard.`,
    });
  };

  const updateWidget = (updatedWidget: WidgetConfig) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    );
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    toast({
      title: 'Widget Removed',
      description: 'The widget has been removed from your dashboard.',
    });
  };

  const exportDashboard = () => {
    const config = {
      title: dashboardTitle,
      widgets,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${dashboardId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDashboard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        setDashboardTitle(config.title || 'Imported Dashboard');
        setWidgets(config.widgets || []);
        toast({
          title: 'Dashboard Imported',
          description: 'Your dashboard has been imported successfully.',
        });
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Failed to import dashboard. Please check the file format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const activeWidget = widgets.find(widget => widget.id === activeId);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{dashboardTitle}</h1>
          <p className="text-muted-foreground">
            Customize your dashboard with drag-and-drop widgets
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Export/Import */}
          <Button variant="outline" onClick={exportDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <input
            type="file"
            accept=".json"
            onChange={importDashboard}
            className="hidden"
            id="import-dashboard"
          />
          <Button variant="outline" asChild>
            <label htmlFor="import-dashboard" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </label>
          </Button>

          {/* Settings */}
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dashboard Settings</DialogTitle>
                <DialogDescription>
                  Configure your dashboard preferences
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dashboard-title">Dashboard Title</Label>
                  <Input
                    id="dashboard-title"
                    value={dashboardTitle}
                    onChange={(e) => setDashboardTitle(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsConfigOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Widget */}
          <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
                <DialogDescription>
                  Choose a widget type to add to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {widgetTemplates.map((template) => (
                  <Card
                    key={template.type}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addWidget(template.type, template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{template.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Grid */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onUpdate={updateWidget}
                onRemove={removeWidget}
              />
            ))}
          </div>
        </SortableContext>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeWidget && (
            <div className="opacity-80">
              <SortableWidget
                widget={activeWidget}
                onUpdate={updateWidget}
                onRemove={removeWidget}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Grid3X3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your dashboard by adding your first widget
          </p>
          <Button onClick={() => setIsAddWidgetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Widget
          </Button>
        </div>
      )}
    </div>
  );
} 