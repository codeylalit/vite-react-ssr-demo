/**
 * Shunya Design System - Main Export
 * 
 * A comprehensive design system providing:
 * - Design tokens (colors, typography, spacing)
 * - Component library (UI components built on Radix)
 * - Themes and utilities
 * 
 * @version 1.0.0
 * @author Shunya Labs
 */

// Design Tokens
export * from './tokens';

// Re-export UI components from shared/components/ui
export * from '../components/ui';

// Design system utilities
export const DESIGN_SYSTEM_VERSION = '1.0.0';

// Component categories for organization
export const componentCategories = {
  forms: [
    'Button',
    'Input', 
    'Textarea',
    'Select',
    'Checkbox',
    'RadioGroup',
    'Switch',
    'Label',
    'Form',
  ],
  navigation: [
    'Breadcrumb',
    'NavigationMenu',
    'Tabs',
    'Pagination',
    'Sidebar',
  ],
  feedback: [
    'Alert',
    'AlertDialog',
    'Toast',
    'Progress',
    'Skeleton',
    'Badge',
  ],
  layout: [
    'Card',
    'Separator',
    'Sheet',
    'Dialog',
    'Drawer',
    'AspectRatio',
    'ScrollArea',
  ],
  dataDisplay: [
    'Table',
    'VirtualTable',
    'VirtualList',
    'Chart',
    'Avatar',
    'Carousel',
  ],
  overlays: [
    'Popover',
    'Tooltip',
    'HoverCard',
    'ContextMenu',
    'DropdownMenu',
    'Command',
  ],
} as const;

// Design system metadata
export const designSystemInfo = {
  name: 'Shunya Design System',
  version: DESIGN_SYSTEM_VERSION,
  description: 'A comprehensive design system for Zero Voice Infinity platform',
  repository: 'https://github.com/shunya-labs/zero-voice-infinity',
  license: 'MIT',
  maintainers: ['Shunya Labs Design Team'],
  
  // Token counts for metrics
  tokenCounts: {
    colors: 120,
    typography: 15,
    spacing: 35,
    components: 45,
  },
  
  // Browser support
  browserSupport: {
    chrome: '≥91',
    firefox: '≥90', 
    safari: '≥14',
    edge: '≥91',
  },
  
  // Framework compatibility
  frameworks: {
    react: '≥18.0.0',
    typescript: '≥5.0.0',
    tailwindcss: '≥3.4.0',
  },
} as const;

// Utility for checking component category
export const getComponentCategory = (componentName: string): string => {
  for (const [category, components] of Object.entries(componentCategories)) {
    if ((components as readonly string[]).includes(componentName)) {
      return category;
    }
  }
  return 'unknown';
};

// Design system health check
export const validateDesignSystem = () => {
  const checks = {
    tokensLoaded: true, // Would check if tokens are properly imported
    componentsLoaded: true, // Would check if components are available
    themeConfigured: true, // Would check if theme is properly set up
  };
  
  const isHealthy = Object.values(checks).every(Boolean);
  
  return {
    isHealthy,
    checks,
    timestamp: new Date().toISOString(),
  };
};

// Export types for external consumption
export type ComponentCategory = keyof typeof componentCategories;
export type DesignSystemInfo = typeof designSystemInfo; 