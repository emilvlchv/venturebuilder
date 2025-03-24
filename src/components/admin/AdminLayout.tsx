
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("");

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const path = location.pathname.split('/')[2] || '';
    setActiveSection(path || 'overview');
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      navigate('/');
    } else if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activeSection={activeSection} />
      
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        <main className="bg-slate-50 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto py-8 px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
