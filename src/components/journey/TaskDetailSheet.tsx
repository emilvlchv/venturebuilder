
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
  Bookmark,
  Save
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
        return <Badge className="bg-green-500 shadow-sm text-base"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 shadow-sm text-base"><Clock className="h-4 w-4 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="shadow-sm text-base"><AlertCircle className="h-4 w-4 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: 'completed' | 'in-progress' | 'pending') => {
    onStatusChange(task, newStatus);
  };

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
          
          {/* Status Selector */}
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
          
          {/* Deadline Section */}
          <div className="space-y-3 p-5 bg-accent/30 rounded-xl">
            <h3 className="text-base font-medium flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" /> Set Deadline
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={setDefaultDeadline}
                  className="flex-1"
                >
                  Set Default (2 weeks)
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => onDeadlineChange(task.id, undefined)}
                  className="flex-1"
                >
                  Clear Deadline
                </Button>
              </div>
              
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={task.deadline}
                  onSelect={(date) => onDeadlineChange(task.id, date || undefined)}
                  initialFocus
                  className="pointer-events-auto w-full"
                />
              </div>
              
              <div className="pt-2">
                {task.deadline ? (
                  <p className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-100 text-base">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Current deadline: {format(task.deadline, 'PPP')}
                  </p>
                ) : (
                  <p className="text-base text-muted-foreground bg-gray-50 p-3 rounded-lg border border-gray-100">No deadline set</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtasks Editor */}
          <div className="space-y-5">
            <h3 className="text-base font-medium">Manage Subtasks</h3>
            
            {task.categories.map(category => (
              <div key={category.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-muted/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-base">{category.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
                  </Badge>
                </div>
                
                <div className="p-4 space-y-4">
                  {category.subtasks.length > 0 ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {category.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center justify-between gap-2 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox 
                              id={`edit-subtask-${subtask.id}`}
                              checked={subtask.completed}
                              onCheckedChange={(checked) => {
                                onSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                              }}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`edit-subtask-${subtask.id}`}
                              className={`text-base cursor-pointer ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {subtask.title}
                            </label>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 rounded-full" 
                            onClick={() => onRemoveSubtask(category.id, subtask.id)}
                            aria-label="Remove subtask"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-muted-foreground text-center py-4">No subtasks yet. Add one below.</p>
                  )}
                  
                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add new subtask..." 
                        value={selectedCategoryId === category.id ? newSubtaskTitle : ''}
                        onChange={(e) => {
                          setSelectedCategoryId(category.id);
                          setNewSubtaskTitle(e.target.value);
                        }}
                        className="text-base"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask(category.id);
                          }
                        }}
                      />
                      <Button 
                        variant="secondary" 
                        size="lg"
                        onClick={() => handleAddSubtask(category.id)}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
