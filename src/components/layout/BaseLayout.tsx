import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function BaseLayout({ children, showSidebar = true }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-gray-900 flex flex-col antialiased">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 gap-8">
        {showSidebar && <Sidebar />}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
