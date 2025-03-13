
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
// This is a Stripe test publishable key - safe to include in client code
const stripePromise = loadStripe('pk_test_51NZWEBLGBBQvbNbxNQZvxbHZB3wDMOgr62jqFGCnQYeEWdCewZTGVNZ7VQyiUMoxNnlYOK7uw1cEp6NLHSgLhxNN00Wf7e9xeX');

export { stripePromise };

// Create a checkout session and redirect to Stripe Checkout
export const createCheckoutSession = async (priceId: string) => {
  try {
    // In a real application, this would call your backend API
    // For demo purposes, we're using Stripe Checkout redirect
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    
    console.log('Creating checkout session for price ID:', priceId);
    
    // In a production app, this would be a server call to create a checkout session
    // For this demo, we're using Stripe's redirect to checkout with the price ID
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/subscription?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    });
    
    if (error) {
      console.error('Stripe checkout error:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};
