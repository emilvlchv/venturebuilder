
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
    { name: 'About Us', path: '/about' },
  ];

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
      <div className="container-padding py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <span className="font-bold text-lg">VW</span>
            </div>
            <span className="font-bold text-xl">VentureWayfinder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.name} path={link.path} name={link.name} />
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="primary" 
              size="md"
              icon={<ChevronRight size={16} />}
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-4 py-3 rounded-lg hover:bg-accent"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button variant="primary" fullWidth>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
