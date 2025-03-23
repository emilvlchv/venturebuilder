
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img 
          src="/lovable-uploads/397b5fd1-2dde-4adf-b3cf-9ae9e5f2a93e.png" 
          alt="VentureWay Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-bold text-xl text-brand-main">VentureWay</span>
    </Link>
  );
};

export default NavbarLogo;
