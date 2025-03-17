
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { Task } from './TaskCard';
import TaskProgressDisplay, { renderStatusBadge } from './task-details/TaskProgressDisplay';
import TaskStatusSelector from './task-details/TaskStatusSelector';
import DeadlineSelector from './task-details/DeadlineSelector';
import SubtaskCategory from './task-details/SubtaskCategory';
import ResourcesList from './task-details/ResourcesList';

interface TaskDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onStatusChange: (task: Task, status: 'completed' | 'in-progress' | 'pending') => void;
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
  const [newSubtasks, setNewSubtasks] = useState<{[key: string]: string}>({});

  const handleAddSubtask = (categoryId: string) => {
    const subtaskTitle = newSubtasks[categoryId]?.trim();
    if (subtaskTitle) {
      onAddSubtask(categoryId, subtaskTitle);
      // Reset input field
      setNewSubtasks(prev => ({
        ...prev,
        [categoryId]: ''
      }));
    }
  };

  const handleNewSubtaskChange = (categoryId: string, value: string) => {
    setNewSubtasks(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">{task.title}</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {task.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <TaskProgressDisplay task={task} />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Task Status</h3>
            <TaskStatusSelector 
              currentStatus={task.status} 
              onStatusChange={(status) => onStatusChange(task, status)} 
            />
          </div>

          <DeadlineSelector 
            deadline={task.deadline} 
            onDeadlineChange={(date) => onDeadlineChange(task.id, date)} 
          />

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Task Breakdown</h3>
            {task.categories?.map(category => (
              <SubtaskCategory
                key={category.id}
                category={category}
                taskId={task.id}
                newSubtaskValue={newSubtasks[category.id] || ''}
                onSubtaskToggle={onSubtaskToggle}
                onCategoryToggle={onCategoryToggle}
                onAddSubtask={handleAddSubtask}
                onRemoveSubtask={onRemoveSubtask}
                onNewSubtaskChange={handleNewSubtaskChange}
              />
            ))}
          </div>

          {task.resources && task.resources.length > 0 && (
            <>
              <Separator />
              <ResourcesList resources={task.resources} />
            </>
          )}

          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Close and Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
