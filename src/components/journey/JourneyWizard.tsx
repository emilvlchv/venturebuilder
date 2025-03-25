
import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import ChatConversation from './ChatConversation';
import { useToast } from "@/hooks/use-toast";
import { BusinessIdeaData, Journey, Task } from './types';
import { useNavigate } from 'react-router-dom';
import { generateAITasks } from '@/utils/aiTaskGenerator';
import { v4 as uuidv4 } from 'uuid';

type Step = 'welcome' | 'chat' | 'generating' | 'complete';

interface JourneyWizardProps {
  onComplete?: (data: BusinessIdeaData) => void;
  journeyId?: string;
}

const JourneyWizard: React.FC<JourneyWizardProps> = ({ onComplete, journeyId }) => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [businessData, setBusinessData] = useState<BusinessIdeaData>({
    businessIdea: '',
    teamComposition: '',
    teamStrengths: '',
    teamWeaknesses: '',
    targetCustomers: '',
    revenueModel: '',
    industry: '',
    problem: '',
    stage: '',
    solution: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Current step changed to:", currentStep);
  }, [currentStep]);
  
  const handleStartChat = () => {
    console.log("Starting chat...");
    setCurrentStep('chat');
  };
  
  const handleChatComplete = (data: BusinessIdeaData) => {
    console.log("Chat completed with data:", data);
    setBusinessData(data);
    setCurrentStep('generating');
    
    setTimeout(() => {
      console.log("Setting step to complete");
      setCurrentStep('complete');
      toast({
        title: "Journey Created",
        description: "Your personalized business journey with AI-generated tasks is ready to view.",
      });
    }, 2000);
  };
  
  const createDefaultTasks = (userId: string, journeyId: string) => {
    const tasksKey = `tasks_${userId}_${journeyId}`;
    
    // Generate AI tasks based on the user's business data
    let formattedTasks: Task[] = [];
    
    if (businessData.businessIdea) {
      // Generate personalized AI tasks
      const aiTasks = generateAITasks(businessData);
      console.log("Generated AI tasks:", aiTasks);
      
      if (aiTasks && aiTasks.length > 0) {
        formattedTasks = [...aiTasks];
      } else {
        // Fallback to standard tasks if AI tasks couldn't be generated
        console.log("Using standard tasks as fallback");
        formattedTasks = getStandardTasks();
      }
    } else {
      formattedTasks = getStandardTasks();
    }
    
    // Save tasks to localStorage
    localStorage.setItem(tasksKey, JSON.stringify(formattedTasks));
    return formattedTasks;
  };
  
  const getStandardTasks = (): Task[] => {
    // Standard fallback tasks if AI generation fails
    return [
      {
        id: 'task1',
        title: 'Research Market and Validate Business Idea',
        description: 'Conduct thorough market research to validate your business concept.',
        status: 'pending',
        stepId: 'market-research',
        resources: [
          'Use online surveys to gather customer feedback',
          'Analyze industry reports for market trends',
          'Conduct interviews with potential customers'
        ],
        categories: [
          {
            id: 'cat1',
            title: 'Market Research',
            subtasks: [
              { id: 'subtask1', title: 'Define your target market', completed: false },
              { id: 'subtask2', title: 'Research competitors', completed: false },
              { id: 'subtask3', title: 'Identify market gaps', completed: false }
            ],
            collapsed: false
          }
        ],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      }
    ];
  };
  
  const initializeJourneyData = (userId: string, journeyId: string) => {
    // Check if journey data already exists
    const journeysKey = `journeys_${userId}`;
    let journeys = [];
    
    try {
      const existingJourneys = localStorage.getItem(journeysKey);
      journeys = existingJourneys ? JSON.parse(existingJourneys) : [];
    } catch (error) {
      console.error("Error parsing journeys:", error);
      journeys = [];
    }
    
    // Check if this journey exists
    const journeyExists = journeys.some((j: Journey) => j.id === journeyId);
    
    if (!journeyExists) {
      // Create a new journey entry
      const newJourney = {
        id: journeyId,
        title: "Your Entrepreneurial Journey",
        description: "A personalized roadmap to help you turn your business idea into reality.",
        businessIdeaData: null,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      journeys.push(newJourney);
      localStorage.setItem(journeysKey, JSON.stringify(journeys));
    }
  };
  
  const handleComplete = () => {
    console.log("handleComplete called with journeyId:", journeyId);
    
    if (!journeyId) {
      console.error("No journeyId provided");
      toast({
        title: "Error",
        description: "Could not complete journey. Missing journey ID.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (businessData.businessIdea) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user.id;
          
          if (userId) {
            // Initialize journey data structure if it doesn't exist
            initializeJourneyData(userId, journeyId);
            
            // Update the user's business data
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex((u: any) => u.id === userId);
            if (userIndex !== -1) {
              // Store business data in user profile
              users[userIndex].businessIdea = businessData.businessIdea;
              users[userIndex].businessData = {
                solution: businessData.businessIdea,
                targetMarket: businessData.targetCustomers,
                stage: businessData.teamComposition,
                industry: businessData.teamStrengths,
                problem: businessData.teamWeaknesses,
                revenueModel: businessData.revenueModel,
              };
              localStorage.setItem('users', JSON.stringify(users));
              
              // Update current user session data
              user.businessIdea = businessData.businessIdea;
              user.businessData = {
                solution: businessData.businessIdea,
                targetMarket: businessData.targetCustomers,
                stage: businessData.teamComposition,
                industry: businessData.teamStrengths,
                problem: businessData.teamWeaknesses,
                revenueModel: businessData.revenueModel,
              };
              localStorage.setItem('user', JSON.stringify(user));
            }
            
            // Update journey with business data
            const journeysKey = `journeys_${userId}`;
            const journeysData = localStorage.getItem(journeysKey);
            if (journeysData) {
              const journeys = JSON.parse(journeysData);
              const journeyIndex = journeys.findIndex((j: any) => j.id === journeyId);
              
              if (journeyIndex !== -1) {
                journeys[journeyIndex].businessIdeaData = businessData;
                journeys[journeyIndex].progress = 15;
                journeys[journeyIndex].updatedAt = new Date().toISOString();
                localStorage.setItem(journeysKey, JSON.stringify(journeys));
                
                // Create AI-generated tasks
                createDefaultTasks(userId, journeyId);
                
                setTimeout(() => {
                  navigate(`/journey-details/${journeyId}`);
                }, 100);
                
                if (onComplete) {
                  onComplete(businessData);
                }
                return;
              } else {
                // Journey not found, create a new one
                const newJourney = {
                  id: journeyId,
                  title: "Your Entrepreneurial Journey",
                  description: "A personalized roadmap to help you turn your business idea into reality.",
                  businessIdeaData: businessData,
                  progress: 15,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                
                journeys.push(newJourney);
                localStorage.setItem(journeysKey, JSON.stringify(journeys));
                
                // Create AI-generated tasks
                createDefaultTasks(userId, journeyId);
                
                setTimeout(() => {
                  navigate(`/journey-details/${journeyId}`);
                }, 100);
                
                if (onComplete) {
                  onComplete(businessData);
                }
                return;
              }
            } else {
              // No journeys data found, create initial journeys array
              const newJourneys = [{
                id: journeyId,
                title: "Your Entrepreneurial Journey",
                description: "A personalized roadmap to help you turn your business idea into reality.",
                businessIdeaData: businessData,
                progress: 15,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }];
              
              localStorage.setItem(journeysKey, JSON.stringify(newJourneys));
              
              // Create AI-generated tasks
              createDefaultTasks(userId, journeyId);
              
              setTimeout(() => {
                navigate(`/journey-details/${journeyId}`);
              }, 100);
              
              if (onComplete) {
                onComplete(businessData);
              }
              return;
            }
          }
        }
      }
      
      console.error("Failed to update journey data");
      toast({
        title: "Error",
        description: "An error occurred while saving your journey data.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error saving business idea:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving your journey data.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (currentStep === 'complete') {
      console.log("Current step is complete, calling handleComplete");
      handleComplete();
    }
  }, [currentStep, journeyId]);

  const renderAssistantMessage = (message: string) => {
    return (
      <div className="flex items-start space-x-3 max-w-3xl animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
          AI
        </div>
        <div className="glass p-4 rounded-xl rounded-tl-none">
          <p className="text-foreground">{message}</p>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    console.log("Rendering step:", currentStep);
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="space-y-6">
            {renderAssistantMessage("Hi there! I'm your personal business guide. I'll help you create a tailored journey to bring your business idea to life. Ready to begin?")}
            <div className="ml-11">
              <Button 
                onClick={handleStartChat} 
                icon={<ChevronRight size={16} />} 
                iconPosition="right"
              >
                Let's Get Started
              </Button>
            </div>
          </div>
        );
      
      case 'chat':
        return <ChatConversation onComplete={handleChatComplete} />;
        
      case 'generating':
        return (
          <div className="space-y-6">
            <div className="ml-11 animate-pulse flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <div className="w-3 h-3 rounded-full bg-primary delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-primary delay-150"></div>
              <div className="text-sm text-muted-foreground ml-2">Creating your personalized journey...</div>
            </div>
          </div>
        );
        
      case 'complete':
        console.log("Rendering complete step content with View My Journey button");
        return (
          <div className="space-y-6">
            {renderAssistantMessage("I've created a personalized entrepreneurial journey for you! Your roadmap now includes tasks customized to your business idea.")}
            <div className="ml-11">
              <Button 
                onClick={handleComplete}
                variant="primary"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                View My Journey
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="space-y-10">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default JourneyWizard;
