import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '../../utils/utils';
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';

export interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error' | 'help' | 'tip' | 'security' | 'feature';
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showArrow?: boolean;
  delay?: number;
  className?: string;
  maxWidth?: number;
  interactive?: boolean;
  shortcut?: string;
  onOpenChange?: (open: boolean) => void;
}

const variantConfig = {
  default: {
    icon: Info,
    className: 'bg-popover text-popover-foreground border',
  },
  info: {
    icon: Info,
    className: 'bg-blue-600 text-white border-blue-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-orange-600 text-white border-orange-600',
  },
  success: {
    icon: CheckCircle,
    className: 'bg-green-600 text-white border-green-600',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-600 text-white border-red-600',
  },
  help: {
    icon: HelpCircle,
    className: 'bg-purple-600 text-white border-purple-600',
  },
  tip: {
    icon: Lightbulb,
    className: 'bg-yellow-600 text-white border-yellow-600',
  },
  security: {
    icon: Shield,
    className: 'bg-indigo-600 text-white border-indigo-600',
  },
  feature: {
    icon: Zap,
    className: 'bg-pink-600 text-white border-pink-600',
  },
};

export function EnhancedTooltip({
  children,
  content,
  title,
  variant = 'default',
  side = 'top',
  align = 'center',
  size = 'md',
  showIcon = false,
  showArrow = true,
  delay = 200,
  className,
  maxWidth = 300,
  interactive = false,
  shortcut,
  onOpenChange,
}: EnhancedTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const sizeClasses = {
    sm: 'text-xs p-2 max-w-48',
    md: 'text-sm p-3 max-w-72',
    lg: 'text-base p-4 max-w-96',
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            config.className,
            sizeClasses[size],
            'animate-in fade-in-0 zoom-in-95',
            interactive && 'cursor-pointer',
            className
          )}
          style={{ maxWidth }}
          sideOffset={showArrow ? 4 : 2}
        >
          <div className="space-y-1">
            {/* Title Row */}
            {(title || showIcon) && (
              <div className="flex items-center space-x-2 font-medium">
                {showIcon && <Icon className="h-4 w-4 shrink-0" />}
                {title && <span>{title}</span>}
              </div>
            )}
            
            {/* Content */}
            <div className={cn(
              title || showIcon ? 'text-opacity-90' : '',
              typeof content === 'string' ? 'whitespace-pre-wrap' : ''
            )}>
              {content}
            </div>
            
            {/* Keyboard Shortcut */}
            {shortcut && (
              <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                <kbd className="inline-flex h-5 max-h-full items-center rounded border border-current border-opacity-30 px-1 font-mono text-[10px] font-medium opacity-100">
                  {shortcut}
                </kbd>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Specialized tooltip components for common use cases
export function HelpTooltip({
  children,
  content,
  ...props
}: Omit<EnhancedTooltipProps, 'variant' | 'showIcon'>) {
  return (
    <EnhancedTooltip
      variant="help"
      showIcon={true}
      title="Help"
      content={content}
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function InfoTooltip({
  children,
  content,
  ...props
}: Omit<EnhancedTooltipProps, 'variant' | 'showIcon'>) {
  return (
    <EnhancedTooltip
      variant="info"
      showIcon={true}
      title="Information"
      content={content}
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function WarningTooltip({
  children,
  content,
  ...props
}: Omit<EnhancedTooltipProps, 'variant' | 'showIcon'>) {
  return (
    <EnhancedTooltip
      variant="warning"
      showIcon={true}
      title="Warning"
      content={content}
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function FeatureTooltip({
  children,
  content,
  badge,
  ...props
}: Omit<EnhancedTooltipProps, 'variant' | 'showIcon'> & { badge?: string }) {
  return (
    <EnhancedTooltip
      variant="feature"
      showIcon={true}
      title={badge ? `${badge} Feature` : "New Feature"}
      content={content}
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function ShortcutTooltip({
  children,
  action,
  shortcut,
  ...props
}: Omit<EnhancedTooltipProps, 'content' | 'shortcut'> & {
  action: string;
  shortcut: string;
}) {
  return (
    <EnhancedTooltip
      content={action}
      shortcut={shortcut}
      size="sm"
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

// Rich tooltip with multiple sections
interface RichTooltipProps extends Omit<EnhancedTooltipProps, 'content'> {
  title: string;
  description: string;
  features?: string[];
  shortcuts?: Array<{ label: string; keys: string }>;
  footer?: React.ReactNode;
}

export function RichTooltip({
  children,
  title,
  description,
  features,
  shortcuts,
  footer,
  ...props
}: RichTooltipProps) {
  const content = (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
      
      {features && features.length > 0 && (
        <div>
          <h5 className="text-xs font-medium opacity-75 uppercase tracking-wide mb-1">
            Features
          </h5>
          <ul className="text-sm space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 opacity-60" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {shortcuts && shortcuts.length > 0 && (
        <div>
          <h5 className="text-xs font-medium opacity-75 uppercase tracking-wide mb-1">
            Shortcuts
          </h5>
          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{shortcut.label}</span>
                <kbd className="inline-flex h-5 max-h-full items-center rounded border border-current border-opacity-30 px-1 font-mono text-[10px] font-medium">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {footer && (
        <div className="pt-2 border-t border-current border-opacity-20">
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <EnhancedTooltip
      content={content}
      size="lg"
      interactive={true}
      maxWidth={400}
      {...props}
    >
      {children}
    </EnhancedTooltip>
  );
}

// Tooltip with loading state
interface LoadingTooltipProps extends Omit<EnhancedTooltipProps, 'content'> {
  isLoading: boolean;
  loadingText?: string;
  content: React.ReactNode;
}

export function LoadingTooltip({
  children,
  isLoading,
  loadingText = "Loading...",
  content,
  ...props
}: LoadingTooltipProps) {
  const tooltipContent = isLoading ? (
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      <span>{loadingText}</span>
    </div>
  ) : content;

  return (
    <EnhancedTooltip content={tooltipContent} {...props}>
      {children}
    </EnhancedTooltip>
  );
}

// Hook for managing tooltip state
export function useTooltip() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);

  const show = React.useCallback((content: React.ReactNode) => {
    setContent(content);
    setIsOpen(true);
  }, []);

  const hide = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    content,
    show,
    hide,
    toggle,
    setIsOpen,
    setContent,
  };
}

export default EnhancedTooltip; 