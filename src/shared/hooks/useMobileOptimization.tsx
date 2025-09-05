import React from 'react';

// Types for touch gestures
export interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'pan';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  scale?: number;
  touches: number;
}

export interface MobileOptimizationConfig {
  enableTouchGestures: boolean;
  swipeThreshold: number;
  longPressDelay: number;
  enableHaptics: boolean;
  optimizeScrolling: boolean;
  enablePullToRefresh: boolean;
  adaptiveLayout: boolean;
}

interface TouchEventData {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  touches: number;
}

const DEFAULT_CONFIG: MobileOptimizationConfig = {
  enableTouchGestures: true,
  swipeThreshold: 50,
  longPressDelay: 500,
  enableHaptics: true,
  optimizeScrolling: true,
  enablePullToRefresh: true,
  adaptiveLayout: true,
};

export function useMobileOptimization(config: Partial<MobileOptimizationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Device detection
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');
  const [touchSupport, setTouchSupport] = React.useState(false);
  const [networkType, setNetworkType] = React.useState<string>('unknown');

  // Touch gesture tracking
  const touchDataRef = React.useRef<TouchEventData | null>(null);
  const [currentGesture, setCurrentGesture] = React.useState<TouchGesture | null>(null);

  // Initialize device detection
  React.useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletDevice = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
      
      setIsMobile(isMobileDevice && !isTabletDevice);
      setIsTablet(isTabletDevice);
      setTouchSupport('ontouchstart' in window || navigator.maxTouchPoints > 0);
      
      // Detect network type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkType(connection.effectiveType || 'unknown');
      }
    };

    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    detectDevice();
    handleOrientationChange();

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Haptic feedback
  const triggerHaptic = React.useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!finalConfig.enableHaptics || !('vibrate' in navigator)) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
    };

    navigator.vibrate(patterns[type]);
  }, [finalConfig.enableHaptics]);

  // Touch gesture handlers
  const handleTouchStart = React.useCallback((event: TouchEvent) => {
    if (!finalConfig.enableTouchGestures) return;

    const touch = event.touches[0];
    touchDataRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime: Date.now(),
      touches: event.touches.length,
    };

    // Handle long press detection
    setTimeout(() => {
      if (touchDataRef.current && Date.now() - touchDataRef.current.startTime >= finalConfig.longPressDelay) {
        const distance = Math.sqrt(
          Math.pow(touchDataRef.current.currentX - touchDataRef.current.startX, 2) +
          Math.pow(touchDataRef.current.currentY - touchDataRef.current.startY, 2)
        );

        if (distance < 10) { // Still within small area
          setCurrentGesture({
            type: 'longpress',
            duration: Date.now() - touchDataRef.current.startTime,
            touches: touchDataRef.current.touches,
          });
          triggerHaptic('medium');
        }
      }
    }, finalConfig.longPressDelay);
  }, [finalConfig.enableTouchGestures, finalConfig.longPressDelay, triggerHaptic]);

  const handleTouchMove = React.useCallback((event: TouchEvent) => {
    if (!finalConfig.enableTouchGestures || !touchDataRef.current) return;

    const touch = event.touches[0];
    touchDataRef.current.currentX = touch.clientX;
    touchDataRef.current.currentY = touch.clientY;

    // Calculate swipe distance and direction
    const deltaX = touch.clientX - touchDataRef.current.startX;
    const deltaY = touch.clientY - touchDataRef.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > finalConfig.swipeThreshold) {
      const direction = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up');

      setCurrentGesture({
        type: 'swipe',
        direction,
        distance,
        duration: Date.now() - touchDataRef.current.startTime,
        touches: touchDataRef.current.touches,
      });
    }

    // Handle pinch gestures for multi-touch
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      setCurrentGesture({
        type: 'pinch',
        scale: distance / 100, // Normalize scale
        touches: 2,
      });
    }
  }, [finalConfig.enableTouchGestures, finalConfig.swipeThreshold]);

  const handleTouchEnd = React.useCallback((event: TouchEvent) => {
    if (!finalConfig.enableTouchGestures || !touchDataRef.current) return;

    const duration = Date.now() - touchDataRef.current.startTime;
    const distance = Math.sqrt(
      Math.pow(touchDataRef.current.currentX - touchDataRef.current.startX, 2) +
      Math.pow(touchDataRef.current.currentY - touchDataRef.current.startY, 2)
    );

    // Handle tap gesture
    if (duration < 200 && distance < 10) {
      setCurrentGesture({
        type: 'tap',
        duration,
        touches: touchDataRef.current.touches,
      });
      triggerHaptic('light');
    }

    // Clear gesture after a delay
    setTimeout(() => setCurrentGesture(null), 100);
    touchDataRef.current = null;
  }, [finalConfig.enableTouchGestures, triggerHaptic]);

  // Attach touch event listeners
  React.useEffect(() => {
    if (!finalConfig.enableTouchGestures || !touchSupport) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [finalConfig.enableTouchGestures, touchSupport, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Pull-to-refresh functionality
  const [isPulling, setIsPulling] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);

  const enablePullToRefresh = React.useCallback((onRefresh: () => Promise<void>) => {
    if (!finalConfig.enablePullToRefresh || !isMobile) return;

    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;

    const handlePullStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handlePullMove = (e: TouchEvent) => {
      if (startY === 0 || window.scrollY > 0) return;

      currentY = e.touches[0].clientY;
      const pullDistance = Math.max(0, currentY - startY);

      if (pullDistance > 0) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(pullDistance);
      }
    };

    const handlePullEnd = async () => {
      if (pullDistance > 80 && !isRefreshing) {
        isRefreshing = true;
        triggerHaptic('medium');
        await onRefresh();
        isRefreshing = false;
      }

      setIsPulling(false);
      setPullDistance(0);
      startY = 0;
      currentY = 0;
    };

    document.addEventListener('touchstart', handlePullStart, { passive: false });
    document.addEventListener('touchmove', handlePullMove, { passive: false });
    document.addEventListener('touchend', handlePullEnd);

    return () => {
      document.removeEventListener('touchstart', handlePullStart);
      document.removeEventListener('touchmove', handlePullMove);
      document.removeEventListener('touchend', handlePullEnd);
    };
  }, [finalConfig.enablePullToRefresh, isMobile, pullDistance, triggerHaptic]);

  // Optimize scrolling performance
  React.useEffect(() => {
    if (!finalConfig.optimizeScrolling || !isMobile) return;

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
         // Optimize touch scrolling
     (document.body.style as any).webkitOverflowScrolling = 'touch';
     document.body.style.overscrollBehavior = 'contain';
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchend', preventZoom);
    };
  }, [finalConfig.optimizeScrolling, isMobile]);

  // Adaptive layout based on device
  const getAdaptiveClasses = React.useCallback(() => {
    if (!finalConfig.adaptiveLayout) return '';

    const classes = [];

    if (isMobile) {
      classes.push('mobile-optimized');
    }
    
    if (isTablet) {
      classes.push('tablet-optimized');
    }

    if (orientation === 'landscape') {
      classes.push('landscape-mode');
    } else {
      classes.push('portrait-mode');
    }

    if (touchSupport) {
      classes.push('touch-enabled');
    }

    return classes.join(' ');
  }, [finalConfig.adaptiveLayout, isMobile, isTablet, orientation, touchSupport]);

  // Safe area handling for devices with notches
  const getSafeAreaStyles = React.useCallback(() => {
    if (!isMobile) return {};

    return {
      paddingTop: 'env(safe-area-inset-top)',
      paddingRight: 'env(safe-area-inset-right)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
    };
  }, [isMobile]);

  // Performance optimization for mobile
  const optimizeForMobile = React.useCallback(() => {
    if (!isMobile) return;

    // Reduce animations on slower devices
    if (networkType === 'slow-2g' || networkType === '2g') {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });

    // Add mobile-specific viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }, [isMobile, networkType]);

  React.useEffect(() => {
    optimizeForMobile();
  }, [optimizeForMobile]);

  return {
    // Device info
    isMobile,
    isTablet,
    orientation,
    touchSupport,
    networkType,
    
    // Gesture data
    currentGesture,
    
    // Pull to refresh
    isPulling,
    pullDistance,
    enablePullToRefresh,
    
    // Utilities
    triggerHaptic,
    getAdaptiveClasses,
    getSafeAreaStyles,
    
    // Device capabilities
    supportsVibration: 'vibrate' in navigator,
    supportsGeolocation: 'geolocation' in navigator,
    supportsCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    supportsNotifications: 'Notification' in window,
    supportsServiceWorker: 'serviceWorker' in navigator,
  };
}

// Hook for responsive breakpoints
export function useResponsiveBreakpoints() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 480) setBreakpoint('xs');
      else if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isMobile: ['xs', 'sm'].includes(breakpoint),
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
  };
}

export default useMobileOptimization; 