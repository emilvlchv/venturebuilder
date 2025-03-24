
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import TaskHeader from './TaskHeader';
import TaskProgressSection from './TaskProgressSection';
import TaskActions from './TaskActions';
import TaskSubtasks from './TaskSubtasks';
import TaskResources from './TaskResources';
import TaskDetailSheet from '../TaskDetailSheet';

interface TaskCardProps {
  task: Task;
  index: number;
  onOpenDetails: () => void;
  onTaskStatusChange: (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onDeadlineChange: (taskId: string, deadline: Date | undefined) => void;
  onViewStep?: (stepId: string) => void;
  businessIdea?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  onOpenDetails, 
  onTaskStatusChange,
  onSubtaskToggle,
  onCategoryToggle,
  onDeadlineChange,
  onViewStep,
  businessIdea
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  
  const handleStatusChange = () => {
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    onTaskStatusChange(task, newStatus);
  };

  const handleAddSubtask = (categoryId: string, title: string) => {
    const updatedTask = {...task};
    const categoryIndex = updatedTask.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks.push({
        id: uuidv4(),
        title,
        completed: false
      });
      
      if (updatedTask.status === 'pending') {
        onTaskStatusChange(updatedTask, 'in-progress');
      } else {
        onTaskStatusChange(updatedTask, updatedTask.status);
      }
    }
  };

  const handleRemoveSubtask = (categoryId: string, subtaskId: string) => {
    const updatedTask = {...task};
    const categoryIndex = updatedTask.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks = 
        updatedTask.categories[categoryIndex].subtasks.filter(s => s.id !== subtaskId);
      
      onTaskStatusChange(updatedTask, updatedTask.status);
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md border-l-[6px] border-l-primary animate-fade-in shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col space-y-5">
          <TaskHeader 
            task={task} 
            index={index} 
            businessIdea={businessIdea} 
          />
          
          <TaskProgressSection task={task} />
          
          <TaskActions 
            task={task} 
            onOpenDetails={onOpenDetails} 
            onStatusChange={handleStatusChange} 
            onEditClick={() => setIsEditSheetOpen(true)}
            onViewStep={onViewStep}
          />
          
          <TaskSubtasks 
            task={task} 
            isOpen={isOpen} 
            onToggleOpen={() => setIsOpen(!isOpen)}
            onSubtaskToggle={onSubtaskToggle}
          />
          
          {task.resources && task.resources.length > 0 && (
            <TaskResources resources={task.resources} />
          )}
        </div>
      </CardContent>
      
      {isEditSheetOpen && (
        <TaskDetailSheet
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          task={task}
          onStatusChange={onTaskStatusChange}
          onSubtaskToggle={onSubtaskToggle}
          onCategoryToggle={onCategoryToggle}
          onDeadlineChange={onDeadlineChange}
          onAddSubtask={handleAddSubtask}
          onRemoveSubtask={handleRemoveSubtask}
        />
      )}
    </Card>
  );
};

export default TaskCard;
