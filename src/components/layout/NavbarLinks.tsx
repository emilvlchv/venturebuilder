
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavbarLinksProps {
  className?: string;
  isMobile?: boolean;
  isAdmin?: boolean;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ className, isMobile = false, isAdmin = false }) => {
  const location = useLocation();
  
  // Use isAdmin prop instead of accessing auth context directly
  const navLinks = [
    { name: isAdmin ? 'Admin Panel' : 'Journey', path: isAdmin ? '/admin' : '/journey' },
    { name: 'Education', path: '/education' },
    { name: 'Community', path: '/community' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
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
            <NavigationMenuLink asChild className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === link.path && "bg-accent/80 text-accent-foreground font-medium"
            )}>
              <Link to={link.path}>
                {link.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarLinks;
