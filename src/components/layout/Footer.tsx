
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
    <footer className="bg-secondary/50">
      <div className="container-padding py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Branding and Description */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <span className="font-bold text-sm">VW</span>
              </div>
              <span className="font-bold text-lg">VentureWayfinder</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Guiding young entrepreneurs through their business journey with personalized
              assistance, education, and community support.
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} VentureWayfinder. All rights reserved.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="md:col-span-3">
              <h4 className="font-medium text-sm mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-foreground transition-colors"
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
