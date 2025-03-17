
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Info, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Edit,
  Plus,
  ArrowRight 
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import TaskDetailSheet from './TaskDetailSheet';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskCategory {
  id: string;
  title: string;
  subtasks: Subtask[];
  collapsed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  resources: string[];
  categories: TaskCategory[];
  deadline?: Date;
  stepId?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onOpenDetails: () => void;
  onTaskStatusChange: (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onDeadlineChange: (taskId: string, deadline: Date | undefined) => void;
  onViewStep?: (stepId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  onOpenDetails, 
  onTaskStatusChange,
  onSubtaskToggle,
  onCategoryToggle,
  onDeadlineChange,
  onViewStep
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  
  const getCompletionPercentage = () => {
    const allSubtasks = task.categories.flatMap(category => category.subtasks);
    if (allSubtasks.length === 0) return 0;
    
    const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / allSubtasks.length) * 100);
  };

  const handleStatusChange = () => {
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    onTaskStatusChange(task, newStatus);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const handleAddSubtask = (categoryId: string, title: string) => {
    const updatedTask = {...task};
    const categoryIndex = updatedTask.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks.push({
        id: uuidv4(),
        title,
        completed: false
      });
      
      if (updatedTask.status === 'pending') {
        onTaskStatusChange(updatedTask, 'in-progress');
      } else {
        onTaskStatusChange(updatedTask, updatedTask.status);
      }
    }
  };

  const handleRemoveSubtask = (categoryId: string, subtaskId: string) => {
    const updatedTask = {...task};
    const categoryIndex = updatedTask.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks = 
        updatedTask.categories[categoryIndex].subtasks.filter(s => s.id !== subtaskId);
      
      onTaskStatusChange(updatedTask, updatedTask.status);
    }
  };

  const getDeadlineStatus = () => {
    if (!task.deadline) return null;
    
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const threeDaysLater = addDays(today, 3);
    
    if (isBefore(task.deadline, today)) {
      return "overdue";
    } else if (isBefore(task.deadline, tomorrow)) {
      return "due-today";
    } else if (isBefore(task.deadline, threeDaysLater)) {
      return "upcoming";
    } else {
      return "future";
    }
  };
  
  const deadlineStatus = getDeadlineStatus();
  const deadlineBadgeStyle = () => {
    if (!deadlineStatus) return "";
    
    switch (deadlineStatus) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300";
      case "due-today":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const completionPercentage = getCompletionPercentage();
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <div className="ml-2">{renderStatusBadge(task.status)}</div>
                
                {task.deadline && (
                  <div className={`ml-auto text-xs flex items-center px-2 py-1 rounded-full border ${deadlineBadgeStyle()}`}>
                    <Calendar className="h-3 w-3 mr-1" /> 
                    {format(task.deadline, 'MMM d')}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{task.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onOpenDetails}
                    className="mr-2"
                  >
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Button>
                  
                  <Button
                    variant={task.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleStatusChange}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                  
                  {task.stepId && onViewStep && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewStep(task.stepId!)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      View Related Step
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditSheetOpen(true)}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center mb-2"
              >
                {isOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide Subtasks
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show Subtasks ({task.categories.flatMap(c => c.subtasks).length})
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isOpen && (
            <div className="mt-4 space-y-6">
              {task.categories.map((category) => (
                <div key={category.id} className="border rounded-md p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => onCategoryToggle(task.id, category.id)}
                  >
                    <h4 className="font-medium text-lg">{category.title}</h4>
                    {category.collapsed ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronUp className="h-4 w-4" />
                    }
                  </div>
                  
                  {!category.collapsed && (
                    <div className="mt-3 space-y-2">
                      {category.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/40 transition-colors">
                          <Checkbox 
                            id={`subtask-${subtask.id}`}
                            checked={subtask.completed}
                            onCheckedChange={(checked) => {
                              onSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                            }}
                          />
                          <label 
                            htmlFor={`subtask-${subtask.id}`}
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
          
          <div className="mt-4">
            <h4 className="text-sm font-medium">Resources:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
              {task.resources.map((resource, i) => (
                <li key={i}>{resource}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      {isEditSheetOpen && (
        <TaskDetailSheet
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          task={task}
          onStatusChange={onTaskStatusChange}
          onSubtaskToggle={onSubtaskToggle}
          onCategoryToggle={onCategoryToggle}
          onDeadlineChange={onDeadlineChange}
          onAddSubtask={handleAddSubtask}
          onRemoveSubtask={handleRemoveSubtask}
        />
      )}
    </Card>
  );
};

export default TaskCard;
