
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import AutoWaitlistPopup from '@/components/waitlist/AutoWaitlistPopup';

interface PricingFeature {
  name: string;
}

const pricingFeatures: PricingFeature[] = [
  { name: 'Personalized business journey' },
  { name: 'Advanced AI guidance & assistant' },
  { name: 'Full access to learning materials' },
  { name: 'Community forum access' },
  { name: 'Detailed progress analytics' },
  { name: 'Weekly mentorship sessions' },
  { name: 'All premium courses' },
  { name: 'Exclusive networking events' },
];

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [annualBilling, setAnnualBilling] = React.useState<boolean>(false);

  const price = 19.99;
  const annualPrice = 18.99; // 5% discount on annual billing
  const priceId = 'price_monthly';
  const annualPriceId = 'price_yearly';

  const handleSubscription = async () => {
    setLoading(true);
    
    try {
      navigate('/payment', {
        state: {
          plan: {
            id: 'venture',
            name: 'Venture',
            price: price,
            priceId: priceId,
            annualPrice: annualPrice,
            annualPriceId: annualPriceId,
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
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Simple Pricing for Your Entrepreneurial Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to turn your idea into a successful business, all in one affordable plan.
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

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <Card className="flex flex-col w-full border-primary shadow-lg">
              <div className="absolute -top-3 right-0 left-0 flex justify-center">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  All Features Included
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-8 bg-primary/5 rounded-t-lg">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Venture Plan</CardTitle>
                <CardDescription className="mt-1.5">Complete support system for entrepreneurs</CardDescription>
                <div className="mt-6 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${annualBilling ? annualPrice : price}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    /month
                  </span>
                </div>
                {annualBilling && (
                  <p className="mt-1 text-sm text-green-600">Billed annually (5% discount)</p>
                )}
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {pricingFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-4">
                <Button
                  onClick={handleSubscription}
                  variant="default"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </span>
                  ) : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">100% Satisfaction Guarantee</h3>
          <p className="text-muted-foreground">
            We're confident you'll love our platform. If you're not completely satisfied within 14 days, we'll refund your subscription - no questions asked.
          </p>
        </div>
      </div>
      <AutoWaitlistPopup delay={5000} showOnce={true} />
    </Layout>
  );
};

export default Pricing;
