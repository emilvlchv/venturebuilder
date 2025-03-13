import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/lib/stripe';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, CreditCard, ShieldCheck, Lock } from 'lucide-react';

interface LocationState {
  plan?: {
    id: string;
    name: string;
    price: number;
    priceId: string;
    annualPrice?: number;
    annualPriceId?: string;
    isAnnual: boolean;
  };
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LocationState['plan'] | undefined>(
    (location.state as LocationState)?.plan
  );

  useEffect(() => {
    // If no plan was provided in navigation state, redirect back to pricing
    if (!state) {
      toast({
        title: "No subscription plan selected",
        description: "Please select a subscription plan first",
        variant: "destructive",
      });
      navigate('/pricing');
    }
  }, [state, navigate, toast]);

  const handlePayment = async () => {
    if (!state) return;
    
    setLoading(true);
    try {
      // Get the appropriate priceId based on billing period
      const priceId = state.isAnnual && state.annualPriceId 
        ? state.annualPriceId 
        : state.priceId;
        
      // Call the Stripe checkout function
      const result = await createCheckoutSession(priceId);
      
      toast({
        title: "Payment successful",
        description: "Thank you for your subscription!",
      });
      
      // Navigate to subscription page after successful payment
      navigate('/subscription', { 
        state: { 
          success: true, 
          plan: state.name,
          isAnnual: state.isAnnual
        } 
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate('/pricing')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to pricing
        </Button>
        
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Complete your purchase</CardTitle>
                <CardDescription>
                  You're subscribing to the {state.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name on card</Label>
                  <Input id="name" placeholder="John Smith" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card">Card number</Label>
                  <div className="relative">
                    <Input 
                      id="card" 
                      placeholder="1234 5678 9012 3456" 
                      className="pr-10"
                    />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <div className="relative">
                      <Input id="cvc" placeholder="123" />
                      <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePayment} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${state.isAnnual ? state.annualPrice : state.price}$ ${state.isAnnual ? 'annually' : 'monthly'}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{state.name} Plan</span>
                  <span>${state.isAnnual ? state.annualPrice : state.price}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Billing period</span>
                  <span>{state.isAnnual ? 'Annual' : 'Monthly'}</span>
                </div>
                {state.isAnnual && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Annual discount</span>
                    <span>-5%</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${state.isAnnual ? state.annualPrice : state.price}{state.isAnnual ? '/year' : '/month'}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {state.isAnnual ? 'Billed annually' : 'Billed monthly'}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
              <p className="mt-2">
                Questions? Contact our support team at support@yourapp.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
