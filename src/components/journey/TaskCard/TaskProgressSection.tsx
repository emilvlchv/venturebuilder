
import React from 'react';
import { Task } from '../types';

interface TaskProgressSectionProps {
  task: Task;
}

const TaskProgressSection: React.FC<TaskProgressSectionProps> = ({ task }) => {
  const getCompletionPercentage = () => {
    const allSubtasks = task.categories.flatMap(category => category.subtasks);
    if (allSubtasks.length === 0) return 0;
    
    const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / allSubtasks.length) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <div className="bg-muted/30 p-5 rounded-xl">
      <p className="text-muted-foreground mb-4 text-base">{task.description}</p>
      
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
        <p className="text-muted-foreground font-medium"><strong>{completionPercentage}%</strong> complete</p>
        <p className="text-muted-foreground">
          {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length} / 
          {task.categories.flatMap(c => c.subtasks).length} subtasks
        </p>
      </div>
    </div>
  );
};

export default TaskProgressSection;
