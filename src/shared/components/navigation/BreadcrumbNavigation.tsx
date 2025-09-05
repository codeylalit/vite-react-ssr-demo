import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '../../utils/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  showHomeButton?: boolean;
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
  showCurrentPage?: boolean;
  customLabels?: Record<string, string>;
}

export function BreadcrumbNavigation({
  items,
  showBackButton = true,
  showHomeButton = true,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  className,
  maxItems = 5,
  showCurrentPage = true,
  customLabels = {},
}: BreadcrumbNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-generate breadcrumbs from current route if no items provided
  const autoBreadcrumbs = React.useMemo(() => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home
    if (showHomeButton) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
      });
    }

    // Generate breadcrumbs from path
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Use custom label if available, otherwise format segment
      const label =
        customLabels[segment] ||
        segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      breadcrumbs.push({
        label,
        href: isLast && !showCurrentPage ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  }, [location.pathname, items, showHomeButton, showCurrentPage, customLabels]);

  // Truncate breadcrumbs if too many
  const displayBreadcrumbs = React.useMemo(() => {
    if (autoBreadcrumbs.length <= maxItems) return autoBreadcrumbs;

    const first = autoBreadcrumbs[0];
    const last = autoBreadcrumbs.slice(-2); // Last 2 items
    const middle = autoBreadcrumbs.slice(1, -2);

    if (middle.length === 0) return autoBreadcrumbs;

    return [first, { label: '...', href: undefined }, ...last];
  }, [autoBreadcrumbs, maxItems]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn('flex items-center space-x-2', className)}
    >
      {/* Back Button */}
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 px-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Breadcrumb Trail */}
      <ol className="flex items-center space-x-1 text-sm">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {isEllipsis ? (
                <span className="text-muted-foreground px-2">...</span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-1 rounded-md px-2 py-1 transition-colors',
                    'hover:bg-muted hover:text-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    item.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1',
                    item.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Compact breadcrumb variant for mobile
export function CompactBreadcrumb({
  className,
  showBackButton = true,
}: {
  className?: string;
  showBackButton?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPageName = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return 'Home';

    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav
      aria-label="Compact breadcrumb navigation"
      className={cn('flex items-center space-x-2', className)}
    >
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 px-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <span className="text-sm font-medium text-foreground">{currentPageName}</span>
    </nav>
  );
}

// Hook for custom breadcrumb management
export function useBreadcrumbs() {
  const [customBreadcrumbs, setCustomBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  const setBreadcrumbs = React.useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setCustomBreadcrumbs(breadcrumbs);
  }, []);

  const addBreadcrumb = React.useCallback((breadcrumb: BreadcrumbItem) => {
    setCustomBreadcrumbs(prev => [...prev, breadcrumb]);
  }, []);

  const removeBreadcrumb = React.useCallback((index: number) => {
    setCustomBreadcrumbs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearBreadcrumbs = React.useCallback(() => {
    setCustomBreadcrumbs([]);
  }, []);

  return {
    breadcrumbs: customBreadcrumbs,
    setBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs,
  };
}

// Predefined route labels for better UX
export const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  'api-keys': 'API Keys',
  usage: 'Usage & Analytics',
  billing: 'Billing & Plans',
  settings: 'Settings',
  support: 'Help & Support',
  docs: 'Documentation',
  overview: 'Overview',
  analytics: 'Analytics',
  profile: 'Profile',
  security: 'Security',
  notifications: 'Notifications',
  integrations: 'Integrations',
  team: 'Team Management',
  audit: 'Audit Logs',
};

export default BreadcrumbNavigation;
