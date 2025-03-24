
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Task } from '../types';
import AiAssistancePopover from '../AiAssistancePopover';
import { renderStatusBadge } from './utils';

interface TaskHeaderProps {
  task: Task;
  index: number;
  businessIdea?: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, index, businessIdea }) => {
  const getDeadlineStatus = () => {
    if (!task.deadline) return null;
    
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const threeDaysLater = addDays(today, 3);
    
    if (isBefore(task.deadline, today)) {
      return "overdue";
    } else if (isBefore(task.deadline, tomorrow)) {
      return "due-today";
    } else if (isBefore(task.deadline, threeDaysLater)) {
      return "upcoming";
    } else {
      return "future";
    }
  };
  
  const deadlineStatus = getDeadlineStatus();
  const deadlineBadgeStyle = () => {
    if (!deadlineStatus) return "";
    
    switch (deadlineStatus) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300";
      case "due-today":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const deadlineLabel = () => {
    if (!deadlineStatus) return "";
    
    switch (deadlineStatus) {
      case "overdue":
        return "Overdue";
      case "due-today":
        return "Due Today";
      case "upcoming":
        return "Upcoming";
      default:
        return "Scheduled";
    }
  };
  
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-sm">
          {index + 1}
        </div>
        <h3 className="text-2xl font-semibold">{task.title}</h3>
        <AiAssistancePopover 
          taskTitle={task.title} 
          businessIdea={businessIdea}
        />
      </div>
      
      <div className="flex items-center gap-2">
        {renderStatusBadge(task.status)}
        
        {task.deadline && (
          <div className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${deadlineBadgeStyle()}`}>
            <Calendar className="h-4 w-4" /> 
            <span>{deadlineLabel()}: {format(new Date(task.deadline), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHeader;
