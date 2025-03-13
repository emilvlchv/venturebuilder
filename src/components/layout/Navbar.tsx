
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, MessageSquare, Settings, CreditCard } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, subscription } = useAuth();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Journey', path: '/journey' },
    { name: 'Education', path: '/education' },
    { name: 'Community', path: '/community' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToSubscription = () => {
    navigate('/subscription');
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const getSubscriptionBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'trial':
        return <Badge variant="secondary">Trial</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">No Plan</Badge>;
    }
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
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <span className="font-bold text-lg">VW</span>
            </div>
            <span className="font-bold text-xl">VentureWayfinder</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* CTA Button - Fixed to always show authenticated state properly */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Subscription Badge */}
                <div 
                  className="cursor-pointer" 
                  onClick={goToSubscription}
                >
                  {getSubscriptionBadge()}
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="font-medium">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      {user?.firstName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 bg-background border border-border shadow-md w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/journey')} className="cursor-pointer">
                      <MessageSquare size={16} className="mr-2" />
                      My Journey
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
                      <User size={16} className="mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToSubscription} className="cursor-pointer">
                      <CreditCard size={16} className="mr-2" />
                      Subscription
                      {subscription.status !== 'none' && (
                        <span className="ml-auto">{getSubscriptionBadge()}</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Mobile subscription badge */}
                <div 
                  className="cursor-pointer" 
                  onClick={goToSubscription}
                >
                  {getSubscriptionBadge()}
                </div>
              </div>
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

        {/* Mobile Menu */}
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
                        icon={<User size={16} />}
                        onClick={goToProfile}
                      >
                        Profile Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        fullWidth 
                        icon={<CreditCard size={16} />}
                        onClick={goToSubscription}
                      >
                        Subscription {subscription.status !== 'none' && getSubscriptionBadge()}
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
