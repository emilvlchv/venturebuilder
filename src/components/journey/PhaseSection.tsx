
import React from 'react';
import StepCard from './StepCard';
import { Task } from './TaskCard';

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

  return (
    <section aria-labelledby={`phase-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2 
        id={`phase-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="text-2xl font-bold mb-6"
      >
        {title}
      </h2>
      
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
