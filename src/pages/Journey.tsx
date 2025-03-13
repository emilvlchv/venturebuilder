
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard from '@/components/journey/JourneyWizard';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';

const Journey = () => {
  const { user } = useAuth();
  const [hasCompletedInitialChat, setHasCompletedInitialChat] = useState(() => {
    // Check localStorage to see if user has completed the initial chat
    return localStorage.getItem(`journey_initial_chat_${user?.id}`) === 'completed';
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Start Your Entrepreneurial Journey</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Our AI assistant will guide you through a few questions to create a personalized roadmap for your business.
            </p>
          </div>
          
          {hasCompletedInitialChat ? (
            <SubscriptionCheck>
              {/* This content is only shown to users with subscriptions */}
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Personalized Journey</h2>
                <p className="text-center mb-8">
                  Based on your business idea, we've created a personalized roadmap to help you succeed.
                </p>
                {/* Personalized journey content will go here */}
                <div className="glass rounded-2xl p-6 md:p-8">
                  <p className="text-center text-lg mb-4">Your personalized journey is ready!</p>
                  {/* Additional journey content */}
                </div>
              </div>
            </SubscriptionCheck>
          ) : (
            /* This is shown to all users - the initial chat to get their business idea */
            <JourneyWizard onComplete={() => {
              // Mark initial chat as completed when user finishes
              localStorage.setItem(`journey_initial_chat_${user?.id}`, 'completed');
              setHasCompletedInitialChat(true);
            }} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journey;
