
import React from 'react';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="md:hidden">
      <button
        onClick={onToggle}
        className="p-2 -mr-2 transition-all rounded-md hover:bg-muted focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 right-0 p-4 mt-2 bg-background border-t shadow-lg animate-in slide-in-from-top-5">
          <div className="space-y-3">
            <NavbarLinks isMobile />
            {isAuthenticated && (
              <div className="pt-2 mt-2 border-t">
                <NavbarUserMenu isMobile={true} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
