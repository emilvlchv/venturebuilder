
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
// This is a Stripe test publishable key - safe to include in client code
const stripePromise = loadStripe('pk_test_51NZWEBLGBBQvbNbxNQZvxbHZB3wDMOgr62jqFGCnQYeEWdCewZTGVNZ7VQyiUMoxNnlYOK7uw1cEp6NLHSgLhxNN00Wf7e9xeX');

export { stripePromise };

// In a real application, this function would create a Stripe checkout session
export const createCheckoutSession = async (priceId: string) => {
  // This would make a call to your backend, which would create a Stripe checkout session
  // const response = await fetch('/api/create-checkout-session', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     priceId,
  //   }),
  // });
  
  // const { sessionId } = await response.json();
  // const stripe = await stripePromise;
  // stripe?.redirectToCheckout({ sessionId });
  
  // Simulate a network delay for demonstration purposes
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, we'll just return true to simulate success
  return true;
};

// Function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};
