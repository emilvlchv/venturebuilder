
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskStatusSelectorProps {
  status: 'completed' | 'in-progress' | 'pending';
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
  taskId?: string;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ 
  status, 
  onStatusChange,
  taskId = 'task' 
}) => {
  const statusDescriptions = {
    'pending': 'Task has not been started yet',
    'in-progress': 'Task is currently being worked on',
    'completed': 'Task has been successfully completed'
  };

  return (
    <div 
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-labelledby={`status-label-${taskId}`}
    >
      <span id={`status-label-${taskId}`} className="sr-only">Task Status</span>
      
      <Button
        type="button"
        variant={status === 'pending' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'pending' ? 'bg-muted/90 text-foreground hover:bg-muted/70 ring-2 ring-offset-2 ring-muted/90' : ''
        )}
        onClick={() => onStatusChange('pending')}
        aria-checked={status === 'pending'}
        role="radio"
        aria-describedby={`pending-description-${taskId}`}
      >
        <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" /> 
        <span>Not Started</span>
        <span id={`pending-description-${taskId}`} className="sr-only">{statusDescriptions.pending}</span>
      </Button>
      
      <Button
        type="button"
        variant={status === 'in-progress' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600 ring-2 ring-offset-2 ring-blue-500' : ''
        )}
        onClick={() => onStatusChange('in-progress')}
        aria-checked={status === 'in-progress'}
        role="radio"
        aria-describedby={`in-progress-description-${taskId}`}
      >
        <Clock className="h-4 w-4 mr-2" aria-hidden="true" /> 
        <span>In Progress</span>
        <span id={`in-progress-description-${taskId}`} className="sr-only">{statusDescriptions['in-progress']}</span>
      </Button>
      
      <Button
        type="button"
        variant={status === 'completed' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'completed' ? 'bg-green-500 hover:bg-green-600 ring-2 ring-offset-2 ring-green-500' : ''
        )}
        onClick={() => onStatusChange('completed')}
        aria-checked={status === 'completed'}
        role="radio"
        aria-describedby={`completed-description-${taskId}`}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" /> 
        <span>Completed</span>
        <span id={`completed-description-${taskId}`} className="sr-only">{statusDescriptions.completed}</span>
      </Button>
    </div>
  );
};

export default TaskStatusSelector;
