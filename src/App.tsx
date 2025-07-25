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
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import LoginPage from '@/pages/LoginPage';
import AdminPage from '@/pages/AdminPage';
import AnakKandangPage from '@/pages/AnakKandangPage';
import Index from '@/pages/Index';           // Dashboard
import ControlPage from '@/pages/ControlPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

// Component to handle root redirect based on user role
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.account_type) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'company':
      return <Navigate to="/dashboard" replace />;
    case 'anak_kandang':
      return <Navigate to="/anak-kandang" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Main App Router component - this needs to be inside AuthProvider
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      
      {/* Company Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <AlertProvider>
              <Layout>
                <Index />
              </Layout>
            </AlertProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/control"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <AlertProvider>
              <Layout>
                <ControlPage />
              </Layout>
            </AlertProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <AlertProvider>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </AlertProvider>
          </ProtectedRoute>
        }
      />
      
      {/* Anak Kandang Routes */}
      <Route
        path="/anak-kandang"
        element={
          <ProtectedRoute allowedRoles={['anak_kandang']}>
            <AnakKandangPage />
          </ProtectedRoute>
        }
      />
      
      {/* Root redirect based on auth */}
      <Route
        path="/"
        element={<RootRedirect />}
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;