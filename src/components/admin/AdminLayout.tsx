
import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BarChart4, 
  Settings,
  LogOut,
  FileText,
  BookOpen,
  ChevronRight,
  Bell,
  Shield,
  ShieldAlert,
  Database,
  PanelRight,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Memoized sidebar link component to prevent unnecessary re-renders
const SidebarLink = memo(({ 
  to, 
  isActive, 
  icon, 
  children, 
  badge 
}: { 
  to: string; 
  isActive: boolean; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  badge?: React.ReactNode;
}) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between text-sm px-3 py-3 rounded-lg transition-colors group ${
        isActive ? "bg-white/15 text-white font-medium" : "hover:bg-white/10 text-white/90"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{children}</span>
      </div>
      {badge || <ChevronRight size={16} className="text-white/40 group-hover:text-white" />}
    </Link>
  );
});

SidebarLink.displayName = 'SidebarLink';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("");

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  // Set active section based on current path
  useEffect(() => {
    const path = location.pathname.split('/')[2] || '';
    setActiveSection(path || 'overview');
  }, [location.pathname]);

  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  }, [logout, navigate, toast]);

  useEffect(() => {
    // Redirect non-admin users
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

  const isActive = (path: string) => {
    return activeSection === path;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - optimized rendering */}
      <aside className="w-64 bg-gradient-to-b from-primary/90 to-primary/100 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-white text-primary flex items-center justify-center">
              <span className="font-bold text-lg">VW</span>
            </div>
            <span className="font-bold text-xl text-white">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 border-b border-white/10">Main</p>
            
            <SidebarLink 
              to="/admin" 
              isActive={isActive('overview')} 
              icon={<LayoutDashboard size={18} className="text-white/70 group-hover:text-white" />}
            >
              Dashboard
            </SidebarLink>
            
            <SidebarLink 
              to="/admin/users" 
              isActive={isActive('users')} 
              icon={<Users size={18} className="text-white/70 group-hover:text-white" />}
            >
              User Management
            </SidebarLink>
            
            <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">Content</p>
            
            <SidebarLink 
              to="/admin/community" 
              isActive={isActive('community')} 
              icon={<FileText size={18} className="text-white/70 group-hover:text-white" />}
              badge={<Badge className="bg-green-500 hover:bg-green-600 text-[10px]">New</Badge>}
            >
              Community
            </SidebarLink>
            
            <SidebarLink 
              to="/admin/education" 
              isActive={isActive('education')} 
              icon={<BookOpen size={18} className="text-white/70 group-hover:text-white" />}
              badge={<Badge className="bg-amber-500 hover:bg-amber-600 text-[10px]">6</Badge>}
            >
              Education
            </SidebarLink>
            
            <SidebarLink 
              to="/admin/analytics" 
              isActive={isActive('analytics')} 
              icon={<BarChart4 size={18} className="text-white/70 group-hover:text-white" />}
            >
              Analytics
            </SidebarLink>
            
            <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">System</p>
            
            <SidebarLink 
              to="/admin/settings" 
              isActive={isActive('settings')} 
              icon={<Settings size={18} className="text-white/70 group-hover:text-white" />}
            >
              Settings
            </SidebarLink>
            
            <SidebarLink 
              to="/admin/security" 
              isActive={isActive('security')} 
              icon={<ShieldAlert size={18} className="text-white/70 group-hover:text-white" />}
            >
              Security
            </SidebarLink>
            
            <SidebarLink 
              to="/admin/database" 
              isActive={isActive('database')} 
              icon={<Database size={18} className="text-white/70 group-hover:text-white" />}
            >
              Database
            </SidebarLink>
          </div>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-white/70">Administrator</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="w-full bg-white hover:bg-white/90 text-primary"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
              </Button>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">Welcome back, {user?.firstName}!</span>
            </div>
          </div>
        </header>
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
