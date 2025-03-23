
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/stripe';
import { useAuth } from '@/contexts/AuthContext';

const PricingTier = ({ 
  title, 
  price, 
  annualPrice, 
  isAnnual, 
  features, 
  priceId, 
  recommended = false, 
  onSelectPlan 
}: { 
  title: string; 
  price: number; 
  annualPrice: number; 
  isAnnual: boolean; 
  features: string[]; 
  priceId: string; 
  recommended?: boolean; 
  onSelectPlan: (priceId: string) => void; 
}) => {
  const displayPrice = isAnnual ? annualPrice : price;
  const savings = price * 12 - annualPrice;
  
  return (
    <Card className={`flex flex-col ${recommended ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
      {recommended && (
        <div className="w-full bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-lg">
          RECOMMENDED
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold tracking-tight">{formatCurrency(displayPrice)}</span>
            <span className="ml-1 text-muted-foreground">{isAnnual ? '/year' : '/month'}</span>
          </div>
          {isAnnual && (
            <p className="text-sm text-green-600 mt-2">
              Save {formatCurrency(savings)} annually
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onSelectPlan(priceId)}
          variant={recommended ? "default" : "outline"}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const toggleBilling = () => {
    setAnnualBilling(!annualBilling);
  };
  
  const handleSelectPlan = (priceId: string) => {
    if (!isAuthenticated) {
      navigate('/signin?redirect=pricing');
      return;
    }
    navigate(`/payment?plan=${priceId}`);
  };
  
  const plans = [
    {
      title: "Starter",
      price: 9.99,
      annualPrice: 95.88, // 7.99 * 12
      features: [
        "3 AI-generated business ideas per month",
        "Basic journey steps and templates",
        "Access to educational articles and tutorials",
        "Community access (read-only)",
        "Email support"
      ],
      priceId: "price_starter_monthly",
      annualPriceId: "price_starter_yearly"
    },
    {
      title: "Professional",
      price: 24.99,
      annualPrice: 239.88, // 19.99 * 12
      features: [
        "Unlimited AI-generated business ideas",
        "Advanced journeys with detailed steps",
        "Full educational content access",
        "Community participation",
        "Priority email support",
        "Business plan generation",
        "1 custom journey per month"
      ],
      priceId: "price_professional_monthly",
      annualPriceId: "price_professional_yearly",
      recommended: true
    },
    {
      title: "Enterprise",
      price: 49.99,
      annualPrice: 479.88, // 39.99 * 12
      features: [
        "Everything in Professional",
        "Multiple business journeys",
        "Team collaboration features",
        "Educational video generation",
        "Dedicated support manager",
        "API access",
        "Custom integrations"
      ],
      priceId: "price_enterprise_monthly",
      annualPriceId: "price_enterprise_yearly"
    }
  ];
  
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for your entrepreneurial journey.
          </p>
          
          <div className="flex items-center justify-center mt-10">
            <span className={`mr-3 ${!annualBilling ? 'font-bold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch 
              checked={annualBilling} 
              onCheckedChange={toggleBilling} 
              id="billing-toggle"
            />
            <Label 
              htmlFor="billing-toggle" 
              className={`ml-3 flex items-center ${annualBilling ? 'font-bold' : 'text-muted-foreground'}`}
            >
              Yearly
              <span className="ml-2 py-0.5 px-1.5 text-xs bg-green-100 text-green-800 rounded font-medium">
                Save 20%
              </span>
            </Label>
          </div>
        </div>
        
        <div className="grid gap-6 lg:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingTier
              key={plan.title}
              title={plan.title}
              price={plan.price}
              annualPrice={plan.annualPrice}
              isAnnual={annualBilling}
              features={plan.features}
              priceId={annualBilling ? plan.annualPriceId : plan.priceId}
              recommended={plan.recommended}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 7-day free trial. No credit card required.
          </p>
          <Button variant="outline" onClick={() => handleSelectPlan("price_starter_monthly")}>
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
