
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionCheckProps {
  children: React.ReactNode;
}

const SubscriptionCheck: React.FC<SubscriptionCheckProps> = ({ children }) => {
  const { user, subscription, startFreeTrial } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const hasAccess = React.useMemo(() => {
    return subscription.status === 'active' || subscription.status === 'trial';
  }, [subscription]);

  const handleStartTrial = async () => {
    try {
      await startFreeTrial();
      toast({
        title: "Free trial started",
        description: "Your 7-day free trial has started. Enjoy all premium features!",
      });
      // Reload to show the journey
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error starting your free trial. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!hasAccess) {
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
              onClick={handleStartTrial}
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
