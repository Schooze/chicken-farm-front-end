import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/AppHeader';
import { AppSidebar } from '@/components/AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AppHeader />
          
          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}