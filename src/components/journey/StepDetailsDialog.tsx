
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
import { CalendarClock, CheckCircle2, Plus, Calendar, Edit, ListChecks, Info, Lightbulb } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import TaskDetailSheet from './TaskDetailSheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
        return <Badge className="bg-green-500"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Calendar className="h-4 w-4 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><CalendarClock className="h-4 w-4 mr-1" /> Not Started</Badge>;
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
      <DialogContent className="max-w-5xl mx-auto p-8" role="dialog" aria-labelledby="step-details-title">
        <DialogHeader className="pb-5 mb-6 border-b">
          <DialogTitle id="step-details-title" className="text-3xl font-bold">{stepDetails.title}</DialogTitle>
          <DialogDescription className="text-lg mt-2">
            {stepDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 bg-primary/10 p-5 rounded-xl flex items-center gap-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <span className="text-base">Estimated time: <strong>{stepDetails.timeEstimate}</strong></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Overview
              </h3>
              <p className="text-base leading-relaxed">{stepDetails.detailedDescription}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Key Tasks
              </h3>
              <ul className="space-y-3">
                {stepDetails.tasks.map((task, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-base">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {stepDetails.examples && stepDetails.examples.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" /> Examples
                </h3>
                <div className="bg-muted/20 p-5 rounded-lg space-y-4">
                  {stepDetails.examples.map((example, index) => (
                    <p key={index} className="text-base italic">{example}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Tasks Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Your Tasks
              </h3>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
            
            {showTaskForm && (
              <div className="mb-6 p-5 border rounded-lg bg-muted/10">
                <h4 className="font-medium mb-4 text-lg">Create a new task</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newTaskTitle" className="block text-sm mb-2 font-medium">Task Title</label>
                    <input
                      id="newTaskTitle"
                      className="w-full p-3 border rounded-lg text-base"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="lg" onClick={() => setShowTaskForm(false)}>Cancel</Button>
                    <Button size="lg" onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </div>
            )}
            
            {tasks.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{task.title}</h4>
                          {renderStatusBadge(task.status)}
                        </div>
                        <p className="text-muted-foreground">{task.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => onTaskOpen && onTaskOpen(task)}
                        className="ml-2"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 my-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${getCompletionPercentage(task)}%` }}
                        role="progressbar"
                        aria-valuenow={getCompletionPercentage(task)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getCompletionPercentage(task)}% complete
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/10 rounded-lg">
                <p className="text-muted-foreground mb-4">No tasks created for this step yet.</p>
                <Button 
                  onClick={() => setShowTaskForm(true)}
                  className="flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Task
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button variant="outline" size="lg" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
