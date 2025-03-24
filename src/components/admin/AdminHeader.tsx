
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateToMainSite = () => {
    navigate('/', { state: { fromAdmin: true } });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-main">Admin Portal</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-white text-[10px] rounded-full flex items-center justify-center">3</span>
          </Button>
          <div className="h-6 w-px bg-gray-200"></div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateToMainSite}
            className="font-medium border-brand-main/20 hover:bg-brand-main/5"
          >
            <Home size={16} className="mr-2" />
            Main Site
          </Button>
          <div className="h-6 w-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">Welcome back, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
