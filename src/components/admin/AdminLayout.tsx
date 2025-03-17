
import React, { useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
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
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

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

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-primary/90 to-primary/100 text-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-white text-primary flex items-center justify-center">
                <span className="font-bold text-lg">VW</span>
              </div>
              <span className="font-bold text-xl text-white">Admin</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-3 py-2">
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 border-b border-white/10">Main</p>
              <Link to="/admin" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} className="text-white/70 group-hover:text-white" />
                  <span>Overview</span>
                </div>
                <ChevronRight size={16} className="text-white/40 group-hover:text-white" />
              </Link>
              <Link to="/admin/users" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-white/70 group-hover:text-white" />
                  <span>User Management</span>
                </div>
                <ChevronRight size={16} className="text-white/40 group-hover:text-white" />
              </Link>
              
              <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">Content</p>
              <Link to="/admin/community" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-white/70 group-hover:text-white" />
                  <span>Community</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">New</Badge>
              </Link>
              <Link to="/admin/education" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-white/70 group-hover:text-white" />
                  <span>Education</span>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px]">6</Badge>
              </Link>
              <Link to="/admin/analytics" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <BarChart4 size={18} className="text-white/70 group-hover:text-white" />
                  <span>Analytics</span>
                </div>
                <ChevronRight size={16} className="text-white/40 group-hover:text-white" />
              </Link>
              
              <p className="text-xs uppercase font-semibold text-white/70 px-3 py-2 mt-6 border-b border-white/10">System</p>
              <Link to="/admin/settings" className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-white/70 group-hover:text-white" />
                  <span>Settings</span>
                </div>
                <ChevronRight size={16} className="text-white/40 group-hover:text-white" />
              </Link>
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
        </div>
      </div>
      
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
