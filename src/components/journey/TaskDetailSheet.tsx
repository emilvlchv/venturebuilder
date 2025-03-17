
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
import { Trash2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Subtask, TaskCategory } from './TaskCard';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface TaskDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  taskId: string;
  categories: TaskCategory[];
  deadline?: Date;
  onAddSubtask: (categoryId: string, title: string) => void;
  onRemoveSubtask: (categoryId: string, subtaskId: string) => void;
  onSubtaskToggle: (categoryId: string, subtaskId: string, completed: boolean) => void;
  onDeadlineChange: (date: Date | undefined) => void;
}

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  isOpen,
  onOpenChange,
  taskTitle,
  taskId,
  categories,
  deadline,
  onAddSubtask,
  onRemoveSubtask,
  onSubtaskToggle,
  onDeadlineChange
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
    onDeadlineChange(twoWeeksFromNow);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Task: {taskTitle}</SheetTitle>
          <SheetDescription>
            Customize deadlines and subtasks for this task.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Deadline Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Set Deadline</h3>
            <div className="flex flex-col gap-2">
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
                  onClick={() => onDeadlineChange(undefined)}
                  className="flex-1"
                >
                  Clear Deadline
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm mb-2">Pick a specific date:</p>
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={onDeadlineChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </div>
              
              <div className="pt-2">
                {deadline ? (
                  <p className="text-sm flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Current deadline: {format(deadline, 'PPP')}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No deadline set</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtasks Editor */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Manage Subtasks</h3>
            
            {categories.map(category => (
              <div key={category.id} className="border rounded-md p-4">
                <h4 className="font-medium text-sm mb-2">{category.title}</h4>
                
                <div className="space-y-2">
                  {category.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-md">
                      <div className="flex items-start gap-2 flex-1">
                        <Checkbox 
                          id={`edit-subtask-${subtask.id}`}
                          checked={subtask.completed}
                          onCheckedChange={(checked) => {
                            onSubtaskToggle(category.id, subtask.id, checked === true);
                          }}
                        />
                        <p className="text-sm">{subtask.title}</p>
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
                  
                  <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add new subtask..." 
                        value={selectedCategoryId === category.id ? newSubtaskTitle : ''}
                        onChange={(e) => {
                          setSelectedCategoryId(category.id);
                          setNewSubtaskTitle(e.target.value);
                        }}
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
        
        <SheetFooter>
          <SheetClose asChild>
            <Button>Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
