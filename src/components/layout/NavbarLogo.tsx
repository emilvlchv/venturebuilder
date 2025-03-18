
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
        <span className="font-bold text-lg">VW</span>
      </div>
      <span className="font-bold text-xl">VentureWayfinder</span>
    </Link>
  );
};

export default NavbarLogo;
