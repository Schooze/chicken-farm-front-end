import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Settings, Activity, BarChart3 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Control Center', url: '/control', icon: Settings },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Farm Control</h2>
            <p className="text-xs text-muted-foreground">IoT Monitoring System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === item.url}
                >
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 px-3 py-2 transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-accent rounded-r-md'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md'
                    ].join(' ')
                  }
                >
                </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Farm Status Indicator */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>System Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-muted-foreground">All Systems Online</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}