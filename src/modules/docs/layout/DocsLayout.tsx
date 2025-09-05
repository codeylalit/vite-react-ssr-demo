import React from 'react';
import Navigator from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { AccessibleLayout } from '@/shared/components/layout/AccessibleLayout';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  return (
    <AccessibleLayout>
      <div className="min-h-screen flex flex-col">
        <Navigator />
        <main className="flex-grow bg-background safe-area-container overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </AccessibleLayout>
  );
};
