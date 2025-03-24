import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '../shared/Button';
import { ChevronRight } from 'lucide-react';

interface NavbarActionsProps {
  isMobile?: boolean;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isMobile = false }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const goToMainSite = () => {
    navigate('/', { state: { fromAdmin: true } });
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className={isMobile ? "pt-2 space-y-2" : "hidden md:flex items-center space-x-4"}>
        <Link to="/signin">
          <Button variant="outline" fullWidth={isMobile} size={isMobile ? "md" : "md"}>
            Sign in
          </Button>
        </Link>
        <Link to="/signup">
          <Button
            variant="primary"
            fullWidth={isMobile}
            size={isMobile ? "md" : "md"}
            icon={<ChevronRight size={16} />}
            iconPosition="right"
          >
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex items-center space-x-2">
        {isAdmin && location.pathname.startsWith('/admin') && (
          <Button variant="outline" size="sm" onClick={goToMainSite} className="mr-2">
            <Home size={16} className="mr-1" />
            <span>Main Site</span>
          </Button>
        )}
        {isAdmin && !location.pathname.startsWith('/admin') && (
          <Button variant="outline" size="sm" onClick={goToAdmin} className="mr-2">
            <LayoutDashboard size={16} className="mr-1" />
            <span>Admin</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center">
      {isAdmin && location.pathname.startsWith('/admin') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToMainSite}
          icon={<Home size={16} />}
          className="font-medium"
        >
          Main Site
        </Button>
      )}
    </div>
  );
};

export default NavbarActions;
