/**
 * Design System Typography Tokens
 * Based on Shunya brand guidelines
 */

export const typography = {
  // Font Families
  fontFamilies: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Font Weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Font Sizes (rem units for accessibility)
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },

  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Transforms
  textTransform: {
    none: 'none',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  },

  // Typography Scale - Semantic Text Styles
  textStyles: {
    // Display Text (Hero sections, large headings)
    'display-2xl': {
      fontSize: '4.5rem', // 72px
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'display-xl': {
      fontSize: '3.75rem', // 60px
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'display-lg': {
      fontSize: '3rem', // 48px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'display-md': {
      fontSize: '2.25rem', // 36px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'display-sm': {
      fontSize: '1.875rem', // 30px
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    // Headings
    'heading-xl': {
      fontSize: '1.5rem', // 24px
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'heading-lg': {
      fontSize: '1.25rem', // 20px
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'heading-md': {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'heading-sm': {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'heading-xs': {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    // Body Text
    'body-xl': {
      fontSize: '1.25rem', // 20px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'body-lg': {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'body-md': {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'body-sm': {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'body-xs': {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    // Labels and UI Text
    'label-xl': {
      fontSize: '1rem', // 16px
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'label-lg': {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: '0em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'label-md': {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'label-sm': {
      fontSize: '0.6875rem', // 11px
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    // Code and Monospace
    'code-xl': {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily:
        'JetBrains Mono, "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    'code-lg': {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily:
        'JetBrains Mono, "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    'code-md': {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily:
        'JetBrains Mono, "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    'code-sm': {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0.025em',
      fontFamily:
        'JetBrains Mono, "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },

    // Caption and Fine Print
    'caption-lg': {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'caption-md': {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    'caption-sm': {
      fontSize: '0.6875rem', // 11px
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.025em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },

  // Responsive Typography Modifiers
  responsive: {
    // Mobile-first scaling factors
    mobile: {
      'display-2xl': { fontSize: '2.5rem' }, // 40px on mobile
      'display-xl': { fontSize: '2.25rem' }, // 36px on mobile
      'display-lg': { fontSize: '2rem' }, // 32px on mobile
      'display-md': { fontSize: '1.75rem' }, // 28px on mobile
      'display-sm': { fontSize: '1.5rem' }, // 24px on mobile
    },
    tablet: {
      'display-2xl': { fontSize: '3.5rem' }, // 56px on tablet
      'display-xl': { fontSize: '3rem' }, // 48px on tablet
      'display-lg': { fontSize: '2.5rem' }, // 40px on tablet
      'display-md': { fontSize: '2rem' }, // 32px on tablet
      'display-sm': { fontSize: '1.75rem' }, // 28px on tablet
    },
    desktop: {
      // Full sizes (default)
    },
  },

  // Utility Classes for Easy Application
  utilities: {
    textAlign: {
      left: 'text-align: left',
      center: 'text-align: center',
      right: 'text-align: right',
      justify: 'text-align: justify',
    },
    textDecoration: {
      none: 'text-decoration: none',
      underline: 'text-decoration: underline',
      overline: 'text-decoration: overline',
      lineThrough: 'text-decoration: line-through',
    },
    textOverflow: {
      ellipsis: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      clip: {
        overflow: 'hidden',
        textOverflow: 'clip',
        whiteSpace: 'nowrap',
      },
    },
    wordBreak: {
      normal: 'word-break: normal',
      words: 'word-break: break-word',
      all: 'word-break: break-all',
    },
  },

  // Typography Scale for Landing Pages
  headings: {
    h1: {
      size: 'text-4xl md:text-5xl lg:text-6xl',
      weight: 'font-bold',
      spacing: 'mb-6',
    },
    h2: {
      size: 'text-3xl md:text-4xl lg:text-5xl',
      weight: 'font-bold',
      spacing: 'mb-6',
    },
    h3: {
      size: 'text-2xl md:text-3xl',
      weight: 'font-bold',
      spacing: 'mb-4',
    },
    h4: {
      size: 'text-xl md:text-2xl',
      weight: 'font-semibold',
      spacing: 'mb-3',
    },
    h5: {
      size: 'text-lg md:text-xl',
      weight: 'font-semibold',
      spacing: 'mb-2',
    },
  },

  // Body Text Hierarchy
  body: {
    large: {
      size: 'text-lg md:text-xl',
      weight: 'font-normal',
      spacing: 'mb-4',
    },
    base: {
      size: 'text-base md:text-lg',
      weight: 'font-normal',
      spacing: 'mb-3',
    },
    small: {
      size: 'text-sm md:text-base',
      weight: 'font-normal',
      spacing: 'mb-2',
    },
  },

  // Special Text
  special: {
    lead: {
      size: 'text-xl md:text-2xl',
      weight: 'font-medium',
      spacing: 'mb-6',
    },
    caption: {
      size: 'text-sm',
      weight: 'font-medium',
      spacing: 'mb-1',
    },
    micro: {
      size: 'text-xs',
      weight: 'font-normal',
      spacing: 'mb-1',
    },
  },

  // Statistics/Numbers
  stats: {
    large: {
      size: 'text-3xl md:text-4xl',
      weight: 'font-bold',
      spacing: 'mb-2',
    },
    medium: {
      size: 'text-2xl md:text-3xl',
      weight: 'font-bold',
      spacing: 'mb-2',
    },
    small: {
      size: 'text-xl md:text-2xl',
      weight: 'font-bold',
      spacing: 'mb-1',
    },
  },
} as const;

// CSS Custom Properties for Runtime Use
export const typographyCSSVariables = `
  :root {
    /* Font Families */
    --font-primary: ${typography.fontFamilies.primary};
    --font-secondary: ${typography.fontFamilies.secondary};
    --font-mono: ${typography.fontFamilies.mono};
    --font-display: ${typography.fontFamilies.display};

    /* Font Weights */
    --font-weight-light: ${typography.fontWeights.light};
    --font-weight-normal: ${typography.fontWeights.normal};
    --font-weight-medium: ${typography.fontWeights.medium};
    --font-weight-semibold: ${typography.fontWeights.semibold};
    --font-weight-bold: ${typography.fontWeights.bold};
    --font-weight-extrabold: ${typography.fontWeights.extrabold};
    --font-weight-black: ${typography.fontWeights.black};

    /* Font Sizes */
    --font-size-xs: ${typography.fontSizes.xs};
    --font-size-sm: ${typography.fontSizes.sm};
    --font-size-base: ${typography.fontSizes.base};
    --font-size-lg: ${typography.fontSizes.lg};
    --font-size-xl: ${typography.fontSizes.xl};
    --font-size-2xl: ${typography.fontSizes['2xl']};
    --font-size-3xl: ${typography.fontSizes['3xl']};
    --font-size-4xl: ${typography.fontSizes['4xl']};
    --font-size-5xl: ${typography.fontSizes['5xl']};
    --font-size-6xl: ${typography.fontSizes['6xl']};
    --font-size-7xl: ${typography.fontSizes['7xl']};
    --font-size-8xl: ${typography.fontSizes['8xl']};
    --font-size-9xl: ${typography.fontSizes['9xl']};

    /* Line Heights */
    --line-height-none: ${typography.lineHeights.none};
    --line-height-tight: ${typography.lineHeights.tight};
    --line-height-snug: ${typography.lineHeights.snug};
    --line-height-normal: ${typography.lineHeights.normal};
    --line-height-relaxed: ${typography.lineHeights.relaxed};
    --line-height-loose: ${typography.lineHeights.loose};

    /* Letter Spacing */
    --letter-spacing-tighter: ${typography.letterSpacing.tighter};
    --letter-spacing-tight: ${typography.letterSpacing.tight};
    --letter-spacing-normal: ${typography.letterSpacing.normal};
    --letter-spacing-wide: ${typography.letterSpacing.wide};
    --letter-spacing-wider: ${typography.letterSpacing.wider};
    --letter-spacing-widest: ${typography.letterSpacing.widest};
  }
`;

// Helper function to generate CSS classes
export function generateTypographyClasses() {
  let css = '';

  Object.entries(typography.textStyles).forEach(([name, styles]) => {
    css += `.text-${name} {\n`;
    Object.entries(styles).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      css += `  ${cssProperty}: ${value};\n`;
    });
    css += '}\n\n';
  });

  // Add responsive classes
  Object.entries(typography.responsive).forEach(([breakpoint, overrides]) => {
    if (breakpoint === 'mobile') {
      css += '@media (max-width: 767px) {\n';
    } else if (breakpoint === 'tablet') {
      css += '@media (min-width: 768px) and (max-width: 1023px) {\n';
    } else {
      return; // Skip desktop as it's the default
    }

    Object.entries(overrides).forEach(([name, styles]) => {
      css += `  .text-${name} {\n`;
      Object.entries(styles).forEach(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `    ${cssProperty}: ${value};\n`;
      });
      css += '  }\n';
    });

    css += '}\n\n';
  });

  return css;
}

// TypeScript type for text style names
export type TextStyleName = keyof typeof typography.textStyles;

// Helper function to get text style
export function getTextStyle(name: TextStyleName) {
  return typography.textStyles[name];
}

// Helper function to generate typography classes
export const getTypographyClasses = (variant: keyof typeof typography, type: string) => {
  const config = typography[variant]?.[type];
  if (!config) return '';

  return `${config.size} ${config.weight} ${config.spacing}`;
};

// Common margin standardization
export const spacing = {
  section: {
    top: 'pt-8 md:pt-12 lg:pt-16',
    bottom: 'pb-8 md:pb-12 lg:pb-16',
    both: 'py-8 md:py-12 lg:py-16',
  },
  content: {
    top: 'mt-8 md:mt-12',
    bottom: 'mb-8 md:mb-12',
    both: 'my-8 md:my-12',
  },
  element: {
    top: 'mt-4 md:mt-6',
    bottom: 'mb-4 md:mb-6',
    both: 'my-4 md:my-6',
  },
} as const;

export default typography;
