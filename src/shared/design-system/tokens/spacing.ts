/**
 * Design System Spacing & Layout Tokens
 * Based on 4px grid system
 */

export const spacing = {
  // Base Spacing Scale (4px grid)
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem', // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    // Brand specific shadows
    brand: '0 4px 20px -2px rgba(76, 124, 240, 0.15)',
    brandLg: '0 10px 40px -4px rgba(76, 124, 240, 0.20)',
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    overlay: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    toast: '1080',
  },

  // Container Sizes
  containers: {
    xs: '20rem', // 320px
    sm: '24rem', // 384px
    md: '28rem', // 448px
    lg: '32rem', // 512px
    xl: '36rem', // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
    prose: '65ch', // Optimal reading width
    screen: '100vw',
  },

  // Breakpoints
  screens: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Grid System
  columns: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    auto: 'auto',
    none: 'none',
  },

  // Transitions & Animations
  transitionDuration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  transitionTimingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Brand specific easing
    'brand-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'brand-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Component Specific Spacing
  component: {
    // Button padding
    button: {
      sm: { x: '0.75rem', y: '0.375rem' }, // px-3 py-1.5
      md: { x: '1rem', y: '0.5rem' }, // px-4 py-2
      lg: { x: '1.25rem', y: '0.625rem' }, // px-5 py-2.5
      xl: { x: '1.5rem', y: '0.75rem' }, // px-6 py-3
    },

    // Card padding
    card: {
      sm: '1rem', // p-4
      md: '1.5rem', // p-6
      lg: '2rem', // p-8
      xl: '2.5rem', // p-10
    },

    // Form spacing
    form: {
      fieldGap: '1rem', // space-y-4
      labelMargin: '0.5rem', // mb-2
      helpTextMargin: '0.25rem', // mt-1
    },

    // Navigation spacing
    nav: {
      itemGap: '0.5rem', // space-x-2
      sectionGap: '1.5rem', // space-y-6
      padding: '1rem', // p-4
    },
  },
} as const;

export type SpacingScale = keyof typeof spacing.spacing;
export type BorderRadius = keyof typeof spacing.borderRadius;
export type BoxShadow = keyof typeof spacing.boxShadow;
export type Container = keyof typeof spacing.containers;
export type Screen = keyof typeof spacing.screens;

// Standardized Card Spacing System
export const cardSpacing = {
  // Standard card padding variants
  compact: 'p-4', // For small cards, stats, badges
  default: 'p-6', // Standard card content
  spacious: 'p-8', // For large content cards, hero sections

  // Card headers and content separation
  header: {
    compact: 'p-4',
    default: 'p-5',
    spacious: 'p-6',
  },
  content: {
    compact: 'p-4',
    default: 'p-6',
    spacious: 'p-8',
  },
} as const;

// Standardized Color Scheme System
export const colorSchemes = {
  // Primary brand gradient (main CTA, headers, logos)
  primary: {
    gradient: 'from-purple-600 via-pink-600 to-orange-500',
    text: 'from-purple-600 via-pink-600 to-orange-500',
    background: 'from-purple-50 via-pink-50 to-orange-50',
  },

  // Secondary brand gradient (tech, features)
  secondary: {
    gradient: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    text: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    background: 'from-blue-50 via-indigo-50 to-purple-50',
  },

  // Warm accent (philosophy, heritage sections)
  warm: {
    gradient: 'from-amber-700 to-orange-600',
    text: 'from-amber-700 to-orange-600',
    background: 'from-amber-50 to-orange-50',
  },

  // Neutral backgrounds for sections
  neutral: {
    light: 'from-gray-50 to-blue-50',
    warm: 'from-yellow-50 via-orange-50 to-pink-50',
    cool: 'from-blue-50 via-purple-50 to-indigo-50',
  },

  // Status colors for badges and indicators
  status: {
    success: 'from-green-500 to-blue-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-purple-500',
  },
} as const;

// Helper functions for consistent application
export const getCardPadding = (size: keyof typeof cardSpacing) => {
  if (size in cardSpacing) {
    return cardSpacing[size];
  }
  return cardSpacing.default;
};

export const getColorGradient = (
  scheme: keyof typeof colorSchemes,
  type: 'gradient' | 'text' | 'background' = 'gradient'
) => {
  const colorScheme = colorSchemes[scheme];
  if (colorScheme && 'gradient' in colorScheme && type in colorScheme) {
    return `bg-gradient-to-r ${colorScheme[type as keyof typeof colorScheme]}`;
  }
  return `bg-gradient-to-r ${colorSchemes.primary.gradient}`;
};

export const getTextGradient = (scheme: keyof typeof colorSchemes) => {
  const colorScheme = colorSchemes[scheme];
  if ('text' in colorScheme) {
    return `bg-gradient-to-r ${colorScheme.text} bg-clip-text text-transparent`;
  }
  return `bg-gradient-to-r ${colorSchemes.primary.text} bg-clip-text text-transparent`;
};

export const getSectionBackground = (scheme: keyof typeof colorSchemes.neutral) => {
  return `bg-gradient-to-br ${colorSchemes.neutral[scheme]}`;
};
