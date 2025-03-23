
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart4, 
  Settings,
  LogOut,
  FileText,
  BookOpen,
  Shield,
  ShieldAlert,
  Database,
  Activity,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminSidebarLink from './AdminSidebarLink';

interface AdminSidebarProps {
  activeSection: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const navigateToMainSite = () => {
    navigate('/', { state: { fromAdmin: true } });
  };

  const isActive = (path: string) => {
    return activeSection === path;
  };

  return (
    <aside className="w-64 bg-brand-main text-white shadow-lg flex flex-col">
      <div className="p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/lovable-uploads/397b5fd1-2dde-4adf-b3cf-9ae9e5f2a93e.png" 
              alt="VentureWay Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-xl text-white">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={navigateToMainSite}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
          title="Return to main site"
        >
          <Home size={16} />
        </Button>
      </div>
      
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 border-b border-white/10">Main</p>
          
          <AdminSidebarLink 
            to="/admin" 
            isActive={isActive('overview')} 
            icon={<LayoutDashboard size={18} className="text-white/70 group-hover:text-white" />}
          >
            Dashboard
          </AdminSidebarLink>
          
          <AdminSidebarLink 
            to="/admin/users" 
            isActive={isActive('users')} 
            icon={<Users size={18} className="text-white/70 group-hover:text-white" />}
          >
            User Management
          </AdminSidebarLink>

          <AdminSidebarLink 
            to="/admin/behavior" 
            isActive={isActive('behavior')} 
            icon={<Activity size={18} className="text-white/70 group-hover:text-white" />}
            badge={<Badge className="bg-brand-accent hover:bg-brand-accent/90 text-[10px]">New</Badge>}
          >
            Behavioral Analysis
          </AdminSidebarLink>
          
          <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">Content</p>
          
          <AdminSidebarLink 
            to="/admin/community" 
            isActive={isActive('community')} 
            icon={<FileText size={18} className="text-white/70 group-hover:text-white" />}
            badge={<Badge className="bg-brand-accent hover:bg-brand-accent/90 text-[10px]">New</Badge>}
          >
            Community
          </AdminSidebarLink>
          
          <AdminSidebarLink 
            to="/admin/education" 
            isActive={isActive('education')} 
            icon={<BookOpen size={18} className="text-white/70 group-hover:text-white" />}
            badge={<Badge className="bg-amber-500 hover:bg-amber-600 text-[10px]">6</Badge>}
          >
            Education
          </AdminSidebarLink>
          
          <AdminSidebarLink 
            to="/admin/analytics" 
            isActive={isActive('analytics')} 
            icon={<BarChart4 size={18} className="text-white/70 group-hover:text-white" />}
          >
            Analytics
          </AdminSidebarLink>
          
          <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">System</p>
          
          <AdminSidebarLink 
            to="/admin/settings" 
            isActive={isActive('settings')} 
            icon={<Settings size={18} className="text-white/70 group-hover:text-white" />}
          >
            Settings
          </AdminSidebarLink>
          
          <AdminSidebarLink 
            to="/admin/security" 
            isActive={isActive('security')} 
            icon={<ShieldAlert size={18} className="text-white/70 group-hover:text-white" />}
          >
            Security
          </AdminSidebarLink>
          
          <AdminSidebarLink 
            to="/admin/database" 
            isActive={isActive('database')} 
            icon={<Database size={18} className="text-white/70 group-hover:text-white" />}
          >
            Database
          </AdminSidebarLink>
        </div>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-white text-brand-main rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={navigateToMainSite}
              className="w-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Home size={16} className="mr-2" />
              Main Site
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="w-full bg-white hover:bg-white/90 text-brand-main"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
