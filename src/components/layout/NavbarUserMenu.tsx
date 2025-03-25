import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/shared/Button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarUserMenuProps {
  isMobile?: boolean;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ isMobile = false }) => {
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("AuthProvider not available in NavbarUserMenu:", error);
    return null; // Don't render the user menu if auth context is not available
  }
  
  const { user, logout } = authContext;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  if (isMobile) {
    return (
      <div className="px-4 py-2 border-t border-border mt-2 pt-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            fullWidth 
            icon={<Settings size={16} />}
            onClick={goToProfile}
          >
            Profile Settings
          </Button>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleLogout}
            icon={<LogOut size={16} />}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && !location.pathname.startsWith('/admin') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToAdmin}
          icon={<LayoutDashboard size={16} />}
          className="font-medium"
        >
          Admin Panel
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={goToProfile}
        icon={<User size={16} />}
        className="font-medium"
      >
        My Account
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <Settings size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 bg-background border border-border shadow-md">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground">@{user?.username}</p>
          </div>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem onClick={goToAdmin} className="cursor-pointer">
              <Shield size={16} className="mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem onClick={() => navigate('/journey')} className="cursor-pointer">
              My Journey
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
            <Settings size={16} className="mr-2" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/subscription')} className="cursor-pointer">
            Subscription
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
            <LogOut size={16} className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarUserMenu;
