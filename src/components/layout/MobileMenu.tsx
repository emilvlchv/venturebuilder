
import React from 'react';
import { X, Menu } from 'lucide-react';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarActions from './NavbarActions';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
  // Add a fallback for useAuth in case the component renders outside of AuthProvider
  let isAuthenticated = false;
  try {
    const { isAuthenticated: authStatus } = useAuth();
    isAuthenticated = authStatus;
  } catch (error) {
    console.error("AuthProvider not available in MobileMenu:", error);
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="md:hidden focus:outline-none"
        aria-label="Close menu"
      >
        <X size={24} />
      </button>

      <div className="md:hidden py-4 animate-fade-in">
        <NavbarLinks isMobile />
        {isAuthenticated ? (
          <NavbarUserMenu isMobile />
        ) : (
          <NavbarActions isMobile />
        )}
      </div>
    </>
  );
};

export default MobileMenu;
