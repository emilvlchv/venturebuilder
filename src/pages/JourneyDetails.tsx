
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import TaskDetailSheet from '@/components/journey/TaskDetailSheet';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneyProgress from '@/components/journey/JourneyProgress';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { BusinessIdeaData, JourneyTask } from '@/components/journey/types';

// Helper function to format business data for AI processing
const formatBusinessDataForAI = (businessData: BusinessIdeaData) => {
  return `
Business Idea: ${businessData?.businessIdea || 'Not specified'}
Target Customers: ${businessData?.targetCustomers || 'Not specified'}
Team Composition: ${businessData?.teamComposition || 'Not specified'}
Team Strengths: ${businessData?.teamStrengths || 'Not specified'}
Team Weaknesses: ${businessData?.teamWeaknesses || 'Not specified'}
Revenue Model: ${businessData?.revenueModel || 'Not specified'}
  `.trim();
};

// Function to generate personalized tasks using AI (mock implementation)
const generatePersonalizedTasks = async (businessData: BusinessIdeaData): Promise<JourneyTask[]> => {
  // In a real implementation, this would call an AI API with the formatted business data
  // For now, we'll return mock tasks based on the business data
  console.log("Generating personalized tasks for:", formatBusinessDataForAI(businessData));
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockTasks: JourneyTask[] = [
    {
      id: `ai-task-${Date.now()}-1`,
      title: `Validate "${businessData?.businessIdea?.substring(0, 30)}..." with Target Customers`,
      description: `Create a validation strategy specifically for ${businessData?.targetCustomers || 'your target customers'} to ensure your business idea resonates with them.`,
      status: 'pending',
      stepId: 'market-research',
      resources: ['Customer Interview Template', 'Validation Framework'],
      categories: [
        {
          id: `ai-cat-${Date.now()}-1`,
          title: 'Validation Strategy',
          subtasks: [
            { id: `ai-subtask-${Date.now()}-1`, title: 'Create customer interview questions', completed: false },
            { id: `ai-subtask-${Date.now()}-2`, title: 'Identify 5-10 potential customers to interview', completed: false },
            { id: `ai-subtask-${Date.now()}-3`, title: 'Schedule and conduct interviews', completed: false },
            { id: `ai-subtask-${Date.now()}-4`, title: 'Analyze feedback and identify patterns', completed: false }
          ]
        }
      ]
    },
    {
      id: `ai-task-${Date.now()}-2`,
      title: `Leverage Team Strengths in ${businessData?.teamStrengths?.substring(0, 20) || 'Your Area'}`,
      description: `Create a strategy to maximize your team's strengths: "${businessData?.teamStrengths || 'your unique abilities'}" while addressing weaknesses in "${businessData?.teamWeaknesses || 'areas of improvement'}"`,
      status: 'pending',
      stepId: 'idea-validation',
      resources: ['Team Assessment Template', 'Skill Gap Analysis Framework'],
      categories: [
        {
          id: `ai-cat-${Date.now()}-2`,
          title: 'Team Optimization',
          subtasks: [
            { id: `ai-subtask-${Date.now()}-5`, title: 'Document team strengths and assign roles accordingly', completed: false },
            { id: `ai-subtask-${Date.now()}-6`, title: 'Identify skill gaps and create development plan', completed: false },
            { id: `ai-subtask-${Date.now()}-7`, title: 'Establish communication protocols based on team dynamics', completed: false }
          ]
        }
      ]
    }
  ];
  
  return mockTasks;
};

