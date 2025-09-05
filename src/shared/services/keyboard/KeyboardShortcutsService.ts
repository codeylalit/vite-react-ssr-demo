import React from 'react';

// Types for keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
  action: () => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
  global?: boolean; // Works even when inputs are focused
}

export interface ShortcutCategory {
  name: string;
  description: string;
  shortcuts: KeyboardShortcut[];
}

// Event types
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

class KeyboardShortcutsService {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private eventListeners: Set<KeyboardEventHandler> = new Set();
  private isEnabled = true;
  private excludedElements = ['INPUT', 'TEXTAREA', 'SELECT'];

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Add global keyboard event listener
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Register default shortcuts
    this.registerDefaultShortcuts();
  }

  private registerDefaultShortcuts() {
    // Navigation shortcuts
    this.register({
      key: '/',
      description: 'Focus search',
      category: 'Navigation',
      action: this.focusSearch,
      global: true,
    });

    this.register({
      key: 'Escape',
      description: 'Close modal/dropdown',
      category: 'Navigation',
      action: this.closeModals,
      global: true,
    });

    this.register({
      key: '?',
      description: 'Show keyboard shortcuts',
      category: 'Help',
      action: this.showShortcutsModal,
      global: true,
    });

    // Dashboard shortcuts
    this.register({
      key: 'd',
      description: 'Go to dashboard',
      category: 'Navigation',
      action: () => this.navigate('/dashboard'),
      global: true,
    });

    this.register({
      key: 'a',
      description: 'Go to API keys',
      category: 'Navigation',
      action: () => this.navigate('/dashboard/api-keys'),
      global: true,
    });

    this.register({
      key: 'u',
      description: 'Go to usage',
      category: 'Navigation',
      action: () => this.navigate('/dashboard/usage'),
      global: true,
    });

    this.register({
      key: 's',
      description: 'Go to settings',
      category: 'Navigation',
      action: () => this.navigate('/dashboard/settings'),
      global: true,
    });

    // Application shortcuts
    this.register({
      key: 'n',
      description: 'New API key',
      category: 'Actions',
      ctrlKey: true,
      action: this.createNewApiKey,
    });

    this.register({
      key: 'r',
      description: 'Refresh data',
      category: 'Actions',
      ctrlKey: true,
      action: this.refreshData,
      preventDefault: true,
    });

    this.register({
      key: 'k',
      description: 'Command palette',
      category: 'Actions',
      ctrlKey: true,
      action: this.openCommandPalette,
    });

    // Theme shortcuts
    this.register({
      key: 't',
      description: 'Toggle theme',
      category: 'Appearance',
      ctrlKey: true,
      shiftKey: true,
      action: this.toggleTheme,
    });

    // Accessibility shortcuts
    this.register({
      key: '1',
      description: 'Skip to main content',
      category: 'Accessibility',
      action: this.skipToMain,
      global: true,
    });

    this.register({
      key: '2',
      description: 'Skip to navigation',
      category: 'Accessibility',
      action: this.skipToNavigation,
      global: true,
    });
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    const target = event.target as HTMLElement;
    const isFormElement = this.excludedElements.includes(target.tagName);
    
    // Create a key combination string
    const keyCombo = this.createKeyCombo(event);
    const shortcut = this.shortcuts.get(keyCombo);

    if (!shortcut) return;

    // Check if shortcut should work globally or only outside form elements
    if (!shortcut.global && isFormElement) return;

    // Check if shortcut is enabled
    if (shortcut.enabled === false) return;

    if (shortcut.preventDefault) {
      event.preventDefault();
    }

    try {
      shortcut.action();
    } catch (error) {
      console.error('Error executing keyboard shortcut:', error);
    }

    // Notify listeners
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in keyboard event listener:', error);
      }
    });
  }

  private createKeyCombo(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    
    parts.push(event.key);
    
    return parts.join('+');
  }

  // Public API
  register(shortcut: KeyboardShortcut): void {
    const keyCombo = this.createKeyComboString(shortcut);
    this.shortcuts.set(keyCombo, shortcut);
  }

  unregister(key: string, modifiers?: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean }): void {
    const keyCombo = modifiers 
      ? this.createKeyComboString({ key, ...modifiers } as KeyboardShortcut)
      : key;
    this.shortcuts.delete(keyCombo);
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isEnabledState(): boolean {
    return this.isEnabled;
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcutsByCategory(): ShortcutCategory[] {
    const categories: Map<string, KeyboardShortcut[]> = new Map();
    
    this.shortcuts.forEach(shortcut => {
      if (!categories.has(shortcut.category)) {
        categories.set(shortcut.category, []);
      }
      categories.get(shortcut.category)!.push(shortcut);
    });

    return Array.from(categories.entries()).map(([name, shortcuts]) => ({
      name,
      description: this.getCategoryDescription(name),
      shortcuts: shortcuts.sort((a, b) => a.key.localeCompare(b.key)),
    }));
  }

  addEventListener(listener: KeyboardEventHandler): void {
    this.eventListeners.add(listener);
  }

  removeEventListener(listener: KeyboardEventHandler): void {
    this.eventListeners.delete(listener);
  }

  // Helper methods
  private createKeyComboString(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('Meta');
    
    parts.push(shortcut.key);
    
    return parts.join('+');
  }

  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      'Navigation': 'Move around the application',
      'Actions': 'Perform common actions',
      'Appearance': 'Change visual settings',
      'Accessibility': 'Accessibility features',
      'Help': 'Get help and information',
    };
    return descriptions[category] || '';
  }

  // Default action implementations
  private focusSearch = () => {
    const searchInput = document.querySelector('[data-search-input], [placeholder*="search" i], input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  private closeModals = () => {
    // Dispatch escape key to close modals
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    
    // Also trigger close on modal backdrop
    const backdrop = document.querySelector('[data-modal-backdrop], .modal-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
  };

  private showShortcutsModal = () => {
    // Emit event to show shortcuts modal
    const event = new CustomEvent('show-shortcuts-modal');
    document.dispatchEvent(event);
  };

  private navigate = (path: string) => {
    // Emit navigation event
    const event = new CustomEvent('keyboard-navigate', { detail: { path } });
    document.dispatchEvent(event);
  };

  private createNewApiKey = () => {
    const event = new CustomEvent('create-api-key');
    document.dispatchEvent(event);
  };

  private refreshData = () => {
    const event = new CustomEvent('refresh-data');
    document.dispatchEvent(event);
  };

  private openCommandPalette = () => {
    const event = new CustomEvent('open-command-palette');
    document.dispatchEvent(event);
  };

  private toggleTheme = () => {
    const event = new CustomEvent('toggle-theme');
    document.dispatchEvent(event);
  };

  private skipToMain = () => {
    const main = document.querySelector('main, [role="main"], #main-content');
    if (main) {
      (main as HTMLElement).focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  private skipToNavigation = () => {
    const nav = document.querySelector('nav, [role="navigation"], #navigation');
    if (nav) {
      const firstLink = nav.querySelector('a, button');
      if (firstLink) {
        (firstLink as HTMLElement).focus();
      }
    }
  };
}

// Create singleton instance
export const keyboardShortcuts = new KeyboardShortcutsService();

// React Hook for using keyboard shortcuts
export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = React.useState<ShortcutCategory[]>([]);
  const [isEnabled, setIsEnabled] = React.useState(keyboardShortcuts.isEnabledState());

  React.useEffect(() => {
    // Update shortcuts when component mounts
    setShortcuts(keyboardShortcuts.getShortcutsByCategory());

    // Listen for shortcut changes
    const handleKeyboardEvent = () => {
      setShortcuts(keyboardShortcuts.getShortcutsByCategory());
    };

    keyboardShortcuts.addEventListener(handleKeyboardEvent);

    return () => {
      keyboardShortcuts.removeEventListener(handleKeyboardEvent);
    };
  }, []);

  const register = React.useCallback((shortcut: KeyboardShortcut) => {
    keyboardShortcuts.register(shortcut);
    setShortcuts(keyboardShortcuts.getShortcutsByCategory());
  }, []);

  const unregister = React.useCallback((key: string, modifiers?: any) => {
    keyboardShortcuts.unregister(key, modifiers);
    setShortcuts(keyboardShortcuts.getShortcutsByCategory());
  }, []);

  const enable = React.useCallback(() => {
    keyboardShortcuts.enable();
    setIsEnabled(true);
  }, []);

  const disable = React.useCallback(() => {
    keyboardShortcuts.disable();
    setIsEnabled(false);
  }, []);

  return {
    shortcuts,
    isEnabled,
    register,
    unregister,
    enable,
    disable,
    service: keyboardShortcuts,
  };
}

// Hook for registering temporary shortcuts
export function useTemporaryShortcut(
  shortcut: KeyboardShortcut,
  dependencies: React.DependencyList = []
) {
  React.useEffect(() => {
    keyboardShortcuts.register(shortcut);

    return () => {
      keyboardShortcuts.unregister(shortcut.key, {
        ctrlKey: shortcut.ctrlKey,
        altKey: shortcut.altKey,
        shiftKey: shortcut.shiftKey,
        metaKey: shortcut.metaKey,
      });
    };
  }, dependencies);
}

// Hook for handling keyboard navigation
export function useKeyboardNavigation() {
  React.useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { path } = event.detail;
      // Use React Router to navigate
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    document.addEventListener('keyboard-navigate', handleNavigate as EventListener);

    return () => {
      document.removeEventListener('keyboard-navigate', handleNavigate as EventListener);
    };
  }, []);
}

export default keyboardShortcuts; 