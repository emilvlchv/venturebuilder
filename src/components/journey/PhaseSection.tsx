
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

interface PhaseProps {
  title: string;
  steps: Step[];
  getTasksByStepId: (stepId: string) => Task[];
  onOpenStepDetails: (stepId: string) => void;
  onOpenTaskDetails: (task: Task) => void;
}

const PhaseSection: React.FC<PhaseProps> = ({
  title,
  steps,
  getTasksByStepId,
  onOpenStepDetails,
  onOpenTaskDetails
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map(step => {
          const relatedTasks = getTasksByStepId(step.id);
          const hasActiveTasks = relatedTasks.some(task => task.status === 'in-progress');
          const allTasksCompleted = relatedTasks.length > 0 && relatedTasks.every(task => task.status === 'completed');
          
          return (
            <StepCard
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              onViewDetails={onOpenStepDetails}
              relatedTasks={relatedTasks}
              onOpenTaskDetails={onOpenTaskDetails}
              hasActiveTasks={hasActiveTasks}
              allTasksCompleted={allTasksCompleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PhaseSection;
