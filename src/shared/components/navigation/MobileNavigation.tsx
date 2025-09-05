import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Key,
  Settings,
  User,
  Menu,
  X,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import useMobileOptimization, { useResponsiveBreakpoints } from '../../hooks/useMobileOptimization';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { cn } from '../../utils/utils';

interface MobileNavigationProps {
  onRefresh?: () => Promise<void>;
  showBackButton?: boolean;
  title?: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { id: 'api-keys', label: 'API Keys', path: '/dashboard/api-keys', icon: Key },
  { id: 'usage', label: 'Usage', path: '/dashboard/usage', icon: BarChart3 },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function MobileNavigation({ onRefresh, showBackButton, title }: MobileNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isMobile,
    isPulling,
    pullDistance,
    enablePullToRefresh,
    triggerHaptic,
    getAdaptiveClasses,
    getSafeAreaStyles,
  } = useMobileOptimization();
  const { isMobile: isBreakpointMobile } = useResponsiveBreakpoints();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Set up pull-to-refresh
  React.useEffect(() => {
    if (onRefresh && isMobile) {
      const cleanup = enablePullToRefresh(async () => {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      });
      return cleanup;
    }
  }, [enablePullToRefresh, onRefresh, isMobile]);

  const handleNavItemClick = (path: string) => {
    triggerHaptic('light');
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleBackClick = () => {
    triggerHaptic('light');
    navigate(-1);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Mobile header with hamburger menu and back button
  const MobileHeader = () => (
    <div
      className={cn(
        'mobile-nav-header fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200',
        getAdaptiveClasses()
      )}
      style={getSafeAreaStyles()}
    >
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div className={cn('pull-indicator', isPulling && 'pulling')}>
          <RefreshCw className={cn('w-5 h-5', isRefreshing ? 'animate-spin' : '')} />
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 min-h-[64px]">
        {/* Left side - Back button or Menu */}
        <div className="flex items-center">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="touch-feedback p-2 h-10 w-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="touch-feedback p-2 h-10 w-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="mobile-modal w-80">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <MobileMenu />
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title || 'Zero Voice Infinity'}
          </h1>
        </div>

        {/* Right side - User menu */}
        <Button variant="ghost" size="sm" className="touch-feedback p-2 h-10 w-10">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  // Mobile menu content
  const MobileMenu = () => (
    <div className="mobile-menu py-4">
      <nav className="space-y-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavItemClick(item.path)}
            className={cn(
              'mobile-nav-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors touch-feedback',
              isActiveRoute(item.path)
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-base">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Additional menu items */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="mobile-nav-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 touch-feedback">
            <User className="w-5 h-5" />
            <span className="text-base">Profile</span>
          </button>

          <button className="mobile-nav-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 touch-feedback">
            <X className="w-5 h-5" />
            <span className="text-base">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Bottom navigation bar for mobile
  const MobileBottomNav = () => (
    <div
      className={cn(
        'mobile-nav fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200',
        getAdaptiveClasses()
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => handleNavItemClick(item.path)}
            className={cn(
              'mobile-nav-item flex flex-col items-center justify-center min-w-[64px] py-2 px-1 rounded-lg transition-colors touch-feedback',
              isActiveRoute(item.path) ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium truncate max-w-[48px]">{item.label}</span>
            {item.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop navigation fallback
  const DesktopNav = () => (
    <nav className="hidden lg:flex items-center space-x-6">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isActiveRoute(item.path)
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  // Show mobile navigation only on mobile devices
  if (!isBreakpointMobile && !isMobile) {
    return <DesktopNav />;
  }

  return (
    <>
      <MobileHeader />
      <MobileBottomNav />

      {/* Add top and bottom padding to main content to account for fixed navigation */}
      <style>{`
        .mobile-nav-content {
          padding-top: 64px;
          padding-bottom: calc(64px + env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
}

// Hook to provide mobile navigation utilities
export function useMobileNavigation() {
  const { isMobile } = useMobileOptimization();
  const { isMobile: isBreakpointMobile } = useResponsiveBreakpoints();

  const isActiveMobile = isBreakpointMobile || isMobile;

  return {
    isMobile: isActiveMobile,
    addMobileContentClass: (className: string) =>
      isActiveMobile ? `${className} mobile-nav-content` : className,
  };
}

export default MobileNavigation;
