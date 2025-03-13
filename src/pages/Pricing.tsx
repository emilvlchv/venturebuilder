import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Crown, Rocket, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  price: number;
  annualPrice?: number;
  currency: string;
  billingPeriod: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  ctaText: string;
  priceId: string;
  annualPriceId?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    description: 'Perfect for exploring entrepreneurship basics',
    price: 10,
    annualPrice: 9.5, // 5% discount
    currency: '$',
    billingPeriod: 'month',
    features: [
      { name: 'Basic personalized journey', included: true },
      { name: 'Limited access to learning materials', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Progress tracking', included: true },
      { name: 'Advanced AI guidance', included: false },
      { name: 'Mentorship sessions', included: false },
      { name: 'Premium courses', included: false },
      { name: 'Networking events', included: false },
    ],
    ctaText: 'Subscribe Now',
    priceId: 'price_starter_monthly',
    annualPriceId: 'price_starter_yearly'
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: <Rocket className="h-6 w-6 text-purple-500" />,
    description: 'For serious entrepreneurs ready to scale',
    price: 29,
    annualPrice: 27.55, // 5% discount
    currency: '$',
    billingPeriod: 'month',
    features: [
      { name: 'Advanced personalized journey', included: true },
      { name: 'Full access to learning materials', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Detailed progress analytics', included: true },
      { name: 'Advanced AI guidance', included: true },
      { name: 'Monthly mentorship session', included: true },
      { name: 'Premium courses', included: true },
      { name: 'Networking events', included: false },
    ],
    highlighted: true,
    badge: 'Most Popular',
    ctaText: 'Subscribe Now',
    priceId: 'price_growth_monthly',
    annualPriceId: 'price_growth_yearly'
  },
  {
    id: 'accelerate',
    name: 'Accelerate',
    icon: <Crown className="h-6 w-6 text-amber-500" />,
    description: 'Complete support system for rapid growth',
    price: 39,
    annualPrice: 37.05, // 5% discount
    currency: '$',
    billingPeriod: 'month',
    features: [
      { name: 'Advanced personalized journey', included: true },
      { name: 'Full access to learning materials', included: true },
      { name: 'Priority community support', included: true },
      { name: 'Detailed progress analytics', included: true },
      { name: 'Advanced AI guidance', included: true },
      { name: 'Weekly mentorship sessions', included: true },
      { name: 'All premium courses', included: true },
      { name: 'Exclusive networking events', included: true },
    ],
    badge: 'Best Value',
    ctaText: 'Subscribe Now',
    priceId: 'price_accelerate_monthly',
    annualPriceId: 'price_accelerate_yearly'
  },
];

const FeatureCheckmark = ({ included }: { included: boolean }) => (
  included ? (
    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
  ) : (
    <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
  )
);

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [annualBilling, setAnnualBilling] = React.useState<boolean>(false);

  const handleSubscription = async (plan: PricingPlan) => {
    setLoadingPlan(plan.id);
    
    try {
      navigate('/payment', {
        state: {
          plan: {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            priceId: plan.priceId,
            annualPrice: plan.annualPrice,
            annualPriceId: plan.annualPriceId,
            isAnnual: annualBilling
          }
        }
      });
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Unable to process your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Invest in Your Entrepreneurial Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a plan that fits your ambition level and access the tools, guidance, and community you need.
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

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: pricingPlans.findIndex(p => p.id === plan.id) * 0.1 }}
              className="flex"
            >
              <Card className={cn(
                "flex flex-col w-full",
                plan.highlighted && "border-primary shadow-lg relative",
              )}>
                {plan.badge && (
                  <div className="absolute -top-3 right-0 left-0 flex justify-center">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={cn(
                  "text-center pb-8",
                  plan.highlighted && "bg-primary/5 rounded-t-lg"
                )}>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1.5">{plan.description}</CardDescription>
                  <div className="mt-6 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {plan.currency}{annualBilling && plan.annualPrice ? plan.annualPrice : plan.price}
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      /{plan.billingPeriod}
                    </span>
                  </div>
                  {annualBilling && plan.price > 0 && (
                    <p className="mt-1 text-sm text-green-600">Billed annually (5% discount)</p>
                  )}
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FeatureCheckmark included={feature.included} />
                        <span className={cn(
                          "ml-3",
                          !feature.included && "text-muted-foreground"
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Button
                    onClick={() => handleSubscription(plan)}
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">100% Satisfaction Guarantee</h3>
          <p className="text-muted-foreground">
            We're confident you'll love our platform. If you're not completely satisfied within 14 days, we'll refund your subscription - no questions asked.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
