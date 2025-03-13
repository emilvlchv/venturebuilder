
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, MessageSquare, Settings } from 'lucide-react';
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

  const NavLink = ({ path, name }: { path: string; name: string }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link
        to={path}
        className={cn(
          'px-4 py-2 rounded-lg transition-all duration-200 relative',
          isActive 
            ? 'text-primary font-medium' 
            : 'text-foreground/80 hover:text-foreground hover:bg-accent'
        )}
      >
        {name}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
        )}
      </Link>
    );
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" onClick={goToProfile}>
                    <User size={16} className="mr-2" />
                    {user?.firstName || 'Profile'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 cursor-pointer" onClick={goToProfile}>
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/journey" className="cursor-pointer">My Journey</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription" className="cursor-pointer">Subscription</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Button variant="outline" size="sm" onClick={goToProfile} className="mr-2">
                <User size={16} />
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
                    <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={goToProfile}>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground">@{user?.username}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link to="/profile">
                        <Button 
                          variant="outline" 
                          fullWidth 
                          icon={<Settings size={16} />}
                        >
                          Profile Settings
                        </Button>
                      </Link>
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
