
import React from 'react';
import { Task } from '../TaskCard';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TaskProgressDisplayProps {
  task: Task;
}

const TaskProgressDisplay: React.FC<TaskProgressDisplayProps> = ({ task }) => {
  const getTotalSubtasks = () => {
    return task.categories.reduce((total, category) => total + category.subtasks.length, 0);
  };

  const getCompletedSubtasks = () => {
    return task.categories.reduce((total, category) => 
      total + category.subtasks.filter(subtask => subtask.completed).length, 0);
  };

  const completionPercentage = getTotalSubtasks() > 0 
    ? Math.round((getCompletedSubtasks() / getTotalSubtasks()) * 100) 
    : 0;
    
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 shadow-sm text-base"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 shadow-sm text-base"><Clock className="h-4 w-4 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="shadow-sm text-base"><AlertCircle className="h-4 w-4 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-muted/20 p-5 rounded-xl">
      <h3 className="text-base font-medium mb-3">Task Progress</h3>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full ${completionPercentage >= 100 ? 'bg-green-500' : 'bg-primary'} transition-all duration-500`} 
          style={{ width: `${completionPercentage}%` }}
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <p className="text-muted-foreground font-medium">{completionPercentage}% complete</p>
        <p className="text-muted-foreground">
          {getCompletedSubtasks()} / {getTotalSubtasks()} subtasks
        </p>
      </div>
    </div>
  );
};

export { renderStatusBadge, TaskProgressDisplay };
