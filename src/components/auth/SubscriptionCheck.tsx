
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';

interface SubscriptionCheckProps {
  children: React.ReactNode;
}

const SubscriptionCheck: React.FC<SubscriptionCheckProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (!isLoading) {
      if (!user?.id) {
        setHasSubscription(false);
        return;
      }
      
      // Check if user has an active subscription or is in trial period
      const subscriptionData = localStorage.getItem('userSubscription');
      if (!subscriptionData) {
        setHasSubscription(false);
        return;
      }
      
      try {
        const subscription = JSON.parse(subscriptionData);
        // Check if subscription is active or in trial period
        const isValid = subscription.status === 'active' || 
                     (subscription.trialEnd && new Date(subscription.trialEnd) > new Date());
        setHasSubscription(isValid);
      } catch (e) {
        console.error("Error parsing subscription data:", e);
        setHasSubscription(false);
      }
    }
  }, [user?.id, isLoading]);

  console.log("SubscriptionCheck rendering:", { hasSubscription, userId: user?.id, isLoading });

  if (isLoading || hasSubscription === null) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Subscription Required</CardTitle>
            <CardDescription className="text-center">
              You need an active subscription to access your personalized journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              You can start with a 7-day free trial to explore all features of your entrepreneurial journey.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Subscription Plans
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // Create a trial subscription for 7 days
                const trialEnd = new Date();
                trialEnd.setDate(trialEnd.getDate() + 7);
                
                localStorage.setItem('userSubscription', JSON.stringify({
                  status: 'trial',
                  trialEnd: trialEnd.toISOString(),
                  planId: 'starter'
                }));
                
                setHasSubscription(true);
              }}
              className="w-full"
            >
              Start 7-Day Free Trial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionCheck;
