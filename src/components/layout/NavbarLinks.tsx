
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavbarLinksProps {
  className?: string;
  isMobile?: boolean;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ className, isMobile = false }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const navLinks = [
    { name: isAdmin ? 'Admin Panel' : 'Journey', path: isAdmin ? '/admin' : '/journey' },
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
            <Link
              to={link.path}
              className={cn(
                "h-10 px-4 py-2 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                location.pathname === link.path && "bg-accent/80 text-accent-foreground font-medium"
              )}
            >
              {link.name}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarLinks;
