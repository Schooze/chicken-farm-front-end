import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'company' | 'anak_kandang'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.account_type)) {
    // User doesn't have the required role, redirect to their default page
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
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};