
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  // Using our simplified AuthContext
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activeSection="overview" />
      
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
