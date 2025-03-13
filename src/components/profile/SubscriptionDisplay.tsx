
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type SubscriptionInfo = {
  status: 'active' | 'trial' | 'expired' | 'none';
  planId?: string;
  trialEnd?: string;
  renewalDate?: string;
};

interface SubscriptionDisplayProps {
  subscription: SubscriptionInfo;
}

export function SubscriptionDisplay({ subscription }: SubscriptionDisplayProps) {
  const navigate = useNavigate();
  
  const getPlanName = (planId: string = 'none') => {
    const plans: Record<string, string> = {
      'starter': 'Starter Plan',
      'premium': 'Premium Plan',
      'accelerate': 'Accelerate Plan',
      'none': 'No Plan'
    };
    return plans[planId] || 'Unknown Plan';
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'trial': return 'Trial';
      case 'expired': return 'Expired';
      default: return 'No Subscription';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return 0;
    
    const today = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Your Subscription</CardTitle>
          <Badge variant={getBadgeVariant(subscription.status)}>
            {getStatusText(subscription.status)}
          </Badge>
        </div>
        <CardDescription>
          {subscription.status === 'trial' 
            ? `Free trial - ${getDaysRemaining(subscription.trialEnd)} days remaining` 
            : getPlanName(subscription.planId)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription.status === 'active' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Active subscription to {getPlanName(subscription.planId)}</span>
            </div>
            {subscription.renewalDate && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Next billing on {formatDate(subscription.renewalDate)}</span>
              </div>
            )}
          </div>
        )}
        
        {subscription.status === 'trial' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="h-4 w-4 text-amber-500" />
              <span>Trial ends on {formatDate(subscription.trialEnd)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You're currently on a free trial of our {getPlanName(subscription.planId)}. 
              Subscribe before your trial ends to keep access to all features.
            </p>
          </div>
        )}
        
        {(subscription.status === 'none' || subscription.status === 'expired') && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You don't have an active subscription. Subscribe to get access to all features.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <Button 
            onClick={() => navigate('/pricing')} 
            variant={subscription.status === 'none' || subscription.status === 'expired' ? 'default' : 'outline'}
            className="w-full"
          >
            {subscription.status === 'active' ? 'Manage Subscription' : 'View Plans'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
