
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';

interface SubscriptionCheckProps {
  children: React.ReactNode;
}

const SubscriptionCheck: React.FC<SubscriptionCheckProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Always return the children for now since we're not implementing real subscription checks
  return <>{children}</>;
};

export default SubscriptionCheck;
