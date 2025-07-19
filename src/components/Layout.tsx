import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header with Sidebar Toggle */}
          <header className="h-12 flex items-center border-b border-border bg-card/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" />
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};