
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Shield, LayoutDashboard, UserCircle } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarUserMenuProps {
  isMobile?: boolean;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
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

  const getInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName ? user.firstName.charAt(0) : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  if (isMobile) {
    return (
      <div className="px-4 py-2 border-t border-border mt-2 pt-4">
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-10 w-10">
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user?.username || 'User'} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            fullWidth 
            icon={<UserCircle size={16} />}
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user?.username || 'User'} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
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
              <LayoutDashboard size={16} className="mr-2" />
              My Journey
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
            <Settings size={16} className="mr-2" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/subscription')} className="cursor-pointer">
            <User size={16} className="mr-2" />
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
