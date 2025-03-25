
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarActions from './NavbarActions';
import MobileMenu from './MobileMenu';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Create a separate component that uses useAuth and is only rendered when AuthProvider is available
const AuthenticatedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md',
        scrolled ? 'bg-background/80 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavbarLogo />
          <NavbarLinks />

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <NavbarUserMenu />
            ) : (
              <NavbarActions />
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <MobileMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <NavbarLinks isMobile />
            {isAuthenticated ? (
              <NavbarUserMenu isMobile />
            ) : (
              <NavbarActions isMobile />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// Main Navbar component that doesn't directly use useAuth
const Navbar = () => {
  try {
    // Try to access useAuth to check if we're inside AuthProvider
    // This will throw if we're not in an AuthProvider context
    useAuth();
    
    // If we get here, we're inside an AuthProvider, so render authenticated navbar
    return <AuthenticatedNavbar />;
  } catch (error) {
    // If we're not inside AuthProvider, render a simplified navbar
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavbarLogo />
            <NavbarLinks />
          </div>
        </div>
      </header>
    );
  }
};

export default Navbar;
