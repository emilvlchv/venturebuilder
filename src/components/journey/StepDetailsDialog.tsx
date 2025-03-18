
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
import { 
  CalendarClock, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Edit, 
  ListChecks, 
  Info, 
  FileText,
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, TaskCategory } from './TaskCard';
import { Badge } from '@/components/ui/badge';

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

// Reusable components
const TaskProgressBar = ({ task }: { task: Task }) => {
  const getCompletionPercentage = () => {
    const allSubtasks = task.categories.flatMap(category => category.subtasks);
    if (allSubtasks.length === 0) return 0;
    
    const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / allSubtasks.length) * 100);
  };
  
  const percentage = getCompletionPercentage();
  
  return (
    <>
      <div className="w-full bg-gray-200 rounded-full h-3 my-3">
        <div 
          className="bg-green-500 h-3 rounded-full" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="text-sm text-muted-foreground">
        {percentage}% complete • {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length}/{task.categories.flatMap(c => c.subtasks).length} subtasks
      </div>
    </>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
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

const TaskCreationForm = ({ 
  onCancel, 
  onCreate, 
  newTaskTitle, 
  setNewTaskTitle 
}: { 
  onCancel: () => void; 
  onCreate: () => void; 
  newTaskTitle: string; 
  setNewTaskTitle: (value: string) => void;
}) => (
  <div className="mb-4 p-4 border rounded-lg bg-muted/10">
    <h4 className="font-medium mb-2 text-base">Create a new task</h4>
    <div className="space-y-3">
      <div>
        <label htmlFor="newTaskTitle" className="block text-sm mb-1 font-medium">Task Title</label>
        <input
          id="newTaskTitle"
          className="w-full p-2 border rounded-lg text-sm"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          aria-label="New task title"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onCreate}>Create Task</Button>
      </div>
    </div>
  </div>
);

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
  const [infoCollapsed, setInfoCollapsed] = useState(false);
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  
  if (!stepDetails) return null;

  const handleCreateTask = () => {
    if (onCreateTask && stepDetails.stepId && newTaskTitle.trim()) {
      onCreateTask(stepDetails.stepId, newTaskTitle, stepDetails.description);
      setNewTaskTitle('');
      setShowTaskForm(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto p-6" role="dialog" aria-labelledby="step-details-title">
        <DialogHeader className="pb-4 mb-4 border-b">
          <DialogTitle id="step-details-title" className="text-2xl font-bold">{stepDetails.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {stepDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 bg-primary/10 p-4 rounded-lg flex items-center gap-3">
          <CalendarClock className="h-6 w-6 text-primary" />
          <span className="text-sm">Estimated time: <strong>{stepDetails.timeEstimate}</strong></span>
        </div>

        <div className="space-y-4">
          {/* Step Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setInfoCollapsed(!infoCollapsed)}
              role="button"
              aria-expanded={!infoCollapsed}
              tabIndex={0}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Step Information
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                {infoCollapsed ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {!infoCollapsed && (
              <div className="mt-3">
                <p className="text-sm leading-relaxed">{stepDetails.detailedDescription}</p>
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" /> Key Tasks
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {stepDetails.tasks.map((task, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* User Tasks */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setTasksCollapsed(!tasksCollapsed)}
              role="button"
              aria-expanded={!tasksCollapsed}
              tabIndex={0}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Your Tasks
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTaskForm(!showTaskForm);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  {tasksCollapsed ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            
            {!tasksCollapsed && (
              <div className="mt-3">
                {/* Task Creation Form */}
                {showTaskForm && (
                  <TaskCreationForm 
                    onCancel={() => setShowTaskForm(false)}
                    onCreate={handleCreateTask}
                    newTaskTitle={newTaskTitle}
                    setNewTaskTitle={setNewTaskTitle}
                  />
                )}
                
                {/* Task List */}
                {tasks.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-base">{task.title}</h4>
                            <StatusBadge status={task.status} />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onTaskOpen && onTaskOpen(task)}
                            className="ml-2"
                            aria-label={`Edit task: ${task.title}`}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                        
                        {/* Progress */}
                        <TaskProgressBar task={task} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-muted/10 rounded-lg">
                    <p className="text-muted-foreground mb-3">No tasks created for this step yet.</p>
                    <Button 
                      onClick={() => setShowTaskForm(true)}
                      size="sm"
                      className="flex items-center mx-auto"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Create Your First Task
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" size="lg" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
