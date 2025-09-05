# Shunya Design System

A comprehensive design system built for the Zero Voice Infinity platform, providing consistent design tokens, components, and patterns.

## 🎨 **Design Tokens**

### Colors

Our color system is built around the Shunya brand identity with primary gradient colors and semantic color scales.

#### Primary Colors
```typescript
import { colors } from '@/shared/design-system/tokens';

// Brand gradient colors
colors.primary['deep-space-blue']  // #1a1947
colors.primary['cosmic-purple']    // #2d4cc8
colors.primary['electric-blue']    // #4c7cf0

// Scale-based access
colors.primary[500]  // electric-blue
colors.primary[600]  // cosmic-purple  
colors.primary[700]  // deep-space-blue
```

#### Usage Examples
```tsx
// CSS-in-JS
const styles = {
  background: colors.primary[500],
  color: colors.text.inverse,
  borderColor: colors.border.primary,
}

// Tailwind classes (configure in tailwind.config.ts)
<div className="bg-primary-500 text-white border-primary">
```

### Typography

Based on Inter font family with Satoshi for display text and JetBrains Mono for code.

#### Text Styles
```typescript
import { typography } from '@/shared/design-system/tokens';

// Predefined text styles
typography.textStyles['heading-1']    // Large display headings
typography.textStyles['body-base']    // Standard body text
typography.textStyles['code-base']    // Code blocks
typography.textStyles['label-small']  // Small UI labels
```

#### Usage Examples
```tsx
// Direct style application
<h1 style={typography.textStyles['heading-1']}>
  Main Heading
</h1>

// Component with design tokens
const Heading = styled.h1`
  font-family: ${typography.fontFamily.display.join(', ')};
  font-size: ${typography.fontSize['3xl'][0]};
  font-weight: ${typography.fontWeight.bold};
`;
```

### Spacing & Layout

Built on a 4px grid system for consistent spacing and layout.

#### Spacing Scale
```typescript
import { spacing } from '@/shared/design-system/tokens';

// Base spacing (4px increments)
spacing.spacing[1]   // 4px
spacing.spacing[4]   // 16px
spacing.spacing[8]   // 32px
spacing.spacing[16]  // 64px

// Component-specific spacing
spacing.component.button.md  // { x: '1rem', y: '0.5rem' }
spacing.component.card.lg    // '2rem'
```

## 🧩 **Component Library**

### UI Components

Our component library is built on Radix UI primitives with custom styling:

- **Buttons** - Multiple variants (primary, secondary, outline, ghost)
- **Forms** - Input, textarea, select, checkbox, radio
- **Navigation** - Breadcrumbs, pagination, tabs
- **Feedback** - Alerts, toasts, progress indicators
- **Layout** - Cards, containers, grid systems
- **Data Display** - Tables, virtual lists, charts

### Component Usage

```tsx
import { Button, Card, Input } from '@/shared/components/ui';

function LoginForm() {
  return (
    <Card className="p-6">
      <Input 
        placeholder="Email" 
        type="email"
        className="mb-4"
      />
      <Button variant="primary" size="lg">
        Sign In
      </Button>
    </Card>
  );
}
```

## 🎯 **Design Principles**

### 1. **Consistency**
- Use design tokens for all styling decisions
- Follow established patterns for similar interactions
- Maintain visual hierarchy through typography scale

### 2. **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast ratios

### 3. **Performance**
- Optimized component rendering
- Tree-shakeable exports
- Minimal runtime overhead
- Efficient bundle splitting

### 4. **Developer Experience**
- TypeScript-first approach
- Comprehensive prop types
- Clear documentation
- Intuitive naming conventions

## 📋 **Usage Guidelines**

### Color Usage

#### Do ✅
- Use semantic colors for status (success, warning, error)
- Apply primary colors for brand elements and CTAs
- Use neutral colors for text and backgrounds
- Maintain sufficient contrast ratios

#### Don't ❌
- Use colors outside the defined palette
- Mix different color systems
- Use color alone to convey information
- Ignore accessibility contrast requirements

### Typography Usage

#### Do ✅
- Use predefined text styles when available
- Follow the typographic scale
- Pair fonts appropriately (display + body)
- Optimize for readability

#### Don't ❌
- Use arbitrary font sizes
- Mix too many font weights
- Create overly complex text hierarchies
- Use very long line lengths

### Spacing Usage

#### Do ✅
- Follow the 4px grid system
- Use consistent spacing patterns
- Apply semantic spacing for components
- Consider responsive spacing needs

#### Don't ❌
- Use arbitrary spacing values
- Break the grid system alignment
- Create inconsistent spacing patterns
- Ignore mobile spacing requirements

## 🔧 **Implementation**

### Setting up Design Tokens

1. **Install dependencies** (already included):
```bash
npm install tailwindcss class-variance-authority
```

2. **Configure Tailwind** with design tokens:
```typescript
// tailwind.config.ts
import { colors, typography, spacing } from './src/shared/design-system/tokens';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: colors.primary,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      spacing: spacing.spacing,
      borderRadius: spacing.borderRadius,
      boxShadow: spacing.boxShadow,
    },
  },
};
```

3. **Use in components**:
```tsx
import { colors } from '@/shared/design-system/tokens';
import { cn } from '@/shared/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        variant === 'primary' && 'bg-primary-500 text-white hover:bg-primary-600',
        variant === 'secondary' && 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
      )}
    >
      {children}
    </button>
  );
}
```

## 📚 **Component API Reference**

### Button Component

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Card Component

```tsx
interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'brand';
  border?: boolean;
  children: React.ReactNode;
}
```

## 🚀 **Migration Guide**

### From Legacy Components

1. **Replace hardcoded colors**:
```tsx
// Before
<div style={{ backgroundColor: '#4c7cf0' }}>

// After
<div style={{ backgroundColor: colors.primary[500] }}>
// or
<div className="bg-primary-500">
```

2. **Update spacing**:
```tsx
// Before
<div style={{ padding: '16px', margin: '8px' }}>

// After
<div style={{ 
  padding: spacing.spacing[4], 
  margin: spacing.spacing[2] 
}}>
// or
<div className="p-4 m-2">
```

3. **Standardize typography**:
```tsx
// Before
<h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>

// After
<h1 style={typography.textStyles['heading-2']}>
// or
<h1 className="text-3xl font-semibold">
```

## 🔄 **Versioning & Updates**

### Design Token Updates
- Major version: Breaking changes to token structure
- Minor version: New tokens or non-breaking enhancements  
- Patch version: Bug fixes and refinements

### Component Updates
- Follow semantic versioning
- Maintain backward compatibility when possible
- Provide migration guides for breaking changes

## 📞 **Support & Resources**

- **Figma Design Files**: [Link to Figma]
- **Component Storybook**: [Link to Storybook]
- **GitHub Repository**: [Link to repo]
- **Design Team Contact**: design@shunya.ai

---

## 🎨 **Brand Guidelines Integration**

This design system implements the Shunya brand guidelines:

- **Primary Colors**: Deep Space Blue (#1a1947) → Cosmic Purple (#2d4cc8) → Electric Blue (#4c7cf0)
- **Typography**: Inter for UI, Satoshi for display, JetBrains Mono for code
- **Logo Usage**: Gradient "0" symbol with proper spacing and sizing
- **Visual Identity**: Modern, tech-forward aesthetic with gradient accents

For complete brand guidelines, refer to `/requirements/brand-guideline.md`. 