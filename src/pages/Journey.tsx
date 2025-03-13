
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard, { BusinessIdeaData } from '@/components/journey/JourneyWizard';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const Journey = () => {
  const { user } = useAuth();
  const [hasCompletedInitialChat, setHasCompletedInitialChat] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessIdeaData | null>(null);

  // Load user data on component mount
  useEffect(() => {
    if (user?.id) {
      // Check if user has completed the initial chat
      const completedChat = localStorage.getItem(`journey_initial_chat_${user.id}`) === 'completed';
      setHasCompletedInitialChat(completedChat);
      
      // Load business data if available
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.businessData) {
          setBusinessData(currentUser.businessData);
        }
      } catch (error) {
        console.error("Error loading business data:", error);
      }
    }
  }, [user?.id]);

  const handleJourneyComplete = () => {
    console.log("Journey complete callback triggered");
    // Mark initial chat as completed when user finishes
    if (user?.id) {
      localStorage.setItem(`journey_initial_chat_${user.id}`, 'completed');
    }
    setHasCompletedInitialChat(true);
    
    // Reload business data
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.businessData) {
        setBusinessData(currentUser.businessData);
      }
    } catch (error) {
      console.error("Error loading updated business data:", error);
    }
  };

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
                
                {businessData && (
                  <div className="space-y-6 mb-10">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4">Your Business Summary</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Business Idea</p>
                            <p>{businessData.businessIdea}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Team Composition</p>
                            <p>{businessData.teamComposition}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Team Strengths</p>
                            <p>{businessData.teamStrengths}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Areas for Improvement</p>
                            <p>{businessData.teamWeaknesses}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Target Customers</p>
                            <p>{businessData.targetCustomers}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="glass rounded-2xl p-6 md:p-8">
                  <p className="text-center text-lg mb-4">Your personalized journey is ready!</p>
                  {/* Additional journey content */}
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Next steps for your entrepreneurial journey:</h3>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                      <li>Complete your business plan with our AI-powered templates</li>
                      <li>Research your market and competitors</li>
                      <li>Define your unique value proposition</li>
                      <li>Set up your legal structure and financial foundation</li>
                      <li>Create your marketing strategy</li>
                    </ol>
                    <p className="mt-4">Click on any step to begin, or use our AI assistant to guide you through the process.</p>
                  </div>
                </div>
              </div>
            </SubscriptionCheck>
          ) : (
            /* This is shown to all users - the initial chat to get their business idea */
            <JourneyWizard onComplete={handleJourneyComplete} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journey;
