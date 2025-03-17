
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard, { BusinessIdeaData } from '@/components/journey/JourneyWizard';
import JourneyManager from '@/components/journey/JourneyManager';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import StepDetailsDialog from '@/components/journey/StepDetailsDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskCard from '@/components/journey/TaskCard';
import { Journey } from '@/components/journey/types';

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
  const [activeTab, setActiveTab] = useState('ideation');
  const [tasks, setTasks] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (user?.id) {
      // Check if user has any journeys
      const journeysKey = `journeys_${user.id}`;
      const journeysData = localStorage.getItem(journeysKey);
      
      if (journeysData) {
        try {
          const journeys = JSON.parse(journeysData);
          // If there are journeys, set the selected journey to the first one
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
        // Check if user has completed the initial chat previously (legacy support)
        const completedChat = localStorage.getItem(`journey_initial_chat_${user.id}`) === 'completed';
        setHasCompletedInitialChat(completedChat);
        
        // If completed chat but no journeys, we need to migrate the data
        if (completedChat) {
          try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.businessData) {
              // Let the journey manager handle this migration
              console.log("Legacy data detected, will be migrated by JourneyManager");
            }
          } catch (error) {
            console.error("Error checking legacy data:", error);
          }
        }
      }
    }
  }, [user?.id]);

  // Load tasks for selected journey
  useEffect(() => {
    if (selectedJourneyId && user?.id) {
      const tasksKey = `journey_tasks_${user.id}_${selectedJourneyId}`;
      const savedTasks = localStorage.getItem(tasksKey);
      
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch (error) {
          console.error("Error loading tasks:", error);
          setTasks({}); // Reset to empty if error
        }
      } else {
        // No tasks saved yet for this journey
        setTasks({});
      }
    }
  }, [selectedJourneyId, user?.id]);

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

  const handleJourneyComplete = (data: BusinessIdeaData) => {
    console.log("Journey complete callback triggered with data:", data);
    setHasCompletedInitialChat(true);
    
    // Update the selected journey with the business data
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
                businessIdeaData: data,
                progress: Math.max(journey.progress, 15), // Set progress to at least 15%
                updatedAt: new Date().toISOString()
              };
            }
            return journey;
          });
          
          localStorage.setItem(journeysKey, JSON.stringify(updatedJourneys));
          
          // Update the selected journey
          const updatedJourney = updatedJourneys.find((j: Journey) => j.id === selectedJourneyId);
          if (updatedJourney) {
            setSelectedJourney(updatedJourney);
          }
        } catch (error) {
          console.error("Error updating journey:", error);
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStep(null);
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
              {/* Show journey manager or specific journey content */}
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
                    
                    {/* Journey progress bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-1 max-w-md">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${selectedJourney.progress}%` }}
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
                    <div>
                      {selectedJourney.businessIdeaData && (
                        <Card className="mb-10 p-6">
                          <h3 className="text-xl font-semibold mb-4">Business Overview</h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Business Concept</h4>
                              <p className="text-muted-foreground">{selectedJourney.businessIdeaData.businessIdea}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Target Customers</h4>
                              <p className="text-muted-foreground">{selectedJourney.businessIdeaData.targetCustomers}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Team Composition</h4>
                              <p className="text-muted-foreground">{selectedJourney.businessIdeaData.teamComposition}</p>
                            </div>
                          </div>
                        </Card>
                      )}
                      
                      <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4">Journey Progress</h3>
                        <p className="text-muted-foreground mb-6">
                          Your personalized journey includes tasks and resources to help you take your business from idea to reality.
                        </p>
                        
                        {/* Journey tasks will be displayed here */}
                        <div className="opacity-70">
                          <p>Tasks and detailed progress tracking will be shown here.</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            This feature is being implemented to provide detailed tracking of your business journey.
                          </p>
                        </div>
                      </div>
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
    </div>
  );
};

export default JourneyPage;
