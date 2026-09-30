import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function BaseLayout({ children, showSidebar = true }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-navy text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {showSidebar && <Sidebar />}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
