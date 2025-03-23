import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Journey', path: '/journey' },
        { name: 'Education', path: '/education' },
        { name: 'Community', path: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-brand-secondary">
      <div className="container-padding py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Branding and Description */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/fed329d4-6ab4-4c2e-bbf3-12167f17f15b.png" 
                  alt="VentureWay Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg text-brand-main">VentureWay</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Guiding young entrepreneurs through their business journey with personalized
              assistance, education, and community support.
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} VentureWay. All rights reserved.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="md:col-span-3">
              <h4 className="font-medium text-sm mb-4 text-brand-main">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-brand-main transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
