import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Type,
  Monitor,
  Mouse,
  Keyboard,
  Eye,
  Volume2,
  Contrast,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibilityPreferences, type AccessibilityPreferences } from '@/shared/hooks/useAccessibility';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';

interface AccessibilityPanelProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function AccessibilityPanel({ trigger, className }: AccessibilityPanelProps) {
  const { t } = useTranslation('common');
  const { preferences, updatePreference, resetToDefaults } = useAccessibilityPreferences();
  const [isOpen, setIsOpen] = useState(false);

  const handlePreferenceChange = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    updatePreference(key, value);
  };

  const handleReset = () => {
    resetToDefaults();
  };

  // Font size options
  const fontSizeOptions = [
    { value: 'small', label: 'Small (87.5%)', icon: Type },
    { value: 'medium', label: 'Medium (100%)', icon: Type },
    { value: 'large', label: 'Large (112.5%)', icon: Type },
    { value: 'xl', label: 'Extra Large (125%)', icon: Type },
  ] as const;

  // Color scheme options
  const colorSchemeOptions = [
    { value: 'light', label: 'Light', icon: Monitor },
    { value: 'dark', label: 'Dark', icon: Monitor },
    { value: 'system', label: 'System Default', icon: Monitor },
  ] as const;

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Settings className="h-4 w-4" />
      Accessibility
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className={cn("max-w-2xl max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Configure your accessibility preferences to improve your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Visual Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Visual Preferences
              </CardTitle>
              <CardDescription>
                Adjust visual elements for better readability and comfort.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <Label htmlFor="font-size" className="text-sm font-medium">
                  Font Size
                </Label>
                <Select
                  value={preferences.fontSize}
                  onValueChange={(value: AccessibilityPreferences['fontSize']) =>
                    handlePreferenceChange('fontSize', value)
                  }
                >
                  <SelectTrigger id="font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Scheme */}
              <div className="space-y-2">
                <Label htmlFor="color-scheme" className="text-sm font-medium">
                  Color Scheme
                </Label>
                <Select
                  value={preferences.colorScheme}
                  onValueChange={(value: AccessibilityPreferences['colorScheme']) =>
                    handlePreferenceChange('colorScheme', value)
                  }
                >
                  <SelectTrigger id="color-scheme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="text-sm font-medium">
                    High Contrast Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Increase contrast between text and background for better readability.
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('highContrast', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Motion & Animation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RotateCcw className="h-4 w-4" />
                Motion & Animation
              </CardTitle>
              <CardDescription>
                Control animations and transitions for comfort and accessibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion" className="text-sm font-medium">
                    Reduce Motion
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Minimize animations and transitions that may cause discomfort.
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('reducedMotion', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation & Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Keyboard className="h-4 w-4" />
                Navigation & Input
              </CardTitle>
              <CardDescription>
                Configure input methods and navigation preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyboard-navigation" className="text-sm font-medium">
                    Enhanced Keyboard Navigation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable enhanced keyboard shortcuts and navigation aids.
                  </p>
                </div>
                <Switch
                  id="keyboard-navigation"
                  checked={preferences.keyboardNavigation}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('keyboardNavigation', checked)
                  }
                />
              </div>

              {/* Screen Reader Support */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader Support
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable enhanced screen reader announcements and descriptions.
                  </p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={preferences.screenReader}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('screenReader', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Settings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Check className="h-4 w-4" />
                Current Settings
              </CardTitle>
              <CardDescription>
                Overview of your current accessibility configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Font Size</p>
                  <Badge variant="secondary">
                    {fontSizeOptions.find(opt => opt.value === preferences.fontSize)?.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Color Scheme</p>
                  <Badge variant="secondary">
                    {colorSchemeOptions.find(opt => opt.value === preferences.colorScheme)?.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Enhanced Features</p>
                  <div className="flex flex-wrap gap-1">
                    {preferences.highContrast && (
                      <Badge variant="outline" className="text-xs">High Contrast</Badge>
                    )}
                    {preferences.reducedMotion && (
                      <Badge variant="outline" className="text-xs">Reduced Motion</Badge>
                    )}
                    {preferences.keyboardNavigation && (
                      <Badge variant="outline" className="text-xs">Keyboard Nav</Badge>
                    )}
                    {preferences.screenReader && (
                      <Badge variant="outline" className="text-xs">Screen Reader</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information & Reset */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Settings are saved automatically and persist across sessions.
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick access component for common accessibility toggles
export function AccessibilityQuickActions() {
  const { preferences, updatePreference } = useAccessibilityPreferences();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={preferences.highContrast ? "default" : "outline"}
        size="sm"
        onClick={() => updatePreference('highContrast', !preferences.highContrast)}
        className="gap-1"
        aria-label={`${preferences.highContrast ? 'Disable' : 'Enable'} high contrast mode`}
      >
        <Contrast className="h-3 w-3" />
        {preferences.highContrast && <Check className="h-3 w-3" />}
      </Button>
      
      <Button
        variant={preferences.reducedMotion ? "default" : "outline"}
        size="sm"
        onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
        className="gap-1"
        aria-label={`${preferences.reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
      >
        <RotateCcw className="h-3 w-3" />
        {preferences.reducedMotion && <Check className="h-3 w-3" />}
      </Button>

      <AccessibilityPanel
        trigger={
          <Button variant="outline" size="sm" className="gap-1" aria-label="Open accessibility settings">
            <Settings className="h-3 w-3" />
          </Button>
        }
      />
    </div>
  );
} 