const JourneyDetails = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
  const {
    journey,
    businessData,
    activeTab,
    setActiveTab,
    isTaskDetailOpen,
    tasks,
    setTasks,
    selectedTask,
    handleTaskStatusChange,
    handleSubtaskToggle,
    handleCategoryToggle,
    handleDeadlineChange,
    handleOpenTaskDetails,
    handleAddSubtask,
    handleRemoveSubtask,
    getTasksByStepId,
    handleCloseTaskDetail,
    journeyPhases
  } = useJourneyDetails();

  // Adapt businessData to match BusinessIdeaData interface
  const adaptedBusinessData: BusinessIdeaData = businessData ? {
    businessIdea: businessData.solution || '',
    targetCustomers: businessData.targetMarket || '',
    teamComposition: businessData.stage || '',
    teamStrengths: businessData.industry || '',
    teamWeaknesses: businessData.problem || '',
  } : null;

  // Function to handle generating personalized tasks
  const handleGeneratePersonalizedTasks = async () => {
    if (!adaptedBusinessData) {
      toast({
        title: "Missing business information",
        description: "Please complete your business profile to generate personalized tasks.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGeneratingTasks(true);
      const personalizedTasks = await generatePersonalizedTasks(adaptedBusinessData);
      
      // Add the new tasks to the existing tasks
      setTasks(prev => [...prev, ...personalizedTasks]);
      
      toast({
        title: "Personalized tasks generated",
        description: `${personalizedTasks.length} new tasks have been created based on your business profile.`,
      });
    } catch (error) {
      console.error("Error generating personalized tasks:", error);
      toast({
        title: "Error generating tasks",
        description: "An error occurred while generating personalized tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  // Set page title for screen readers
  useEffect(() => {
    document.title = journey?.title 
      ? `${journey.title} | Your Entrepreneurial Journey` 
      : 'Your Entrepreneurial Journey';
      
    // Announce page load to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('class', 'sr-only');
    announcer.textContent = `${journey?.title || 'Your journey'} page loaded successfully`;
    document.body.appendChild(announcer);
    
    return () => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    };
  }, [journey?.title]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Escape key to close dialogs
      if (e.key === 'Escape') {
        if (isTaskDetailOpen) {
          handleCloseTaskDetail();
          e.preventDefault();
        }
      }
      
      // Alt+1-4 for switching tabs
      if (e.altKey && !isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= journeyPhases.length) {
        const index = parseInt(e.key) - 1;
        if (journeyPhases[index]) {
          setActiveTab(journeyPhases[index].id);
          toast({
            title: "Tab changed",
            description: `Switched to ${journeyPhases[index].title} tab`,
          });
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskDetailOpen, handleCloseTaskDetail, journeyPhases, setActiveTab, toast]);

  // Add resources property to journeyPhases steps to match JourneyPhase type
  const enhancedJourneyPhases = journeyPhases.map(phase => ({
    ...phase,
    steps: phase.steps.map(step => ({
      ...step,
      resources: step.resources || []
    }))
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24" id="main-content">
        <div className="container-padding">
          <SubscriptionCheck>
            <div className="max-w-5xl mx-auto">
              <div aria-live="polite">
                <JourneyHeader
                  title={journey?.title || 'Your Entrepreneurial Journey'}
                  description={journey?.description || 'Follow this personalized roadmap to turn your business idea into reality. Each phase contains actionable steps and resources to help you succeed.'}
                  businessData={adaptedBusinessData}
                />
              </div>

              {/* AI Task Generation Button */}
              <div className="mb-8 flex justify-end">
                <Button 
                  onClick={handleGeneratePersonalizedTasks} 
                  className="gap-2"
                  disabled={isGeneratingTasks || !adaptedBusinessData}
                  aria-label="Generate personalized tasks based on your business profile"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingTasks ? "Generating..." : "Generate Personalized Tasks"}
                </Button>
              </div>

              <JourneyProgress
                phases={enhancedJourneyPhases}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getTasksByStepId={getTasksByStepId}
                onOpenTaskDetails={handleOpenTaskDetails}
                journeyId={journeyId}
              />
              
              {/* Keyboard shortcuts help */}
              <div className="mt-8 p-4 bg-muted/20 rounded-lg text-sm">
                <h2 className="font-medium mb-2">Keyboard Shortcuts</h2>
                <ul className="space-y-1 text-muted-foreground">
                  <li><kbd className="px-2 py-1 bg-background rounded border">Alt + 1-4</kbd> Switch between journey phases</li>
                  <li><kbd className="px-2 py-1 bg-background rounded border">Esc</kbd> Close any open dialog or panel</li>
                  <li><kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> Navigate through interactive elements</li>
                </ul>
              </div>
            </div>
          </SubscriptionCheck>
        </div>
      </main>
      
      <Footer />
      
      {selectedTask && (
        <TaskDetailSheet
          isOpen={isTaskDetailOpen}
          onClose={handleCloseTaskDetail}
          task={selectedTask}
          onStatusChange={handleTaskStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
          onCategoryToggle={handleCategoryToggle}
          onDeadlineChange={handleDeadlineChange}
          onAddSubtask={handleAddSubtask}
          onRemoveSubtask={handleRemoveSubtask}
        />
      )}
    </div>
  );
};

export default JourneyDetails;
