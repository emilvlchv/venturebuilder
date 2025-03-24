
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info, ArrowRight, Edit } from 'lucide-react';
import { Task } from '../types';

interface TaskActionsProps {
  task: Task;
  onOpenDetails: () => void;
  onStatusChange: () => void;
  onEditClick: () => void;
  onViewStep?: (stepId: string) => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({ 
  task, 
  onOpenDetails, 
  onStatusChange,
  onEditClick,
  onViewStep
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-between items-center">
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onOpenDetails}
          className="flex items-center shadow-sm hover:shadow transition-all"
        >
          <Info className="h-5 w-5 mr-2" /> Details
        </Button>
        
        <Button
          variant={task.status === 'completed' ? 'default' : 'outline'}
          size="lg"
          onClick={onStatusChange}
          className={`flex items-center shadow-sm hover:shadow transition-all ${task.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
        </Button>
        
        {task.stepId && onViewStep && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewStep(task.stepId!)}
            className="flex items-center hover:bg-primary/10"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            View Related Step
          </Button>
        )}
      </div>
      
      <Button 
        variant="outline"
        size="lg" 
        onClick={onEditClick}
        className="flex items-center hover:bg-primary/10"
      >
        <Edit className="h-5 w-5 mr-2" /> Edit Task
      </Button>
    </div>
  );
};

export default TaskActions;
