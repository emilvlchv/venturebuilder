import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import TaskDetailSheet from '@/components/journey/TaskDetailSheet';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneyProgress from '@/components/journey/JourneyProgress';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import { BusinessIdeaData, Task } from '@/components/journey/types';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';

const JourneyDetails = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  const {
    journey,
    businessData,
    activeTab,
    setActiveTab,
    isTaskDetailOpen,
    tasks: initialTasks,
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

  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      console.log("Setting local tasks from initialTasks:", initialTasks);
      setLocalTasks(initialTasks);
    }
  }, [initialTasks]);

  const adaptedBusinessData: BusinessIdeaData = businessData ? {
    businessIdea: businessData.solution || businessData.businessIdea || '',
    targetCustomers: businessData.targetMarket || businessData.targetCustomers || '',
    teamComposition: businessData.stage || businessData.teamComposition || '',
    teamStrengths: businessData.industry || businessData.teamStrengths || '',
    teamWeaknesses: businessData.problem || businessData.teamWeaknesses || '',
    revenueModel: businessData.revenueModel || '',
    industry: businessData.industry || '',
    stage: businessData.stage || '',
    problem: businessData.problem || '',
    solution: businessData.solution || ''
  } : null;

  const businessIdeaText = adaptedBusinessData?.businessIdea || 
                          adaptedBusinessData?.solution || 
                          'your business';

  useEffect(() => {
    document.title = journey?.title 
      ? `${journey.title} | Your Entrepreneurial Journey` 
      : 'Your Entrepreneurial Journey';
      
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTaskDetailOpen) {
          handleCloseTaskDetail();
          e.preventDefault();
        }
      }
      
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

  const enhancedJourneyPhases = journeyPhases.map(phase => ({
    ...phase,
    steps: phase.steps.map(step => ({
      ...step,
      resources: step.resources || []
    }))
  }));

  const getLocalTasksByStepId = (stepId: string) => {
    return localTasks.filter(task => task.stepId === stepId);
  };

  const handleLocalTaskStatusChange = (task: Task, status: 'completed' | 'in-progress' | 'pending') => {
    if (selectedTask) {
      handleTaskStatusChange(selectedTask, status);
      const updatedTasks = localTasks.map(t => 
        t.id === selectedTask.id ? {...t, status} : t
      );
      setLocalTasks(updatedTasks);
    }
  };

  const handleLocalSubtaskToggle = (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => {
    if (selectedTask) {
      handleSubtaskToggle(taskId, categoryId, subtaskId, completed);
      const updatedTasks = localTasks.map(task => {
        if (task.id === taskId) {
          const updatedCategories = task.categories.map(category => {
            if (category.id === categoryId) {
              const updatedSubtasks = category.subtasks.map(subtask => 
                subtask.id === subtaskId ? {...subtask, completed} : subtask
              );
              return {...category, subtasks: updatedSubtasks};
            }
            return category;
          });
          return {...task, categories: updatedCategories};
        }
        return task;
      });
      setLocalTasks(updatedTasks);
    }
  };

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

              <JourneyProgress
                phases={enhancedJourneyPhases}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getTasksByStepId={getLocalTasksByStepId}
                onOpenTaskDetails={handleOpenTaskDetails}
                journeyId={journeyId}
                businessIdea={businessIdeaText}
              />
              
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
          onStatusChange={handleLocalTaskStatusChange}
          onSubtaskToggle={handleLocalSubtaskToggle}
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
