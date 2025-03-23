
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
