import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckIcon, Info } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe (in a real app, you'd get this from an environment variable)
// This is a Stripe test publishable key - safe to include in client code
const stripePromise = loadStripe('pk_test_51NZWEBLGBBQvbNbxNQZvxbHZB3wDMOgr62jqFGCnQYeEWdCewZTGVNZ7VQyiUMoxNnlYOK7uw1cEp6NLHSgLhxNN00Wf7e9xeX');

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  annualPrice?: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Basic features for getting started',
    price: 10,
    annualPrice: 9.5, // 5% discount
    interval: 'month',
    features: [
      { name: 'Personalized journey', included: true },
      { name: 'Access to community', included: true },
      { name: 'Basic learning materials', included: true },
      { name: 'Progress tracking', included: true },
      { name: 'Advanced AI-guidance', included: false },
      { name: 'Priority support', included: false },
      { name: 'Premium courses', included: false },
    ],
    buttonText: 'Subscribe Now'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Everything you need for serious entrepreneurs',
    price: 29,
    annualPrice: 27.55, // 5% discount
    interval: 'month',
    features: [
      { name: 'Personalized journey', included: true },
      { name: 'Access to community', included: true },
      { name: 'Basic learning materials', included: true },
      { name: 'Progress tracking', included: true },
      { name: 'Advanced AI-guidance', included: true },
      { name: 'Priority support', included: true },
      { name: 'Premium courses', included: true },
    ],
    popular: true,
    buttonText: 'Subscribe Now'
  },
  {
    id: 'accelerate',
    name: 'Accelerate',
    description: 'Best value for committed founders',
    price: 39,
    annualPrice: 37.05, // 5% discount
    interval: 'month',
    features: [
      { name: 'Personalized journey', included: true },
      { name: 'Access to community', included: true },
      { name: 'Basic learning materials', included: true },
      { name: 'Progress tracking', included: true },
      { name: 'Advanced AI-guidance', included: true },
      { name: 'Priority support', included: true },
      { name: 'Premium courses', included: true },
    ],
    buttonText: 'Subscribe Now'
  }
];

const Subscription = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const [annualBilling, setAnnualBilling] = useState<boolean>(false);

  const handleSubscription = async (planId: string) => {
    setLoading(planId);
    
    try {
      // In a real app, you would:
      // 1. Make a call to your backend to create a Stripe checkout session
      // 2. Redirect to the Stripe checkout page
      // 3. Handle the redirect back to your app after payment
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (planId === 'free') {
        toast({
          title: "Free plan activated",
          description: "You're now on the free plan. Enjoy!",
        });
      } else {
        // In a real implementation, this would redirect to Stripe Checkout
        toast({
          title: "Stripe checkout",
          description: "In a real implementation, you would be redirected to Stripe checkout page.",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Unable to process your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Invest in your entrepreneurial journey with a plan that fits your needs.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => setAnnualBilling(false)}
            className={`px-4 py-2 rounded-md ${!annualBilling ? 'bg-white shadow-sm' : ''}`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setAnnualBilling(true)}
            className={`px-4 py-2 rounded-md ${annualBilling ? 'bg-white shadow-sm' : ''}`}
          >
            Annual billing <span className="text-green-600 font-medium">(-5%)</span>
          </button>
        </div>
      </div>

      <Alert className="max-w-3xl mx-auto mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Secure payments powered by Stripe</AlertTitle>
        <AlertDescription>
          All payments are securely processed through Stripe. We don't store your payment information.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Popular</span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${annualBilling && plan.annualPrice ? plan.annualPrice : plan.price}</span>
                <span className="text-muted-foreground">/month</span>
                {annualBilling && plan.price > 0 && (
                  <div className="text-sm text-green-600 mt-1">Save 5% with annual billing</div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-muted mr-2 shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSubscription(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </span>
                ) : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Money-back Guarantee</h3>
        <p className="text-muted-foreground">
          Not satisfied with our service? Get a full refund within 14 days of your purchase. No questions asked.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
