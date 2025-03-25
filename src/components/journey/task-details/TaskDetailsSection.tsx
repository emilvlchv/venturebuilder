
import React from 'react';
import { Task } from '../types';
import TaskProgressDisplay from './TaskProgressDisplay';
import TaskStatusSelector from './TaskStatusSelector';
import DeadlineSelector from './DeadlineSelector';
import { FileText, Link } from 'lucide-react';

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
      <p className="text-muted-foreground mb-6">{task.description || 'No description provided.'}</p>
      
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
      
      {task.resources && task.resources.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-base font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Resources
          </h3>
          <ul className="space-y-2">
            {task.resources.map((resource, index) => (
              <li key={index} className="flex items-start gap-2 p-2 rounded bg-muted/20">
                <Link className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsSection;
