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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Task, TaskCategory, Subtask } from './types';

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

  const getCategoryCompletionPercentage = (category: TaskCategory) => {
    if (category.subtasks.length === 0) return 0;
    
    const completedCount = category.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / category.subtasks.length) * 100);
  };

  const handleStatusChange = () => {
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    onTaskStatusChange(task, newStatus);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 shadow-sm"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 shadow-sm"><Clock className="h-4 w-4 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="shadow-sm"><AlertCircle className="h-4 w-4 mr-1" /> Not Started</Badge>;
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
    <Card className="transition-all duration-300 hover:shadow-md border-l-[6px] border-l-primary animate-fade-in shadow-lg">
      <CardContent className="p-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-2xl font-semibold">{task.title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              {renderStatusBadge(task.status)}
              
              {task.deadline && (
                <div className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${deadlineBadgeStyle()}`}>
                  <Calendar className="h-4 w-4" /> 
                  <span>{deadlineLabel()}: {format(task.deadline, 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Description & Progress Section */}
          <div className="bg-muted/30 p-5 rounded-xl">
            <p className="text-muted-foreground mb-4 text-base">{task.description}</p>
            
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
              <p className="text-muted-foreground font-medium"><strong>{completionPercentage}%</strong> complete</p>
              <p className="text-muted-foreground">
                {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length} / 
                {task.categories.flatMap(c => c.subtasks).length} subtasks
              </p>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onOpenDetails}
                className="flex items-center shadow-sm hover:shadow transition-all"
              >
                <Info className="h-5 w-5 mr-2" /> Details
              </Button>
              
              <Button
                variant={task.status === 'completed' ? 'default' : 'outline'}
                size="lg"
                onClick={handleStatusChange}
                className={`flex items-center shadow-sm hover:shadow transition-all ${task.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
              </Button>
              
              {task.stepId && onViewStep && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => onViewStep(task.stepId!)}
                  className="flex items-center hover:bg-primary/10"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  View Related Step
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => setIsEditSheetOpen(true)}
              className="flex items-center hover:bg-primary/10"
            >
              <Edit className="h-5 w-5 mr-2" /> Edit Task
            </Button>
          </div>
          
          {/* Subtasks Toggle Button */}
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-full border transition-colors mt-2 ${isOpen ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
            aria-expanded={isOpen}
            aria-controls="subtasks-section"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-5 w-5 mr-2" /> Hide Subtasks
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 mr-2" /> Show Subtasks ({task.categories.flatMap(c => c.subtasks).length})
              </>
            )}
          </Button>
          
          {/* Subtasks Expanded Section */}
          {isOpen && (
            <div 
              id="subtasks-section" 
              className="mt-4 space-y-5 animate-accordion-down"
            >
              <Accordion type="multiple" className="w-full">
                {task.categories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-xl overflow-hidden shadow-sm mb-3">
                    <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 text-left">
                        <Bookmark className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-lg">{category.title}</h4>
                        <div className="ml-2 flex items-center gap-1.5">
                          <Badge variant="outline" className="text-sm">
                            <strong>{getCategoryCompletionPercentage(category)}%</strong> • {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="p-0">
                      <div className="bg-white p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.subtasks.map((subtask) => (
                            <div 
                              key={subtask.id} 
                              className={`flex items-start gap-3 p-3 rounded-md ${subtask.completed ? 'bg-green-50' : 'bg-muted/20'} transition-colors`}
                            >
                              <Checkbox 
                                id={`subtask-${subtask.id}`}
                                checked={subtask.completed}
                                onCheckedChange={(checked) => {
                                  onSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                                }}
                                className="mt-1"
                              />
                              <label 
                                htmlFor={`subtask-${subtask.id}`}
                                className={`text-base cursor-pointer flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {subtask.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {/* Resources Section */}
          {task.resources.length > 0 && (
            <div className="mt-5 p-5 bg-accent/40 rounded-xl">
              <h4 className="text-base font-medium flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5" /> Resources
              </h4>
              <ul className="list-none space-y-2">
                {task.resources.map((resource, i) => (
                  <li key={i} className="text-base text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/70 flex-shrink-0"></div>
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
