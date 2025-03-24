
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
};

export default NavbarActions;
