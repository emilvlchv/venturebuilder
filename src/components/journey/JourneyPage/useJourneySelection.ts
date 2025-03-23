
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Journey } from '@/components/journey/types';

export const useJourneySelection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  return {
    selectedJourneyId,
    selectedJourney,
    hasCompletedInitialChat,
    isDialogOpen,
    selectedStep,
    handleJourneySelect,
    handleJourneyComplete,
    handleCloseDialog
  };
};
