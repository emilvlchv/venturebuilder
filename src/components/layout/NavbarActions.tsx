
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Home, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '../shared/Button';

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
            <LogIn size={16} className="mr-2" />
            Sign in
          </Button>
        </Link>
        <Link to="/signup">
          <Button
            variant="primary"
            fullWidth={isMobile}
            size={isMobile ? "md" : "md"}
            icon={<UserPlus size={16} />}
            iconPosition="left"
          >
            Get Started
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center">
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
      {isAdmin && !location.pathname.startsWith('/admin') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToAdmin}
          icon={<LayoutDashboard size={16} />}
          className="font-medium"
        >
          Admin
        </Button>
      )}
    </div>
  );
};

export default NavbarActions;
