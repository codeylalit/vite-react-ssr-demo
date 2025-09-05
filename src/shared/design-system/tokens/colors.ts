/**
 * Design System Color Tokens
 * Based on Shunya brand guidelines
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    'deep-space-blue': '#1a1947',
    'cosmic-purple': '#2d4cc8', 
    'electric-blue': '#4c7cf0',
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6fe',
    300: '#a5b8fc',
    400: '#818cf8',
    500: '#4c7cf0', // electric-blue
    600: '#2d4cc8', // cosmic-purple
    700: '#1a1947', // deep-space-blue
    800: '#1e1b3e',
    900: '#1a1735',
    950: '#0f0d1f',
  },

  // Neutral Colors
  neutral: {
    black: '#000000',
    white: '#ffffff',
    'slate-gray': '#64748b',
    'light-gray': '#f1f5f9',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // success-green
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // warning-orange
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },

  // Special Effects
  gradient: {
    primary: 'linear-gradient(135deg, #1a1947 0%, #2d4cc8 50%, #4c7cf0 100%)',
    primaryHover: 'linear-gradient(135deg, #0f0d1f 0%, #1e1b3e 50%, #2d4cc8 100%)',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    inverse: '#0f172a',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    muted: '#cbd5e1',
  },

  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
    primary: '#4c7cf0',
  },
} as const;

export type ColorToken = keyof typeof colors;
export type PrimaryColorVariant = keyof typeof colors.primary;
export type NeutralColorVariant = keyof typeof colors.neutral;
export type SemanticColorVariant = keyof typeof colors.semantic; 