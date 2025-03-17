
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Send, User, ArrowRight, Info } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';
import ChatConversation from './ChatConversation';
import { useToast } from "@/hooks/use-toast";
import { BusinessIdeaData, Journey, JourneyTask } from './types';
import { useNavigate } from 'react-router-dom';

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
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Debug: Monitor step changes
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
    
    // Simulate AI generating the journey
    setTimeout(() => {
      console.log("Setting step to complete");
      setCurrentStep('complete');
      toast({
        title: "Journey Created",
        description: "Your personalized business journey is ready to view.",
      });
    }, 3000);
  };
  
  // Create default tasks for a journey
  const createDefaultTasks = (userId: string, journeyId: string) => {
    const tasksKey = `tasks_${userId}_${journeyId}`;
    
    // Convert to the expected format with categories for each task
    const formattedTasks = [
      {
        id: 'task1',
        title: 'Research Market and Validate Business Idea',
        description: 'Conduct thorough market research to validate your business concept.',
        status: 'pending',
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
          },
          {
            id: 'cat2',
            title: 'Validation Methods',
            subtasks: [
              { id: 'subtask4', title: 'Create customer surveys', completed: false },
              { id: 'subtask5', title: 'Conduct customer interviews', completed: false },
              { id: 'subtask6', title: 'Test concept with focus groups', completed: false }
            ],
            collapsed: false
          }
        ],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      },
      {
        id: 'task2',
        title: 'Develop Business Plan',
        description: 'Create a comprehensive business plan that outlines your strategy, operations, and financials.',
        status: 'pending',
        resources: [
          'Business plan templates',
          'Financial forecasting tools',
          'Industry benchmark data'
        ],
        categories: [
          {
            id: 'cat3',
            title: 'Strategic Planning',
            subtasks: [
              { id: 'subtask7', title: 'Define vision and mission', completed: false },
              { id: 'subtask8', title: 'Set goals and objectives', completed: false },
              { id: 'subtask9', title: 'Outline growth strategy', completed: false }
            ],
            collapsed: false
          },
          {
            id: 'cat4',
            title: 'Financial Projections',
            subtasks: [
              { id: 'subtask10', title: 'Create sales forecast', completed: false },
              { id: 'subtask11', title: 'Determine startup costs', completed: false },
              { id: 'subtask12', title: 'Project cash flow', completed: false }
            ],
            collapsed: false
          }
        ],
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
      },
      {
        id: 'task3',
        title: 'Create Branding and Marketing Strategy',
        description: 'Develop your brand identity and marketing approach to reach your target audience.',
        status: 'pending',
        resources: [
          'Brand identity guidelines',
          'Marketing channel comparison',
          'Content strategy templates'
        ],
        categories: [
          {
            id: 'cat5',
            title: 'Brand Development',
            subtasks: [
              { id: 'subtask13', title: 'Design logo and visual elements', completed: false },
              { id: 'subtask14', title: 'Create brand messaging', completed: false },
              { id: 'subtask15', title: 'Develop brand guidelines', completed: false }
            ],
            collapsed: false
          },
          {
            id: 'cat6',
            title: 'Marketing Channels',
            subtasks: [
              { id: 'subtask16', title: 'Identify primary marketing channels', completed: false },
              { id: 'subtask17', title: 'Create content calendar', completed: false },
              { id: 'subtask18', title: 'Set marketing budget', completed: false }
            ],
            collapsed: false
          }
        ],
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
      }
    ];
    
    localStorage.setItem(tasksKey, JSON.stringify(formattedTasks));
    return formattedTasks;
  };
  
  // Function to handle completion of the initial chat
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
      // Store in local storage for demo purposes
      if (businessData.businessIdea) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user.id;
          if (userId) {
            // Update user's business idea and other data
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex((u: any) => u.id === userId);
            if (userIndex !== -1) {
              users[userIndex].businessIdea = businessData.businessIdea;
              users[userIndex].businessData = businessData;
              localStorage.setItem('users', JSON.stringify(users));
              
              // Update current user
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
              currentUser.businessIdea = businessData.businessIdea;
              currentUser.businessData = businessData;
              localStorage.setItem('user', JSON.stringify(currentUser));
            }
            
            // Update the journey with the business data
            const journeysKey = `journeys_${userId}`;
            const journeysData = localStorage.getItem(journeysKey);
            if (journeysData) {
              const journeys = JSON.parse(journeysData);
              const journeyIndex = journeys.findIndex((j: any) => j.id === journeyId);
              if (journeyIndex !== -1) {
                journeys[journeyIndex].businessIdeaData = businessData;
                journeys[journeyIndex].progress = 15; // Update progress
                journeys[journeyIndex].updatedAt = new Date().toISOString();
                localStorage.setItem(journeysKey, JSON.stringify(journeys));
                
                // Create default tasks for this journey
                createDefaultTasks(userId, journeyId);
                
                // Navigate to journey details page with proper formatting
                const journeyDetailsPath = `/journey-details/${journeyId}`;
                console.log("Navigating to:", journeyDetailsPath);
                
                // Use setTimeout to ensure state updates have processed
                setTimeout(() => {
                  navigate(journeyDetailsPath);
                }, 100);
                
                // Call the onComplete callback if provided
                if (onComplete) {
                  onComplete(businessData);
                }
                
                return; // Exit after successful completion
              } else {
                console.error("Journey not found with ID:", journeyId);
              }
            } else {
              console.error("No journeys data found for user");
            }
          }
        }
      }
      
      // If we reached here, something went wrong
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
    // If we're on the complete step, call handleComplete
    if (currentStep === 'complete') {
      console.log("Current step is complete, calling handleComplete");
      handleComplete();
    }
  }, [currentStep, journeyId]); // Added journeyId to dependencies

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
              <div className="text-sm text-muted-foreground ml-2">Analyzing your business idea and generating your personalized journey with detailed tasks...</div>
            </div>
          </div>
        );
        
      case 'complete':
        console.log("Rendering complete step content with View My Journey button");
        return (
          <div className="space-y-6">
            {renderAssistantMessage("I've analyzed your business idea and created a personalized entrepreneurial journey for you! Your roadmap now includes detailed tasks organized into categories with deadlines and progress tracking to help you stay on track.")}
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
