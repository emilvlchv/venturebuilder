
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, TaskCategory } from '../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TaskSubtasksProps {
  task: Task;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
}

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ 
  task, 
  isOpen, 
  onToggleOpen,
  onSubtaskToggle
}) => {
  const getCategoryCompletionPercentage = (category: TaskCategory) => {
    if (category.subtasks.length === 0) return 0;
    
    const completedCount = category.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / category.subtasks.length) * 100);
  };
  
  return (
    <>
      <Button 
        variant="secondary" 
        size="lg" 
        onClick={onToggleOpen}
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
    </>
  );
};

export default TaskSubtasks;
