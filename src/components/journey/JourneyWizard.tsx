
import React, { useState } from 'react';
import { ChevronRight, Send, User, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';

type Step = 'welcome' | 'idea' | 'strengths' | 'focus' | 'generating' | 'complete';

const JourneyWizard = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [businessIdea, setBusinessIdea] = useState('');
  const [strengths, setStrengths] = useState('');
  const [focus, setFocus] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleNextStep = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('idea');
        break;
      case 'idea':
        if (businessIdea.trim()) setCurrentStep('strengths');
        break;
      case 'strengths':
        if (strengths.trim()) setCurrentStep('focus');
        break;
      case 'focus':
        if (focus.trim()) {
          setCurrentStep('generating');
          // Simulate AI generating the journey
          setTimeout(() => {
            setCurrentStep('complete');
          }, 3000);
        }
        break;
      default:
        break;
    }
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
  
  const renderUserMessage = (message: string) => {
    return (
      <div className="flex items-start space-x-3 max-w-3xl ml-auto animate-fade-in">
        <div className="bg-primary/10 p-4 rounded-xl rounded-tr-none">
          <p className="text-foreground">{message}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
          <User size={16} />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="space-y-6">
            {renderAssistantMessage("Hi there! I'm your personal business guide. I'll help you create a tailored journey to bring your business idea to life. Ready to begin?")}
            <div className="ml-11">
              <Button 
                onClick={handleNextStep} 
                icon={<ChevronRight size={16} />} 
                iconPosition="right"
              >
                Let's Get Started
              </Button>
            </div>
          </div>
        );
      
      case 'idea':
        return (
          <div className="space-y-6">
            {renderAssistantMessage("What's your business idea? Don't worry if it's not fully formed yet - just share what you have in mind so far.")}
            <div className="ml-11">
              <div className="relative">
                <textarea
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="My business idea is..."
                  className="w-full p-3 pr-12 min-h-[120px] rounded-xl border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
                <button
                  onClick={handleNextStep}
                  disabled={!businessIdea.trim()}
                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            {businessIdea && (
              <div>{renderUserMessage(businessIdea)}</div>
            )}
          </div>
        );
        
      case 'strengths':
        return (
          <div className="space-y-6">
            {renderUserMessage(businessIdea)}
            {renderAssistantMessage("Thanks for sharing your idea! What would you say are your strengths and weaknesses as an entrepreneur? This helps me create a journey that leverages your strengths and helps you develop in areas where you might need support.")}
            <div className="ml-11">
              <div className="relative">
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="My strengths and weaknesses are..."
                  className="w-full p-3 pr-12 min-h-[120px] rounded-xl border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
                <button
                  onClick={handleNextStep}
                  disabled={!strengths.trim()}
                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            {strengths && (
              <div>{renderUserMessage(strengths)}</div>
            )}
          </div>
        );
        
      case 'focus':
        return (
          <div className="space-y-6">
            {renderUserMessage(businessIdea)}
            {renderUserMessage(strengths)}
            {renderAssistantMessage("Great insights! Is there anything specific you'd like to focus on in your entrepreneurial journey? For example: marketing, product development, funding, or building a team?")}
            <div className="ml-11">
              <div className="relative">
                <textarea
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="I'd like to focus on..."
                  className="w-full p-3 pr-12 min-h-[120px] rounded-xl border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
                <button
                  onClick={handleNextStep}
                  disabled={!focus.trim()}
                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            {focus && (
              <div>{renderUserMessage(focus)}</div>
            )}
          </div>
        );
        
      case 'generating':
        return (
          <div className="space-y-6">
            {renderUserMessage(businessIdea)}
            {renderUserMessage(strengths)}
            {renderUserMessage(focus)}
            <div className="ml-11 animate-pulse flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <div className="w-3 h-3 rounded-full bg-primary delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-primary delay-150"></div>
              <div className="text-sm text-muted-foreground ml-2">Generating your personalized journey...</div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-6">
            {renderUserMessage(businessIdea)}
            {renderUserMessage(strengths)}
            {renderUserMessage(focus)}
            {renderAssistantMessage("I've created your personalized entrepreneurial journey! It focuses on your specific business idea and leverages your unique strengths. Click below to view your roadmap and begin your journey.")}
            <div className="ml-11">
              <Button 
                onClick={() => window.location.href = '/journey/roadmap'} 
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
