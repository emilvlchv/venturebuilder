
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const AdminSidebarLink = memo(({ 
  to, 
  isActive, 
  icon, 
  children, 
  badge 
}: SidebarLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between text-sm px-3 py-3 rounded-lg transition-colors group ${
        isActive ? "bg-white/15 text-white font-medium" : "hover:bg-white/10 text-white/90"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{children}</span>
      </div>
      {badge || <ChevronRight size={16} className="text-white/40 group-hover:text-white" />}
    </Link>
  );
});

AdminSidebarLink.displayName = 'AdminSidebarLink';

export default AdminSidebarLink;
