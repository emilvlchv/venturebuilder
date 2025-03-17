
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Trash2, 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { Task, TaskCategory, Subtask } from './TaskCard';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "@/components/ui/badge";

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
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleAddSubtask = (categoryId: string) => {
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(categoryId, newSubtaskTitle);
    setNewSubtaskTitle('');
  };

  const setDefaultDeadline = () => {
    // Set deadline to 2 weeks from now
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    onDeadlineChange(task.id, twoWeeksFromNow);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 shadow-sm"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 shadow-sm"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="shadow-sm"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: 'completed' | 'in-progress' | 'pending') => {
    onStatusChange(task, newStatus);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="pb-4 mb-6 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Edit Task</span>
            {renderStatusBadge(task.status)}
          </SheetTitle>
          <SheetDescription className="pt-2 text-base">
            {task.title}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Status Selector */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Task Status</h3>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant={task.status === 'pending' ? 'default' : 'outline'}
                className={task.status === 'pending' ? 'bg-muted text-foreground' : ''}
                onClick={() => handleStatusChange('pending')}
              >
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Not Started
              </Button>
              <Button 
                size="sm"
                variant={task.status === 'in-progress' ? 'default' : 'outline'}
                className={task.status === 'in-progress' ? 'bg-blue-500 text-white' : ''}
                onClick={() => handleStatusChange('in-progress')}
              >
                <Clock className="h-3.5 w-3.5 mr-1" /> In Progress
              </Button>
              <Button 
                size="sm"
                variant={task.status === 'completed' ? 'default' : 'outline'}
                className={task.status === 'completed' ? 'bg-green-500 text-white' : ''}
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Completed
              </Button>
            </div>
          </div>
          
          {/* Deadline Section */}
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-primary" /> Set Deadline
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={setDefaultDeadline}
                  className="flex-1"
                >
                  Set Default (2 weeks)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDeadlineChange(task.id, undefined)}
                  className="flex-1"
                >
                  Clear Deadline
                </Button>
              </div>
              
              <div className="p-4 bg-white rounded-md shadow-sm">
                <Calendar
                  mode="single"
                  selected={task.deadline}
                  onSelect={(date) => onDeadlineChange(task.id, date || undefined)}
                  initialFocus
                  className="pointer-events-auto max-w-full"
                />
              </div>
              
              <div className="pt-2">
                {task.deadline ? (
                  <p className="text-sm flex items-center bg-blue-50 p-2 rounded-md border border-blue-100">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Current deadline: {format(task.deadline, 'PPP')}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded-md border border-gray-100">No deadline set</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtasks Editor */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Manage Subtasks</h3>
            
            {task.categories.map(category => (
              <div key={category.id} className="border rounded-md overflow-hidden">
                <div className="bg-muted/30 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{category.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
                  </Badge>
                </div>
                
                <div className="p-3 space-y-3">
                  {category.subtasks.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {category.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center justify-between gap-2 p-2 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-2 flex-1">
                            <Checkbox 
                              id={`edit-subtask-${subtask.id}`}
                              checked={subtask.completed}
                              onCheckedChange={(checked) => {
                                onSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                              }}
                            />
                            <label 
                              htmlFor={`edit-subtask-${subtask.id}`}
                              className={`text-sm cursor-pointer ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {subtask.title}
                            </label>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => onRemoveSubtask(category.id, subtask.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No subtasks yet. Add one below.</p>
                  )}
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add new subtask..." 
                        value={selectedCategoryId === category.id ? newSubtaskTitle : ''}
                        onChange={(e) => {
                          setSelectedCategoryId(category.id);
                          setNewSubtaskTitle(e.target.value);
                        }}
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask(category.id);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddSubtask(category.id)}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <SheetClose asChild>
            <Button className="w-full sm:w-auto order-1 sm:order-2">
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
