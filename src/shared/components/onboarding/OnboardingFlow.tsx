import React from 'react';
import { X, ChevronLeft, ChevronRight, Check, Play, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '../../utils/utils';

// Types for onboarding steps
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content?: React.ReactNode;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
  skippable?: boolean;
  required?: boolean;
  completed?: boolean;
  type?: 'intro' | 'feature' | 'action' | 'tip' | 'warning';
}

export interface OnboardingFlow {
  id: string;
  title: string;
  description: string;
  steps: OnboardingStep[];
  category: string;
  estimatedTime?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

interface OnboardingFlowProps {
  flow: OnboardingFlow;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (flowId: string) => void;
  onStepComplete?: (stepId: string) => void;
  startFromStep?: number;
  showProgress?: boolean;
  allowSkipping?: boolean;
  overlay?: boolean;
  className?: string;
}

export function OnboardingFlow({
  flow,
  isOpen,
  onClose,
  onComplete,
  onStepComplete,
  startFromStep = 0,
  showProgress = true,
  allowSkipping = true,
  overlay = true,
  className,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState(startFromStep);
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(new Set());
  const [highlightedElement, setHighlightedElement] = React.useState<HTMLElement | null>(null);

  const currentStepData = flow.steps[currentStep];
  const progress = ((currentStep + 1) / flow.steps.length) * 100;
  const isLastStep = currentStep === flow.steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Highlight target element
  React.useEffect(() => {
    if (!currentStepData?.target) return;

    const element = document.querySelector(currentStepData.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);

      // Add highlight classes
      element.classList.add('onboarding-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add overlay to rest of page
      if (overlay) {
        document.body.classList.add('onboarding-active');
      }
    }

    return () => {
      if (element) {
        element.classList.remove('onboarding-highlight');
      }
      document.body.classList.remove('onboarding-active');
    };
  }, [currentStepData?.target, overlay]);

  const handleNext = () => {
    if (currentStepData) {
      setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
      onStepComplete?.(currentStepData.id);
    }

    if (isLastStep) {
      onComplete(flow.id);
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleStepAction = () => {
    if (currentStepData?.action) {
      currentStepData.action.onClick();
    }
  };

  const getStepIcon = (type: OnboardingStep['type']) => {
    switch (type) {
      case 'feature':
        return <Lightbulb className="h-5 w-5" />;
      case 'action':
        return <Play className="h-5 w-5" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5" />;
      case 'warning':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <ArrowRight className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: OnboardingStep['type']) => {
    switch (type) {
      case 'feature':
        return 'bg-blue-500';
      case 'action':
        return 'bg-green-500';
      case 'tip':
        return 'bg-yellow-500';
      case 'warning':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  if (!isOpen || !currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      {overlay && <div className="fixed inset-0 bg-black/50 z-40" />}

      {/* Onboarding Card */}
      <div
        className={cn(
          'fixed z-50 w-full max-w-md',
          currentStepData.position === 'center' &&
            'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          currentStepData.position === 'top' && 'top-4 left-1/2 transform -translate-x-1/2',
          currentStepData.position === 'bottom' && 'bottom-4 left-1/2 transform -translate-x-1/2',
          currentStepData.position === 'left' && 'left-4 top-1/2 transform -translate-y-1/2',
          currentStepData.position === 'right' && 'right-4 top-1/2 transform -translate-y-1/2',
          !currentStepData.position &&
            'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          className
        )}
      >
        <Card className="shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-white text-sm',
                    getStepColor(currentStepData.type)
                  )}
                >
                  {getStepIcon(currentStepData.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                  <CardDescription className="text-sm">
                    Step {currentStep + 1} of {flow.steps.length}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{flow.category}</Badge>
                {allowSkipping && (
                  <Button variant="ghost" size="sm" onClick={handleSkip} className="h-6 w-6 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {showProgress && (
              <div className="mt-3">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="py-4">
            <p className="text-sm mb-4">{currentStepData.description}</p>

            {currentStepData.content && <div className="mb-4">{currentStepData.content}</div>}

            {currentStepData.action && (
              <Button onClick={handleStepAction} className="w-full mb-4" variant="outline">
                {currentStepData.action.label}
              </Button>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              {allowSkipping && !currentStepData.required && (
                <Button variant="ghost" onClick={handleSkip} className="text-xs">
                  Skip Tour
                </Button>
              )}

              <Button onClick={handleNext} className="flex items-center space-x-1">
                <span>{isLastStep ? 'Finish' : 'Next'}</span>
                {isLastStep ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

// Mini tooltip for quick tips
interface QuickTipProps {
  title: string;
  description: string;
  target: string;
  isVisible: boolean;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function QuickTip({
  title,
  description,
  target,
  isVisible,
  onClose,
  onAction,
  actionLabel = 'Got it',
}: QuickTipProps) {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!isVisible || !target) return;

    const element = document.querySelector(target) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });

      element.classList.add('quick-tip-highlight');
    }

    return () => {
      if (element) {
        element.classList.remove('quick-tip-highlight');
      }
    };
  }, [isVisible, target]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 w-64 p-3 bg-popover border rounded-lg shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{title}</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-4 w-4 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{description}</p>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
          Dismiss
        </Button>
        {onAction && (
          <Button size="sm" onClick={onAction} className="text-xs">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// Onboarding checklist
interface OnboardingChecklistProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    action?: () => void;
    actionLabel?: string;
  }>;
  title?: string;
  className?: string;
}

export function OnboardingChecklist({
  items,
  title = 'Getting Started',
  className,
}: OnboardingChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">
            {completedCount}/{items.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Complete these steps to get the most out of Zero Voice Infinity
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className={cn(
                'flex items-start space-x-3 p-3 rounded-lg border',
                item.completed
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : 'bg-muted/30'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full border-2 mt-0.5',
                  item.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-muted-foreground'
                )}
              >
                {item.completed && <Check className="h-3 w-3" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={cn(
                    'font-medium text-sm',
                    item.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>

                {!item.completed && item.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={item.action}
                    className="mt-2 text-xs h-7"
                  >
                    {item.actionLabel || 'Complete'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing onboarding state
export function useOnboarding() {
  const [activeFlow, setActiveFlow] = React.useState<string | null>(null);
  const [completedFlows, setCompletedFlows] = React.useState<Set<string>>(new Set());
  const [quickTips, setQuickTips] = React.useState<Map<string, boolean>>(new Map());

  React.useEffect(() => {
    // Load completed flows from localStorage
    const saved = localStorage.getItem('onboarding-completed');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedFlows(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse onboarding data:', error);
      }
    }
  }, []);

  const startFlow = React.useCallback((flowId: string) => {
    setActiveFlow(flowId);
  }, []);

  const completeFlow = React.useCallback((flowId: string) => {
    setCompletedFlows(prev => {
      const updated = new Set([...prev, flowId]);
      localStorage.setItem('onboarding-completed', JSON.stringify([...updated]));
      return updated;
    });
    setActiveFlow(null);
  }, []);

  const resetFlow = React.useCallback((flowId: string) => {
    setCompletedFlows(prev => {
      const updated = new Set([...prev]);
      updated.delete(flowId);
      localStorage.setItem('onboarding-completed', JSON.stringify([...updated]));
      return updated;
    });
  }, []);

  const showQuickTip = React.useCallback((tipId: string) => {
    setQuickTips(prev => new Map([...prev, [tipId, true]]));
  }, []);

  const hideQuickTip = React.useCallback((tipId: string) => {
    setQuickTips(prev => {
      const updated = new Map([...prev]);
      updated.set(tipId, false);
      return updated;
    });
  }, []);

  return {
    activeFlow,
    completedFlows,
    quickTips,
    startFlow,
    completeFlow,
    resetFlow,
    showQuickTip,
    hideQuickTip,
    isFlowCompleted: (flowId: string) => completedFlows.has(flowId),
    isQuickTipVisible: (tipId: string) => quickTips.get(tipId) === true,
  };
}

export default OnboardingFlow;
