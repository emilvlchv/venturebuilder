
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
  Lightbulb,
  FileText,
  Bookmark
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
          aria-label="New task title"
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg" onClick={onCancel}>Cancel</Button>
        <Button size="lg" onClick={onCreate}>Create Task</Button>
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
      <DialogContent className="max-w-5xl mx-auto p-8" role="dialog" aria-labelledby="step-details-title">
        <DialogHeader className="pb-5 mb-6 border-b">
          <DialogTitle id="step-details-title" className="text-3xl font-bold">{stepDetails.title}</DialogTitle>
          <DialogDescription className="text-lg mt-2">
            {stepDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6 bg-primary/10 p-5 rounded-xl flex items-center gap-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <span className="text-base">Estimated time: <strong>{stepDetails.timeEstimate}</strong></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Step Information */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Overview
              </h3>
              <p className="text-base leading-relaxed">{stepDetails.detailedDescription}</p>
            </div>

            {/* Key Tasks */}
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

            {/* Examples */}
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
          
          {/* Right Column: User Tasks */}
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
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{task.title}</h4>
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="text-muted-foreground">{task.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => onTaskOpen && onTaskOpen(task)}
                        className="ml-2"
                        aria-label={`Edit task: ${task.title}`}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </div>
                    
                    {/* Progress */}
                    <TaskProgressBar task={task} />
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
