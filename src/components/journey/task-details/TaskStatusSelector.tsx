
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskStatusSelectorProps {
  status: 'completed' | 'in-progress' | 'pending';
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ status, onStatusChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant={status === 'pending' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'pending' ? 'bg-muted/90 text-foreground hover:bg-muted/70' : ''
        )}
        onClick={() => onStatusChange('pending')}
      >
        <AlertCircle className="h-4 w-4 mr-2" /> Not Started
      </Button>
      <Button
        type="button"
        variant={status === 'in-progress' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' : ''
        )}
        onClick={() => onStatusChange('in-progress')}
      >
        <Clock className="h-4 w-4 mr-2" /> In Progress
      </Button>
      <Button
        type="button"
        variant={status === 'completed' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          "flex items-center",
          status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''
        )}
        onClick={() => onStatusChange('completed')}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" /> Completed
      </Button>
    </div>
  );
};

export default TaskStatusSelector;
