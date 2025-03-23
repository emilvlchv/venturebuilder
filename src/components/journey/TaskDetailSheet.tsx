
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, CheckCheck, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Task } from './types';

interface TaskDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onStatusChange: (task: Task, status: 'completed' | 'in-progress' | 'pending') => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string, collapsed: boolean) => void;
  onDeadlineChange: (taskId: string, deadline: Date | null) => void;
  onAddSubtask: (taskId: string, categoryId: string, subtaskTitle: string) => void;
  onRemoveSubtask: (taskId: string, categoryId: string, subtaskId: string) => void;
}

const TaskDetailSheet = ({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onSubtaskToggle,
  onCategoryToggle,
  onDeadlineChange,
  onAddSubtask,
  onRemoveSubtask
}: TaskDetailSheetProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [status, setStatus] = useState(task.status);

  const saveStatusToast = () => {
    toast({
      title: "Status saved",
      description: "Task status has been updated.",
    })
  }

  const saveProgressToast = () => {
    toast({
      title: "Progress saved",
      description: "Task progress has been updated.",
    })
  }

  const saveDeadlineToast = () => {
    toast({
      title: "Deadline saved",
      description: "Task deadline has been updated.",
    })
  }

  const handleStatusChange = (newStatus: 'completed' | 'in-progress' | 'pending') => {
    onStatusChange(task, newStatus);
    saveStatusToast();
  };

  const handleDeadlineChange = (date: Date | null) => {
    onDeadlineChange(task.id, date);
    saveDeadlineToast();
  };

  const handleSubtaskToggle = (categoryId: string, subtaskId: string, completed: boolean) => {
    onSubtaskToggle(task.id, categoryId, subtaskId, completed);
    saveProgressToast();
  };

  const handleAddSubtask = (categoryId: string, subtaskTitle: string) => {
    onAddSubtask(task.id, categoryId, subtaskTitle);
    toast({
      title: "Subtask added",
      description: "New subtask has been added to the task.",
    });
  };

  const handleRemoveSubtask = (categoryId: string, subtaskId: string) => {
    onRemoveSubtask(task.id, categoryId, subtaskId);
    toast({
      title: "Subtask removed",
      description: "Subtask has been removed from the task.",
    });
  };

  // Convert string deadline to Date if needed
  const taskDeadline = task.deadline 
    ? typeof task.deadline === 'string' 
      ? new Date(task.deadline) 
      : task.deadline
    : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[525px]" side="right">
        <SheetHeader>
          <SheetTitle>{task.title}</SheetTitle>
          <SheetDescription>
            {task.description}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right text-sm font-medium leading-none text-right">
              Status
            </label>
            <select 
              id="status" 
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'completed' | 'in-progress' | 'pending');
                handleStatusChange(e.target.value as 'completed' | 'in-progress' | 'pending');
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="deadline" className="text-right text-sm font-medium leading-none">
              Deadline
            </label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !taskDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {taskDeadline ? format(taskDeadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={taskDeadline || undefined}
                    onSelect={(date) => {
                      handleDeadlineChange(date);
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">Categories</h4>
            {task.categories && task.categories.map((category) => (
              <div key={category.id} className="mb-3 rounded-md border">
                <div className="flex items-center justify-between p-3">
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.title}
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => onCategoryToggle(task.id, category.id, !category.collapsed)}>
                    {category.collapsed ? "Show" : "Hide"} Subtasks
                  </Button>
                </div>
                {!category.collapsed && (
                  <div className="px-4 pb-3">
                    {category.subtasks && category.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subtask.id}
                          checked={subtask.completed}
                          onCheckedChange={(checked) => {
                            handleSubtaskToggle(category.id, subtask.id, !!checked);
                          }}
                        />
                        <label
                          htmlFor={subtask.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subtask.title}
                        </label>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSubtask(category.id, subtask.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="mt-2 flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="New Subtask"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleAddSubtask(category.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button variant="outline" size="icon" onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        if (input && input.value.trim()) {
                          handleAddSubtask(category.id, input.value);
                          input.value = '';
                        }
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
