
import React from 'react';
import { Task } from '../types';
import TaskProgressDisplay from './TaskProgressDisplay';
import TaskStatusSelector from './TaskStatusSelector';
import DeadlineSelector from './DeadlineSelector';

interface TaskDetailsSectionProps {
  task: Task;
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
  onDeadlineChange: (date: Date | undefined) => void;
}

const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({
  task,
  onStatusChange,
  onDeadlineChange
}) => {
  // Convert deadline string to Date object if needed
  const getDeadlineDate = (deadline: Date | string | undefined): Date | undefined => {
    if (!deadline) return undefined;
    
    if (typeof deadline === 'string') {
      return new Date(deadline);
    }
    
    return deadline;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Task Details</h2>
      <p className="text-muted-foreground mb-6">{task.description}</p>
      
      <TaskProgressDisplay task={task} />
      
      <div className="mt-6">
        <TaskStatusSelector 
          status={task.status} 
          onStatusChange={onStatusChange}
          taskId={task.id}
        />
      </div>
      
      <div className="mt-6">
        <DeadlineSelector 
          deadline={getDeadlineDate(task.deadline)}
          onDeadlineChange={onDeadlineChange}
          taskId={task.id}
        />
      </div>
    </div>
  );
};

export default TaskDetailsSection;
