
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
  // Don't try to access auth context directly here
  // This component will be conditionally rendered by Navbar
  // which already handles the auth context availability

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
    </>
  );
};

export default MobileMenu;
