
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
  ArrowRight,
  List,
  Bookmark,
  FileText
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
        return <Badge className="bg-green-500 shadow-sm"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 shadow-sm"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="shadow-sm"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
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

  const deadlineLabel = () => {
    if (!deadlineStatus) return "";
    
    switch (deadlineStatus) {
      case "overdue":
        return "Overdue";
      case "due-today":
        return "Due Today";
      case "upcoming":
        return "Upcoming";
      default:
        return "Scheduled";
    }
  };

  const completionPercentage = getCompletionPercentage();
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md border-l-4 border-l-primary">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold">{task.title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              {renderStatusBadge(task.status)}
              
              {task.deadline && (
                <div className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-full border ${deadlineBadgeStyle()}`}>
                  <Calendar className="h-3 w-3" /> 
                  <span>{deadlineLabel()}: {format(task.deadline, 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Description & Progress Section */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-muted-foreground mb-3">{task.description}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1.5">
              <div 
                className={`h-2.5 rounded-full ${completionPercentage >= 100 ? 'bg-green-500' : 'bg-primary'} transition-all duration-500`} 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="text-muted-foreground">{completionPercentage}% complete</p>
              <p className="text-muted-foreground">
                {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length} / 
                {task.categories.flatMap(c => c.subtasks).length} subtasks
              </p>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onOpenDetails}
                className="flex items-center shadow-sm hover:shadow transition-all"
              >
                <Info className="h-4 w-4 mr-1" /> Details
              </Button>
              
              <Button
                variant={task.status === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={handleStatusChange}
                className={`flex items-center shadow-sm hover:shadow transition-all ${task.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
              </Button>
              
              {task.stepId && onViewStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewStep(task.stepId!)}
                  className="flex items-center hover:bg-primary/10"
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
              className="flex items-center hover:bg-primary/10"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          
          {/* Subtasks Toggle Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-full border border-muted transition-colors ${isOpen ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
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
          
          {/* Subtasks Expanded Section */}
          {isOpen && (
            <div className="mt-2 space-y-4 animate-accordion-down">
              {task.categories.map((category) => (
                <div key={category.id} className="border rounded-md overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onCategoryToggle(task.id, category.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{category.title}</h4>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
                      </Badge>
                    </div>
                    {category.collapsed ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronUp className="h-4 w-4" />
                    }
                  </div>
                  
                  {!category.collapsed && (
                    <div className="p-3 space-y-1.5 bg-white">
                      {category.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/20 transition-colors">
                          <Checkbox 
                            id={`subtask-${subtask.id}`}
                            checked={subtask.completed}
                            onCheckedChange={(checked) => {
                              onSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                            }}
                            className="mt-0.5"
                          />
                          <label 
                            htmlFor={`subtask-${subtask.id}`}
                            className={`text-sm cursor-pointer flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
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
          
          {/* Resources Section */}
          {task.resources.length > 0 && (
            <div className="mt-4 p-3 bg-accent/40 rounded-lg">
              <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                <FileText className="h-4 w-4" /> Resources
              </h4>
              <ul className="list-none space-y-1.5">
                {task.resources.map((resource, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0"></div>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
