import React from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Force light mode only - no theme switching
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  return <>{children}</>;
}

// Dummy hook for backward compatibility
export const useTheme = () => {
  return {
    theme: 'light' as const,
    setTheme: () => {}, // No-op
  };
};
