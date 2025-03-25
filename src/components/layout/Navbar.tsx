
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarActions from './NavbarActions';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Add a fallback for useAuth in case the component renders outside of AuthProvider
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("AuthProvider not available in Navbar:", error);
    authContext = { isAuthenticated: false };
  }
  
  const { isAuthenticated } = authContext;

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
            <NavbarActions isMobile />
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

export default Navbar;
