
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  console.log("ProtectedRoute rendering:", { isAuthenticated, isLoading, user, session, path: location.pathname });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need to sign in to access this page.",
      });
    }
    
    if (adminOnly && !isLoading && isAuthenticated && user?.role !== 'admin') {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      });
    }
  }, [isLoading, isAuthenticated, adminOnly, user, toast]);

  // Handle authentication and permission checks in a single pass
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect immediately
  if (!isAuthenticated) {
    // Preserve the current URL to redirect back after login
    return <Navigate to={`/signin?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If page requires admin role and user is not admin, redirect immediately
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Only render children if all authentication and authorization checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
