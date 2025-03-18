
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, MessageSquare, Settings, Shield } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Updated navLinks to show Admin Panel instead of Journey for admin users
  const navLinks = [
    { name: isAdmin ? 'Admin Panel' : 'Journey', path: isAdmin ? '/admin' : '/journey' },
    { name: 'Education', path: '/education' },
    { name: 'Community', path: '/community' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

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

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md',
        scrolled ? 'bg-background/80 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <span className="font-bold text-lg">VW</span>
            </div>
            <span className="font-bold text-xl">VentureWayfinder</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <Link to={link.path}>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === link.path && "bg-accent/80 text-accent-foreground font-medium"
                    )}>
                      {link.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
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
                    <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/journey')} className="cursor-pointer">
                      {isAdmin ? (
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2" />
                          Admin Dashboard
                        </div>
                      ) : (
                        'My Journey'
                      )}
                    </DropdownMenuItem>
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
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="md">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ChevronRight size={16} />}
                    iconPosition="right"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={goToProfile} className="mr-2">
                <User size={16} className="mr-1" />
                <span>My Account</span>
              </Button>
            )}
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-3 rounded-lg",
                    location.pathname === link.path 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "hover:bg-accent/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link to="/signin">
                    <Button variant="outline" fullWidth>
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
