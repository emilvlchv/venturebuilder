
import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, User, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import ChatConversation from './ChatConversation';
import { useToast } from "@/hooks/use-toast";

type Step = 'welcome' | 'chat' | 'generating' | 'complete';

// Define the structure for storing conversation data
export interface BusinessIdeaData {
  businessIdea: string;
  teamComposition: string;
  teamStrengths: string;
  teamWeaknesses: string;
  targetCustomers: string;
  additionalInfo?: string;
}

interface JourneyWizardProps {
  onComplete?: () => void;
}

const JourneyWizard: React.FC<JourneyWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [businessData, setBusinessData] = useState<BusinessIdeaData>({
    businessIdea: '',
    teamComposition: '',
    teamStrengths: '',
    teamWeaknesses: '',
    targetCustomers: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    // Save business idea to user profile if available
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
      }
    } catch (error) {
      console.error('Error saving business idea:', error);
    }
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    // If we're on the complete step, call handleComplete
    if (currentStep === 'complete') {
      console.log("Current step is complete, calling handleComplete");
      handleComplete();
    }
  }, [currentStep]);

  const handleViewJourney = () => {
    console.log("Navigating to journey-details page");
    navigate('/journey-details');
  };

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
            {renderAssistantMessage("Hi there! I'm your personal business guide. I'll help you create a tailored journey to bring your business idea to life. I'll ask you a series of questions to understand your business better. Ready to begin?")}
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
              <div className="text-sm text-muted-foreground ml-2">Analyzing your business idea and generating your personalized journey...</div>
            </div>
          </div>
        );
        
      case 'complete':
        console.log("Rendering complete step content with View My Journey button");
        return (
          <div className="space-y-6">
            {renderAssistantMessage("I've analyzed your business idea and created a personalized entrepreneurial journey for you! Click below to view your roadmap and begin your journey.")}
            <div className="ml-11">
              <button 
                onClick={handleViewJourney}
                className="inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 button-hover px-4 py-2 text-base bg-primary text-primary-foreground shadow hover:bg-primary/90"
              >
                View My Journey
                <span className="ml-2"><ArrowRight size={16} /></span>
              </button>
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
      
      {/* For testing and debugging only - uncomment to use */}
      <div className="mt-4 p-2 bg-orange-100 text-orange-800 rounded-md text-xs">
        <p>Debug Controls (Remove in production)</p>
        <div className="flex gap-2 mt-1">
          <button 
            onClick={() => setCurrentStep('complete')}
            className="px-2 py-1 bg-orange-500 text-white rounded-md text-xs"
          >
            Force Complete Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyWizard;
