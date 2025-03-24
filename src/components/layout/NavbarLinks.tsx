
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavbarLinksProps {
  className?: string;
  isMobile?: boolean;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ className, isMobile = false }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // For simplicity, we'll just use the same links regardless of user role
  const navLinks = [
    { name: 'Journey', path: '/journey' },
    { name: 'Education', path: '/education' },
    { name: 'Community', path: '/community' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

  if (isMobile) {
    return (
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
      </nav>
    );
  }

  return (
    <NavigationMenu className={cn("hidden md:flex", className)}>
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
  );
};

export default NavbarLinks;
