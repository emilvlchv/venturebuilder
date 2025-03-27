
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img 
          src="/lovable-uploads/928499d2-df35-497b-ab7b-fddcdbf756ef.png" 
          alt="VentureWay Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-bold text-xl text-brand-main">VentureWay</span>
    </Link>
  );
};

export default NavbarLogo;
