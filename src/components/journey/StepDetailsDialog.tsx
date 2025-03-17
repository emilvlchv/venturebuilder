
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarClock, CheckCircle2, Plus, Calendar, Edit } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, TaskCategory, Subtask } from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import TaskDetailSheet from './TaskDetailSheet';

export interface StepDetail {
  title: string;
  description: string;
  timeEstimate: string;
  detailedDescription: string;
  tasks: string[];
  examples?: string[];
  stepId?: string;
}

interface StepDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stepDetails: StepDetail | null;
  relatedTasks?: Task[];
  onTaskToggle?: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onTaskStatusChange?: (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => void;
  onCategoryToggle?: (taskId: string, categoryId: string) => void;
  onDeadlineChange?: (taskId: string, deadline: Date | undefined) => void;
  onCreateTask?: (stepId: string, title: string, description: string) => void;
}

const StepDetailsDialog = ({ 
  isOpen, 
  onClose, 
  stepDetails,
  relatedTasks = [],
  onTaskToggle,
  onTaskStatusChange,
  onCategoryToggle,
  onDeadlineChange,
  onCreateTask
}: StepDetailsDialogProps) => {
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  if (!stepDetails) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Calendar className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><CalendarClock className="h-3 w-3 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const getCompletionPercentage = (task: Task) => {
    const allSubtasks = task.categories.flatMap(category => category.subtasks);
    if (allSubtasks.length === 0) return 0;
    
    const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / allSubtasks.length) * 100);
  };

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleCreateTask = () => {
    if (onCreateTask && stepDetails.stepId && newTaskTitle.trim()) {
      onCreateTask(stepDetails.stepId, newTaskTitle, stepDetails.description);
      setNewTaskTitle('');
      setShowTaskForm(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{stepDetails.title}</DialogTitle>
          <DialogDescription className="text-base">
            {stepDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 bg-muted/30 p-4 rounded-md flex items-center gap-3">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">Estimated time: <strong>{stepDetails.timeEstimate}</strong></span>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <p className="text-muted-foreground">{stepDetails.detailedDescription}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Key Tasks</h3>
            <ul className="space-y-1.5">
              {stepDetails.tasks.map((task, index) => (
                <li key={index} className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {stepDetails.examples && stepDetails.examples.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Examples</h3>
              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                {stepDetails.examples.map((example, index) => (
                  <p key={index}>{example}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Tasks Section */}
          {relatedTasks.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Tasks for This Step</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
              
              {showTaskForm && (
                <div className="mb-4 p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Create a new task</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newTaskTitle" className="block text-sm mb-1">Task Title</label>
                      <input
                        id="newTaskTitle"
                        className="w-full p-2 border rounded-md"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Enter task title..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowTaskForm(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleCreateTask}>Create Task</Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {relatedTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{task.title}</h4>
                          {renderStatusBadge(task.status)}
                        </div>
                        <p className="text-muted-foreground">{task.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenTaskDetails(task)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 my-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${getCompletionPercentage(task)}%` }}
                      ></div>
                    </div>
                    <div className="mb-3 text-xs text-muted-foreground">
                      {getCompletionPercentage(task)}% complete
                    </div>
                    
                    {task.categories.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {task.categories.map((category) => (
                          <div key={category.id} className="bg-muted/20 p-3 rounded-md">
                            <div 
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => onCategoryToggle && onCategoryToggle(task.id, category.id)}
                            >
                              <h5 className="font-medium">{category.title}</h5>
                            </div>
                            
                            {!category.collapsed && (
                              <div className="mt-2 space-y-1">
                                {category.subtasks.map((subtask) => (
                                  <div key={subtask.id} className="flex items-start space-x-2 p-1">
                                    <Checkbox 
                                      id={`dialog-subtask-${subtask.id}`}
                                      checked={subtask.completed}
                                      onCheckedChange={(checked) => {
                                        onTaskToggle && onTaskToggle(task.id, category.id, subtask.id, checked === true);
                                      }}
                                    />
                                    <label 
                                      htmlFor={`dialog-subtask-${subtask.id}`}
                                      className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                      {subtask.title}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <Button 
                        variant={task.status === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          if (onTaskStatusChange) {
                            const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
                            onTaskStatusChange(task, newStatus);
                          }
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Start This Step</Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Task Edit Sheet */}
      {selectedTask && (
        <TaskDetailSheet
          isOpen={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          taskTitle={selectedTask.title}
          taskId={selectedTask.id}
          categories={selectedTask.categories}
          deadline={selectedTask.deadline}
          onAddSubtask={(categoryId, title) => {
            // Pass through to parent
            if (selectedTask && onTaskToggle) {
              const newSubtaskId = uuidv4();
              // We'll need the parent component to handle this
            }
          }}
          onRemoveSubtask={(categoryId, subtaskId) => {
            // Pass through to parent
          }}
          onSubtaskToggle={(categoryId, subtaskId, completed) => {
            if (onTaskToggle && selectedTask) {
              onTaskToggle(selectedTask.id, categoryId, subtaskId, completed);
            }
          }}
          onDeadlineChange={(date) => {
            if (onDeadlineChange && selectedTask) {
              onDeadlineChange(selectedTask.id, date);
            }
          }}
        />
      )}
    </Dialog>
  );
};

export default StepDetailsDialog;
