import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Left Section: Trigger + Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600" />
            <h1 className="text-lg font-semibold text-foreground">
              Chicken Farm Control System
            </h1>
          </div>
        </div>

        {/* Right Section: Status + Controls */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Optimal</span>
          </div>
        </div>
      </div>
    </header>
  );
}