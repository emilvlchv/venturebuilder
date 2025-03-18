import React from 'react';
import StepCard from './StepCard';
import { Task } from './types';

interface Step {
  id: string;
  title: string;
  description: string;
  status: string;
  resources: string[];
}

interface PhaseSectionProps {
  title: string;
  steps: Step[];
  getTasksByStepId: (stepId: string) => Task[];
  onOpenStepDetails?: (stepId: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  journeyId?: string;
}

const PhaseSection: React.FC<PhaseSectionProps> = ({ 
  title, 
  steps, 
  getTasksByStepId, 
  onOpenStepDetails,
  onOpenTaskDetails,
  journeyId
}) => {
  const checkActiveInProgressTasks = (stepId: string) => {
    const tasks = getTasksByStepId(stepId);
    return tasks.some(task => task.status === 'in-progress');
  };

  const checkAllTasksCompleted = (stepId: string) => {
    const tasks = getTasksByStepId(stepId);
    return tasks.length > 0 && tasks.every(task => task.status === 'completed');
  };
  
  // Calculate phase completion percentage
  const calculatePhaseCompletion = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    steps.forEach(step => {
      const stepTasks = getTasksByStepId(step.id);
      totalTasks += stepTasks.length;
      completedTasks += stepTasks.filter(task => task.status === 'completed').length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const phaseCompletion = calculatePhaseCompletion();

  return (
    <section aria-labelledby={`phase-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 
          id={`phase-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-2xl font-bold"
        >
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${phaseCompletion}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{phaseCompletion}% Complete</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map(step => (
          <StepCard
            key={step.id}
            id={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            relatedTasks={getTasksByStepId(step.id)}
            onOpenTaskDetails={onOpenTaskDetails}
            hasActiveTasks={checkActiveInProgressTasks(step.id)}
            allTasksCompleted={checkAllTasksCompleted(step.id)}
            journeyId={journeyId}
          />
        ))}
      </div>
    </section>
  );
};

export default PhaseSection;
