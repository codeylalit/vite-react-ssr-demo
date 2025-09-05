import { useEffect, useCallback, useRef, useState } from 'react';

// Types for accessibility preferences
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  colorScheme: 'light' | 'dark' | 'system';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

// Hook for managing focus
export function useFocusManagement() {
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef<number>(-1);

  // Get all focusable elements within a container
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        // Additional checks for visibility and accessibility
        const htmlElement = element as HTMLElement;
        const style = window.getComputedStyle(element);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          !element.hasAttribute('aria-hidden') &&
          htmlElement.offsetWidth > 0 &&
          htmlElement.offsetHeight > 0
        );
      }) as HTMLElement[];
  }, []);

  // Focus the first element in a container
  const focusFirst = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      focusableElementsRef.current = focusableElements;
      currentFocusIndexRef.current = 0;
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Focus the last element in a container
  const focusLast = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      const lastIndex = focusableElements.length - 1;
      focusableElements[lastIndex].focus();
      focusableElementsRef.current = focusableElements;
      currentFocusIndexRef.current = lastIndex;
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Navigate to next focusable element
  const focusNext = useCallback(() => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return false;

    currentFocusIndexRef.current = (currentFocusIndexRef.current + 1) % elements.length;
    elements[currentFocusIndexRef.current].focus();
    return true;
  }, []);

  // Navigate to previous focusable element
  const focusPrevious = useCallback(() => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return false;

    currentFocusIndexRef.current = 
      currentFocusIndexRef.current <= 0 
        ? elements.length - 1 
        : currentFocusIndexRef.current - 1;
    elements[currentFocusIndexRef.current].focus();
    return true;
  }, []);

  // Trap focus within a container
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    focusableElementsRef.current = focusableElements;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      event.preventDefault();
      
      if (event.shiftKey) {
        focusPrevious();
      } else {
        focusNext();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element initially
    focusFirst(container);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [getFocusableElements, focusFirst, focusNext, focusPrevious]);

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    trapFocus,
    getFocusableElements,
  };
}

// Hook for screen reader announcements
export function useScreenReader() {
  const announceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcement container if it doesn't exist
    if (!announceRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('role', 'status');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
      announceRef.current = announcer;
    }

    return () => {
      if (announceRef.current && announceRef.current.parentNode) {
        announceRef.current.parentNode.removeChild(announceRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
    }
  }, []);

  const clear = useCallback(() => {
    if (announceRef.current) {
      announceRef.current.textContent = '';
    }
  }, []);

  return { announce, clear };
}

// Hook for keyboard navigation
export function useKeyboardNavigation(options?: {
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enableEscape?: boolean;
  onEscape?: () => void;
}) {
  const {
    enableArrowKeys = true,
    enableHomeEnd = true,
    enableEscape = true,
    onEscape,
  } = options || {};

  const { focusNext, focusPrevious, focusFirst, focusLast } = useFocusManagement();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (enableArrowKeys) {
          event.preventDefault();
          focusNext();
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (enableArrowKeys) {
          event.preventDefault();
          focusPrevious();
        }
        break;

      case 'Home':
        if (enableHomeEnd && event.currentTarget) {
          event.preventDefault();
          focusFirst(event.currentTarget as HTMLElement);
        }
        break;

      case 'End':
        if (enableHomeEnd && event.currentTarget) {
          event.preventDefault();
          focusLast(event.currentTarget as HTMLElement);
        }
        break;

      case 'Escape':
        if (enableEscape && onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
    }
  }, [enableArrowKeys, enableHomeEnd, enableEscape, onEscape, focusNext, focusPrevious, focusFirst, focusLast]);

  return { handleKeyDown };
}

// Hook for accessibility preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Get saved preferences from localStorage or use defaults
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to defaults
      }
    }

    // Detect system preferences
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      fontSize: 'medium',
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      screenReader: false,
      keyboardNavigation: true,
    };
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    
    // Apply preferences to document
    const root = document.documentElement;
    
    // Apply font size
    root.style.setProperty('--font-size-multiplier', {
      small: '0.875',
      medium: '1',
      large: '1.125',
      xl: '1.25',
    }[preferences.fontSize]);

    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply color scheme
    root.setAttribute('data-theme', preferences.colorScheme);

  }, [preferences]);

  const updatePreference = useCallback(<K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setPreferences({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      colorScheme: 'system',
      screenReader: false,
      keyboardNavigation: true,
    });
  }, []);

  return {
    preferences,
    updatePreference,
    resetToDefaults,
  };
}

// Hook for detecting user interaction methods
export function useInteractionMethod() {
  const [method, setMethod] = useState<'mouse' | 'keyboard' | 'touch'>('mouse');

  useEffect(() => {
    const handleMouseDown = () => setMethod('mouse');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setMethod('keyboard');
    };
    const handleTouchStart = () => setMethod('touch');

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  useEffect(() => {
    // Apply interaction method to body class for CSS targeting
    document.body.className = document.body.className
      .replace(/interaction-\w+/g, '') + ` interaction-${method}`;
  }, [method]);

  return method;
}

// Main accessibility hook that combines all features
export function useAccessibility() {
  const focusManagement = useFocusManagement();
  const screenReader = useScreenReader();
  const keyboardNavigation = useKeyboardNavigation();
  const accessibilityPreferences = useAccessibilityPreferences();
  const interactionMethod = useInteractionMethod();

  return {
    ...focusManagement,
    ...screenReader,
    ...keyboardNavigation,
    ...accessibilityPreferences,
    interactionMethod,
  };
} 