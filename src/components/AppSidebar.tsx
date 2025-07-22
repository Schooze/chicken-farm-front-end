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
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard',      url: '/dashboard', icon: Home     },
  { title: 'Control Center', url: '/control', icon: Settings },
  { title: 'Analytics',      url: '/analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <Activity 
            className={`text-primary flex-shrink-0 transition-all duration-200 ${
              state === 'collapsed' ? 'h-5 w-5' : 'h-8 w-8'
            }`} 
          />
          {state === 'expanded' && (
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">Farm Control</h2>
              <p className="text-xs text-muted-foreground truncate">IoT Monitoring System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {state === 'expanded' ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="relative">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={state === 'collapsed' ? item.title : undefined}
                    >
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-3 px-3 py-2.5 transition-all duration-200 relative',
                            isActive
                              ? 'bg-green-50 text-green-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          ].join(' ')
                        }
                      >
                        {/* Active indicator - green left border */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-sm" />
                        )}
                        
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-green-600' : ''}`} />
                        {state === 'expanded' && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Farm Status Indicator - Only show when expanded */}
        {state === 'expanded' && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>System Status</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                  <span className="text-muted-foreground truncate">All Systems Online</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}