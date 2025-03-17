
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { Task } from './TaskCard';
import { renderStatusBadge, TaskProgressDisplay } from './task-details/TaskProgressDisplay';
import TaskStatusSelector from './task-details/TaskStatusSelector';
import DeadlineSelector from './task-details/DeadlineSelector';
import SubtaskCategory from './task-details/SubtaskCategory';
import ResourcesList from './task-details/ResourcesList';

interface TaskDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onStatusChange: (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onDeadlineChange: (taskId: string, deadline: Date | undefined) => void;
  onAddSubtask: (categoryId: string, title: string) => void;
  onRemoveSubtask: (categoryId: string, subtaskId: string) => void;
}

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onSubtaskToggle,
  onCategoryToggle,
  onDeadlineChange,
  onAddSubtask,
  onRemoveSubtask
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-6" role="dialog" aria-label="Edit Task">
        <SheetHeader className="pb-6 mb-6 border-b">
          <SheetTitle className="flex items-center justify-between text-2xl">
            <span>Task Details</span>
            {renderStatusBadge(task.status)}
          </SheetTitle>
          <SheetDescription className="pt-2 text-lg">
            {task.title}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-8">
          {/* Progress Overview */}
          <TaskProgressDisplay task={task} />
          
          {/* Status Selector */}
          <TaskStatusSelector task={task} onStatusChange={onStatusChange} />
          
          {/* Deadline Section */}
          <DeadlineSelector 
            taskId={task.id} 
            deadline={task.deadline} 
            onDeadlineChange={onDeadlineChange}
          />
          
          {/* Subtasks Editor */}
          <div className="space-y-5">
            <h3 className="text-base font-medium">Manage Subtasks</h3>
            
            {task.categories.map(category => (
              <SubtaskCategory
                key={category.id}
                category={category}
                taskId={task.id}
                onSubtaskToggle={onSubtaskToggle}
                onCategoryToggle={onCategoryToggle}
                onAddSubtask={onAddSubtask}
                onRemoveSubtask={onRemoveSubtask}
              />
            ))}
          </div>
          
          {/* Resources Section */}
          <ResourcesList resources={task.resources} />
        </div>
        
        <SheetFooter className="mt-8 flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            size="lg"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <SheetClose asChild>
            <Button className="w-full sm:w-auto order-1 sm:order-2" size="lg">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
