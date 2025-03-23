import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard from '@/components/journey/JourneyWizard';
import JourneyManager from '@/components/journey/JourneyManager';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StepDetailsDialog from '@/components/journey/StepDetailsDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { Journey } from '@/components/journey/types';
import { Button } from '@/components/ui/button';
import AIChatAssistant from '@/components/journey/AIChatAssistant';

const JourneyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [hasCompletedInitialChat, setHasCompletedInitialChat] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      const journeysKey = `journeys_${user.id}`;
      const journeysData = localStorage.getItem(journeysKey);
      
      if (journeysData) {
        try {
          const journeys = JSON.parse(journeysData);
          if (journeys.length > 0) {
            const latestJourney = journeys.sort((a: Journey, b: Journey) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )[0];
            
            setSelectedJourneyId(latestJourney.id);
            setSelectedJourney(latestJourney);
            
            if (latestJourney.businessIdeaData) {
              setHasCompletedInitialChat(true);
            }
          }
        } catch (error) {
          console.error("Error loading journeys:", error);
        }
      } else {
        const completedChat = localStorage.getItem(`journey_initial_chat_${user.id}`) === 'completed';
        setHasCompletedInitialChat(completedChat);
        
        if (completedChat) {
          try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.businessData) {
              console.log("Legacy data detected, will be migrated by JourneyManager");
            }
          } catch (error) {
            console.error("Error checking legacy data:", error);
          }
        }
      }
    }
  }, [user?.id]);

  const handleJourneySelect = (journeyId: string) => {
    if (user?.id) {
      const journeysKey = `journeys_${user.id}`;
      const journeysData = localStorage.getItem(journeysKey);
      
      if (journeysData) {
        try {
          const journeys = JSON.parse(journeysData);
          const journey = journeys.find((j: Journey) => j.id === journeyId);
          
          if (journey) {
            setSelectedJourneyId(journeyId);
            setSelectedJourney(journey);
            
            if (journey.businessIdeaData) {
              setHasCompletedInitialChat(true);
            } else {
              setHasCompletedInitialChat(false);
            }
          }
        } catch (error) {
          console.error("Error selecting journey:", error);
        }
      }
    }
  };

  const handleJourneyComplete = (data: any) => {
    console.log("Journey complete callback triggered with data:", data);
    setHasCompletedInitialChat(true);
    
    if (selectedJourneyId && user?.id) {
      const journeysKey = `journeys_${user.id}`;
      const journeysData = localStorage.getItem(journeysKey);
      
      if (journeysData) {
        try {
          const journeys = JSON.parse(journeysData);
          const updatedJourneys = journeys.map((journey: Journey) => {
            if (journey.id === selectedJourneyId) {
              return {
                ...journey,
                businessIdeaData: {
                  ...data,
                  solution: data.businessIdea || data.solution,
                  targetMarket: data.targetCustomers || data.targetMarket,
                  stage: data.teamComposition || data.stage,
                  industry: data.teamStrengths || data.industry,
                  problem: data.teamWeaknesses || data.problem
                },
                progress: Math.max(journey.progress, 15),
                updatedAt: new Date().toISOString()
              };
            }
            return journey;
          });
          
          localStorage.setItem(journeysKey, JSON.stringify(updatedJourneys));
          
          const updatedJourney = updatedJourneys.find((j: Journey) => j.id === selectedJourneyId);
          if (updatedJourney) {
            setSelectedJourney(updatedJourney);
          }
          
          if (selectedJourneyId) {
            const journeyDetailsPath = `/journey-details/${selectedJourneyId}`;
            console.log("Navigating to:", journeyDetailsPath);
            navigate(journeyDetailsPath);
            
            toast({
              title: "Journey Updated",
              description: "Your journey has been updated with your business information.",
            });
          }
        } catch (error) {
          console.error("Error updating journey:", error);
          toast({
            title: "Error",
            description: "An error occurred while updating your journey.",
            variant: "destructive"
          });
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStep(null);
  };

  const handleViewJourneyDetails = () => {
    if (selectedJourneyId) {
      const journeyDetailsPath = `/journey-details/${selectedJourneyId}`;
      console.log("Navigating to:", journeyDetailsPath);
      navigate(journeyDetailsPath);
    } else {
      toast({
        title: "Error",
        description: "No journey selected to view.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Your Entrepreneurial Journey</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Create and manage multiple business journeys to bring your ideas to life.
            </p>
          </div>
          
          <SubscriptionCheck>
            <div className="max-w-6xl mx-auto">
              {!selectedJourneyId || !selectedJourney ? (
                <div className="mb-10">
                  <JourneyManager onSelectJourney={handleJourneySelect} />
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <button 
                      onClick={() => setSelectedJourneyId(null)}
                      className="text-primary hover:underline flex items-center"
                    >
                      ← Back to All Journeys
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">{selectedJourney.title}</h2>
                    <p className="text-muted-foreground mb-4">{selectedJourney.description}</p>
                    
                    <div className="w-full bg-muted rounded-full h-2 mb-1 max-w-md">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${selectedJourney.progress}%` }}
                        role="progressbar"
                        aria-valuenow={selectedJourney.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedJourney.progress}% complete
                    </p>
                  </div>
                  
                  {!hasCompletedInitialChat ? (
                    <JourneyWizard 
                      onComplete={handleJourneyComplete} 
                      journeyId={selectedJourneyId}
                    />
                  ) : (
                    <div className="text-center">
                      <Card className="p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Journey in Progress</h3>
                        <p className="mb-6">
                          Your journey is underway! View the detailed steps and progress in the Journey Details page.
                        </p>
                        <Button 
                          onClick={handleViewJourneyDetails}
                          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                        >
                          View Journey Details
                        </Button>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </div>
          </SubscriptionCheck>
        </div>
      </main>
      <Footer />
      <StepDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        stepDetails={selectedStep} 
      />
      
      <AIChatAssistant 
        journeyId={selectedJourneyId} 
        businessData={selectedJourney?.businessIdeaData}
      />
    </div>
  );
};

export default JourneyPage;
