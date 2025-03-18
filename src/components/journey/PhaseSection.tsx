
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, ArrowRight } from 'lucide-react';
import StepCard from './StepCard';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';
import { Task } from './types';

interface PhaseSectionProps {
  title: string;
  steps: {
    id: string;
    title: string;
    description: string;
    status: string;
    hasActiveTasks?: boolean;
    allTasksCompleted?: boolean;
    resources?: string[];
  }[];
  getTasksByStepId: (stepId: string) => Task[];
  onOpenTaskDetails: (task: Task) => void;
  journeyId?: string;
  businessIdea?: string;
}

const PhaseSection: React.FC<PhaseSectionProps> = ({
  title,
  steps,
  getTasksByStepId,
  onOpenTaskDetails,
  journeyId,
  businessIdea
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const navigateToStepDetails = (stepId: string) => {
    if (journeyId) {
      navigate(`/journey-details/${journeyId}/step/${stepId}`);
    }
  };

  return (
    <div className="phase-section">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps[step.id] || false;
          const stepTasks = getTasksByStepId(step.id);
          
          return (
            <div key={step.id} className="space-y-4">
              <StepCard
                title={step.title}
                description={step.description}
                status={step.status}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleStep(step.id)}
                onViewDetails={() => navigateToStepDetails(step.id)}
                resourceCount={step.resources?.length || 0}
                hasActiveTasks={step.hasActiveTasks}
                allTasksCompleted={step.allTasksCompleted}
              />
              
              {isExpanded && (
                <div className="pl-8 space-y-4 animate-accordion-down">
                  {stepTasks.length > 0 ? (
                    <div className="space-y-6">
                      {stepTasks.map((task, taskIndex) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={taskIndex}
                          onOpenDetails={() => onOpenTaskDetails(task)}
                          onTaskStatusChange={() => {}} // These are handled at a higher level
                          onSubtaskToggle={() => {}}
                          onCategoryToggle={() => {}}
                          onDeadlineChange={() => {}}
                          onViewStep={navigateToStepDetails}
                          businessIdea={businessIdea}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                      <p className="text-muted-foreground mb-4">No tasks found for this step</p>
                      <Button 
                        onClick={() => navigateToStepDetails(step.id)}
                        className="mx-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => navigateToStepDetails(step.id)}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      View Step Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseSection;
