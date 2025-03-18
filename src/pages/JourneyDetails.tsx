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

  // Initialize local tasks with tasks from the hook
  useEffect(() => {
    setLocalTasks(initialTasks);
  }, [initialTasks]);

  // Adapt businessData to match BusinessIdeaData interface
  const adaptedBusinessData: BusinessIdeaData = businessData ? {
    businessIdea: businessData.solution || '',
    targetCustomers: businessData.targetMarket || '',
    teamComposition: businessData.stage || '',
    teamStrengths: businessData.industry || '',
    teamWeaknesses: businessData.problem || '',
    revenueModel: ''
  } : null;

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

  // Update getTasksByStepId to use localTasks
  const getLocalTasksByStepId = (stepId: string) => {
    return localTasks.filter(task => task.stepId === stepId);
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
          onStatusChange={(status) => {
            handleTaskStatusChange(status);
            // Update the local task state as well
            if (selectedTask) {
              const updatedTasks = localTasks.map(task => 
                task.id === selectedTask.id ? {...task, status} : task
              );
              setLocalTasks(updatedTasks);
            }
          }}
          onSubtaskToggle={(categoryId, subtaskId, completed) => {
            handleSubtaskToggle(categoryId, subtaskId, completed);
            // Update local tasks
            if (selectedTask) {
              const updatedTasks = localTasks.map(task => {
                if (task.id === selectedTask.id) {
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
          }}
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
