
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
import { Save, ExternalLink, Maximize2 } from 'lucide-react';
import { Task } from './TaskCard';
import TaskProgressDisplay, { renderStatusBadge } from './task-details/TaskProgressDisplay';
import TaskStatusSelector from './task-details/TaskStatusSelector';
import DeadlineSelector from './task-details/DeadlineSelector';
import SubtaskCategory from './task-details/SubtaskCategory';
import ResourcesList from './task-details/ResourcesList';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

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
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const navigate = useNavigate();

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

  const handleStatusChange = (status: 'completed' | 'in-progress' | 'pending') => {
    onStatusChange(task, status);
  };
  
  const handleDeadlineChange = (date: Date | undefined) => {
    onDeadlineChange(task.id, date);
  };

  const openInFullPage = () => {
    navigate(`/task/${task.id}`, { state: { task } });
  };

  const renderContent = () => (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <TaskProgressDisplay task={task} />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreenMode(true)}
              className="hidden md:flex items-center"
            >
              <Maximize2 className="h-4 w-4 mr-2" /> Expand
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openInFullPage}
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open Page
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Task Status</h3>
          <TaskStatusSelector 
            status={task.status} 
            onStatusChange={handleStatusChange} 
          />
        </div>

        <DeadlineSelector 
          deadline={task.deadline} 
          onDeadlineChange={handleDeadlineChange}
          taskId={task.id}
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
    </>
  );

  return (
    <>
      <Sheet open={isOpen && !isFullscreenMode} onOpenChange={open => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xl font-bold">{task.title}</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {task.description}
            </SheetDescription>
          </SheetHeader>

          {renderContent()}
        </SheetContent>
      </Sheet>

      <Dialog open={isFullscreenMode} onOpenChange={open => !open && setIsFullscreenMode(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
            <p className="text-muted-foreground mt-2">{task.description}</p>
          </DialogHeader>

          {renderContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDetailSheet;
