
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../TaskCard';

interface TaskStatusSelectorProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => void;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ task, onStatusChange }) => {
  const handleStatusChange = (newStatus: 'completed' | 'in-progress' | 'pending') => {
    onStatusChange(task, newStatus);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium">Task Status</h3>
      <div className="flex flex-wrap gap-3">
        <Button 
          size="lg"
          variant={task.status === 'pending' ? 'default' : 'outline'}
          className={task.status === 'pending' ? 'bg-muted text-foreground' : ''}
          onClick={() => handleStatusChange('pending')}
        >
          <AlertCircle className="h-4 w-4 mr-2" /> Not Started
        </Button>
        <Button 
          size="lg"
          variant={task.status === 'in-progress' ? 'default' : 'outline'}
          className={task.status === 'in-progress' ? 'bg-blue-500 text-white' : ''}
          onClick={() => handleStatusChange('in-progress')}
        >
          <Clock className="h-4 w-4 mr-2" /> In Progress
        </Button>
        <Button 
          size="lg"
          variant={task.status === 'completed' ? 'default' : 'outline'}
          className={task.status === 'completed' ? 'bg-green-500 text-white' : ''}
          onClick={() => handleStatusChange('completed')}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" /> Completed
        </Button>
      </div>
    </div>
  );
};

export default TaskStatusSelector;
