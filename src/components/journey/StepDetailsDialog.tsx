
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
import { Task } from './TaskCard';
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
  onCreateTask?: (stepId: string, title: string, description: string) => void;
  tasks?: Task[];
  onTaskOpen?: (task: Task) => void;
}

const StepDetailsDialog = ({ 
  isOpen, 
  onClose, 
  stepDetails,
  onCreateTask,
  tasks = [],
  onTaskOpen
}: StepDetailsDialogProps) => {
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
          {tasks.length > 0 && (
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
                {tasks.map((task) => (
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
                        onClick={() => onTaskOpen && onTaskOpen(task)}
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
