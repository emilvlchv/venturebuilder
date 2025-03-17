
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
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <span className="font-bold text-lg">VW</span>
              </div>
              <span className="font-bold text-xl">Admin</span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-2">Dashboard</p>
              <Link to="/admin" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </Link>
              <Link to="/admin/users" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <Users size={18} />
                <span>User Management</span>
              </Link>
              <Link to="/admin/community" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <FileText size={18} />
                <span>Community Management</span>
              </Link>
              <Link to="/admin/education" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <BookOpen size={18} />
                <span>Education Content</span>
              </Link>
              <Link to="/admin/analytics" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <BarChart4 size={18} />
                <span>Analytics</span>
              </Link>
              <Link to="/admin/settings" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-8 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
