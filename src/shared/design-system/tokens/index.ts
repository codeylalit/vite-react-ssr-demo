/**
 * Design System Tokens - Main Index
 * 
 * This file exports all design tokens in a structured format
 * for consumption by components, themes, and utilities.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export { colors, typography, spacing };

export type { 
  ColorToken, 
  PrimaryColorVariant, 
  NeutralColorVariant, 
  SemanticColorVariant 
} from './colors';

export type { 
  FontFamily, 
  FontSize, 
  FontWeight, 
  TextStyle 
} from './typography';

export type { 
  SpacingScale, 
  BorderRadius, 
  BoxShadow, 
  Container, 
  Screen 
} from './spacing';

// Combined design tokens object for easier access
export const designTokens = {
  colors,
  typography,
  spacing,
} as const;

// Utility functions for accessing tokens
export const getColorToken = (path: string) => {
  const parts = path.split('.');
  let current: any = colors;
  for (const part of parts) {
    current = current[part];
    if (!current) return undefined;
  }
  return current;
};

export const getSpacingToken = (scale: keyof typeof spacing.spacing) => {
  return spacing.spacing[scale];
};

export const getTypographyToken = (style: keyof typeof typography.textStyles) => {
  return typography.textStyles[style];
};

// Theme variants (for future theming support)
export const themeVariants = {
  light: 'light',
  dark: 'dark',
  auto: 'auto',
} as const;

export type ThemeVariant = keyof typeof themeVariants; 