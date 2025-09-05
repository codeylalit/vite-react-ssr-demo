// Animation Design Tokens for Comprehensive Motion System

export const animations = {
  // Timing and Duration (in milliseconds)
  duration: {
    instant: 0,
    immediate: 100,
    fast: 150,
    normal: 200,
    medium: 300,
    slow: 500,
    slower: 750,
    slowest: 1000,

    // Semantic durations
    'micro-interaction': 150,
    'ui-element': 200,
    'page-transition': 300,
    'loading-state': 500,
    'attention-seeking': 1000,
  },

  // Easing Functions
  easing: {
    // Basic easing
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Cubic bezier curves for natural motion
    natural: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Design standard
    snappy: 'cubic-bezier(0.4, 0.0, 0.1, 1)', // Quick entrance
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Gentle motion
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce effect

    // Entrance animations
    'enter-from-top': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'enter-from-bottom': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'enter-from-left': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'enter-from-right': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    // Exit animations
    'exit-to-top': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    'exit-to-bottom': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    'exit-to-left': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    'exit-to-right': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',

    // Specialized easing
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    overshoot: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    anticipate: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },

  // Keyframe Animations
  keyframes: {
    // Fade animations
    fadeIn: {
      name: 'fadeIn',
      definition: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
    },
    fadeOut: {
      name: 'fadeOut',
      definition: `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `,
    },
    fadeInUp: {
      name: 'fadeInUp',
      definition: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `,
    },
    fadeInDown: {
      name: 'fadeInDown',
      definition: `
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `,
    },
    fadeInLeft: {
      name: 'fadeInLeft',
      definition: `
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translate3d(-30px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `,
    },
    fadeInRight: {
      name: 'fadeInRight',
      definition: `
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translate3d(30px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `,
    },

    // Scale animations
    scaleIn: {
      name: 'scaleIn',
      definition: `
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `,
    },
    scaleOut: {
      name: 'scaleOut',
      definition: `
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `,
    },
    bounce: {
      name: 'bounce',
      definition: `
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
      `,
    },

    // Shake and attention
    shake: {
      name: 'shake',
      definition: `
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
      `,
    },
    pulse: {
      name: 'pulse',
      definition: `
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `,
    },
    heartbeat: {
      name: 'heartbeat',
      definition: `
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.3);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(1);
          }
        }
      `,
    },

    // Rotation and flip
    rotate: {
      name: 'rotate',
      definition: `
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `,
    },
    flip: {
      name: 'flip',
      definition: `
        @keyframes flip {
          from {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
          }
          40% {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);
          }
          50% {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);
          }
          80% {
            transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
          }
          to {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
          }
        }
      `,
    },

    // Loading animations
    spin: {
      name: 'spin',
      definition: `
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `,
    },
    progress: {
      name: 'progress',
      definition: `
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `,
    },
    shimmer: {
      name: 'shimmer',
      definition: `
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
      `,
    },

    // Background animations
    gradient: {
      name: 'gradient',
      definition: `
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `,
    },
    float: {
      name: 'float',
      definition: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `,
    },
    glow: {
      name: 'glow',
      definition: `
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }
      `,
    },
  },

  // Predefined Animation Classes
  classes: {
    // Entrance animations
    'animate-fade-in': {
      animation: 'fadeIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-fade-in-up': {
      animation: 'fadeInUp 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-fade-in-down': {
      animation: 'fadeInDown 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-fade-in-left': {
      animation: 'fadeInLeft 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-fade-in-right': {
      animation: 'fadeInRight 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-scale-in': {
      animation: 'scaleIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },

    // Exit animations
    'animate-fade-out': {
      animation: 'fadeOut 150ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },
    'animate-scale-out': {
      animation: 'scaleOut 150ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    },

    // Attention animations
    'animate-bounce': {
      animation: 'bounce 1s ease-in-out',
    },
    'animate-shake': {
      animation: 'shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
    },
    'animate-pulse': {
      animation: 'pulse 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite',
    },
    'animate-heartbeat': {
      animation: 'heartbeat 1.5s ease-in-out infinite both',
    },

    // Loading animations
    'animate-spin': {
      animation: 'spin 1s linear infinite',
    },
    'animate-progress': {
      animation: 'progress 1.5s ease-in-out infinite',
    },
    'animate-shimmer': {
      animation: 'shimmer 2s infinite',
    },

    // Background animations
    'animate-gradient': {
      animation: 'gradient 6s ease infinite',
      backgroundSize: '200% 200%',
    },
    'animate-float': {
      animation: 'float 6s ease-in-out infinite',
    },
    'animate-glow': {
      animation: 'glow 3s ease-in-out infinite',
    },

    // Rotation
    'animate-rotate': {
      animation: 'rotate 1s linear infinite',
    },
    'animate-flip': {
      animation: 'flip 1s ease-in-out',
    },
  },

  // Transition Configurations
  transitions: {
    // Base transitions
    all: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    colors:
      'color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out',
    opacity: 'opacity 150ms ease-in-out',
    shadow: 'box-shadow 150ms ease-in-out',
    transform: 'transform 150ms ease-in-out',

    // Component-specific transitions
    button: 'all 150ms ease-in-out',
    input: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
    modal: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
    dropdown: 'opacity 150ms ease-in-out, transform 150ms ease-in-out',
    tooltip: 'opacity 100ms ease-in-out',
    notification: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',

    // State transitions
    hover: 'all 150ms ease-in-out',
    focus: 'all 150ms ease-in-out',
    active: 'all 100ms ease-in-out',
    disabled: 'all 150ms ease-in-out',

    // Layout transitions
    'slide-up': 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    'slide-down': 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    'slide-left': 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    'slide-right': 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Motion Guidelines
  principles: {
    // Timing principles
    timing: {
      'micro-interactions': 'Use 150ms or less for immediate feedback',
      'ui-elements': 'Use 200-300ms for standard UI element transitions',
      'page-transitions': 'Use 300-500ms for page and route changes',
      'loading-states': 'Use 500ms+ for loading animations to avoid flicker',
    },

    // Easing principles
    easing: {
      'natural-motion': 'Use cubic-bezier for natural, physics-based motion',
      'enter-animations': 'Use slightly bouncy easing for entrances',
      'exit-animations': 'Use snappy easing for exits',
      attention: 'Use elastic or bounce easing for attention-seeking animations',
    },

    // Performance principles
    performance: {
      'gpu-acceleration': 'Prefer transform and opacity for better performance',
      composition: 'Use transform3d() to trigger hardware acceleration',
      'avoid-layout': 'Avoid animating width, height, top, left properties',
      'reduce-motion': 'Respect prefers-reduced-motion user preference',
    },
  },

  // Accessibility considerations
  accessibility: {
    // Reduced motion media query
    reducedMotion: `
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `,

    // Safe animations for reduced motion
    safeAnimations: ['opacity', 'color', 'background-color', 'border-color', 'box-shadow'],

    // Guidelines
    guidelines: {
      'respect-preferences': 'Always respect prefers-reduced-motion setting',
      'essential-motion': 'Only use essential motion for reduced motion users',
      'focus-indicators': 'Ensure focus indicators are always visible',
      'loading-feedback': 'Provide alternative loading feedback',
    },
  },
} as const;

// CSS Variables for runtime use
export const animationCSSVariables = `
  :root {
    /* Duration Variables */
    --duration-instant: ${animations.duration.instant}ms;
    --duration-immediate: ${animations.duration.immediate}ms;
    --duration-fast: ${animations.duration.fast}ms;
    --duration-normal: ${animations.duration.normal}ms;
    --duration-medium: ${animations.duration.medium}ms;
    --duration-slow: ${animations.duration.slow}ms;
    --duration-slower: ${animations.duration.slower}ms;
    --duration-slowest: ${animations.duration.slowest}ms;

    /* Easing Variables */
    --easing-natural: ${animations.easing.natural};
    --easing-snappy: ${animations.easing.snappy};
    --easing-gentle: ${animations.easing.gentle};
    --easing-bounce: ${animations.easing.bounce};
    --easing-elastic: ${animations.easing.elastic};

    /* Transition Variables */
    --transition-all: ${animations.transitions.all};
    --transition-colors: ${animations.transitions.colors};
    --transition-opacity: ${animations.transitions.opacity};
    --transition-shadow: ${animations.transitions.shadow};
    --transition-transform: ${animations.transitions.transform};
  }
`;

// Helper function to generate animation CSS
export function generateAnimationCSS() {
  let css = '';

  // Add keyframes
  Object.values(animations.keyframes).forEach(keyframe => {
    css += keyframe.definition + '\n';
  });

  // Add animation classes
  Object.entries(animations.classes).forEach(([name, styles]) => {
    css += `.${name} {\n`;
    Object.entries(styles).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`;
    });
    css += '}\n\n';
  });

  // Add transition utilities
  Object.entries(animations.transitions).forEach(([name, value]) => {
    css += `.transition-${name} {\n`;
    css += `  transition: ${value};\n`;
    css += '}\n\n';
  });

  // Add reduced motion support
  css += animations.accessibility.reducedMotion + '\n';

  return css;
}

// TypeScript types
export type AnimationDuration = keyof typeof animations.duration;
export type AnimationEasing = keyof typeof animations.easing;
export type AnimationKeyframe = keyof typeof animations.keyframes;
export type AnimationClass = keyof typeof animations.classes;
export type TransitionType = keyof typeof animations.transitions;

// Helper functions
export function getDuration(name: AnimationDuration): number {
  return animations.duration[name];
}

export function getEasing(name: AnimationEasing): string {
  return animations.easing[name];
}

export function getKeyframe(name: AnimationKeyframe) {
  return animations.keyframes[name];
}

export function createAnimation(
  keyframe: AnimationKeyframe,
  duration: AnimationDuration = 'normal',
  easing: AnimationEasing = 'natural',
  iterationCount: number | 'infinite' = 1,
  fillMode: 'forwards' | 'backwards' | 'both' | 'none' = 'forwards'
): string {
  const durationMs = getDuration(duration);
  const easingFunction = getEasing(easing);
  const keyframeName = getKeyframe(keyframe).name;

  return `${keyframeName} ${durationMs}ms ${easingFunction} ${iterationCount} ${fillMode}`;
}

// Animation utilities
export const animationUtils = {
  // Create a custom transition
  createTransition: (
    properties: string[],
    duration: AnimationDuration = 'normal',
    easing: AnimationEasing = 'natural'
  ): string => {
    const durationMs = getDuration(duration);
    const easingFunction = getEasing(easing);
    return properties.map(prop => `${prop} ${durationMs}ms ${easingFunction}`).join(', ');
  },

  // Create a custom animation
  createCustomAnimation: (
    name: string,
    duration: AnimationDuration = 'normal',
    easing: AnimationEasing = 'natural',
    options: {
      iterationCount?: number | 'infinite';
      fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
      direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
      delay?: number;
    } = {}
  ): string => {
    const durationMs = getDuration(duration);
    const easingFunction = getEasing(easing);
    const { iterationCount = 1, fillMode = 'forwards', direction = 'normal', delay = 0 } = options;

    return `${name} ${durationMs}ms ${easingFunction} ${delay}ms ${iterationCount} ${direction} ${fillMode}`;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get safe animation for reduced motion
  getSafeAnimation: (
    originalAnimation: string,
    fallback: string = 'opacity 150ms ease-in-out'
  ): string => {
    return animationUtils.prefersReducedMotion() ? fallback : originalAnimation;
  },
};

// Standardized Animation System
export const standardizedAnimations = {
  // Duration standards
  duration: {
    fast: 'duration-200', // Quick interactions (hovers, focus states)
    normal: 'duration-300', // Standard transitions (card hovers, button states)
    slow: 'duration-500', // Content reveals, smooth transitions
    slower: 'duration-700', // Major layout changes, slide-ins
    slowest: 'duration-1000', // Page load animations, complex reveals
  },

  // Transition types
  transition: {
    all: 'transition-all',
    transform: 'transition-transform',
    opacity: 'transition-opacity',
    colors: 'transition-colors',
    shadow: 'transition-shadow',
  },

  // Easing patterns
  easing: {
    smooth: 'ease-out',
    bounce: 'ease-in-out',
    sharp: 'ease-in',
  },

  // Common animation combinations
  hover: {
    card: 'hover:shadow-xl transition-all duration-300 hover:scale-105',
    button: 'hover:opacity-90 transition-opacity duration-200',
    text: 'hover:text-blue-600 transition-colors duration-300',
    icon: 'hover:scale-110 transition-transform duration-200',
  },

  // Reveal animations for scroll-triggered content
  reveal: {
    fadeIn: 'transform transition-all duration-700',
    slideUp: 'transform transition-all duration-500 ease-out',
    staggered: (index: number) => `transform transition-all duration-700 delay-${index * 100}`,
  },

  // Loading states
  loading: {
    progress: 'transition-all duration-1000 ease-out',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
  },
} as const;

// Helper functions for consistent application
export const getCardHoverAnimation = () => standardizedAnimations.hover.card;
export const getButtonHoverAnimation = () => standardizedAnimations.hover.button;
export const getRevealAnimation = (type: keyof typeof standardizedAnimations.reveal = 'fadeIn') =>
  standardizedAnimations.reveal[type];
export const getStaggeredAnimation = (index: number) =>
  standardizedAnimations.reveal.staggered(index);

// Standard delay patterns
export const getStandardDelay = (index: number, baseDelay: number = 100) =>
  `delay-${index * baseDelay}`;

export default standardizedAnimations;
