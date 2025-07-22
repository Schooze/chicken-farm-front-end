// src/App.tsx
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';           // ini akan jadi DashboardPage
import ControlPage from '@/pages/ControlPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Redirect root ("/") → "/dashboard" */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Index />}
            />
            {/* Control Center */}
            <Route
              path="/control"
              element={<ControlPage />}
            />
            {/* Analytics */}
            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />
            {/* Catch-all untuk 404 */}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
