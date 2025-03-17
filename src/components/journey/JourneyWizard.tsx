
import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, User, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';
import ChatConversation from './ChatConversation';
import { useToast } from "@/hooks/use-toast";
import { BusinessIdeaData, Journey } from './types';
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
  
  // Function to handle completion of the initial chat
  const handleComplete = () => {
    console.log("handleComplete called");
    
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
          }
        }
        
        // If we have a journeyId, update the journey with the business data
        if (journeyId) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            const userId = user.id;
            if (userId) {
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
                  const tasksKey = `journey_tasks_${userId}_${journeyId}`;
                  if (!localStorage.getItem(tasksKey)) {
                    const defaultTasks = {
                      ideation: [
                        { id: 'task1', title: 'Research market', completed: false },
                        { id: 'task2', title: 'Define target audience', completed: false },
                        { id: 'task3', title: 'Analyze competitors', completed: false }
                      ],
                      planning: [
                        { id: 'task4', title: 'Create business plan', completed: false },
                        { id: 'task5', title: 'Define pricing model', completed: false }
                      ],
                      execution: [
                        { id: 'task6', title: 'Design MVP', completed: false },
                        { id: 'task7', title: 'Create branding', completed: false }
                      ]
                    };
                    localStorage.setItem(tasksKey, JSON.stringify(defaultTasks));
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving business idea:', error);
    }
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(businessData);
    }
  };

  useEffect(() => {
    // If we're on the complete step, call handleComplete
    if (currentStep === 'complete') {
      console.log("Current step is complete, calling handleComplete");
      handleComplete();
    }
  }, [currentStep]);

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
