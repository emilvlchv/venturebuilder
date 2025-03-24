
import React from 'react';
import { X, Menu } from 'lucide-react';
import NavbarLinks from './NavbarLinks';
import NavbarActions from './NavbarActions';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
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
        <NavbarActions isMobile />
      </div>
    </>
  );
};

export default MobileMenu;
