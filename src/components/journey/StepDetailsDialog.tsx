
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, TaskCategory, StepDetail } from './types';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StepDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stepDetails: StepDetail | null;
  onTaskSelect?: (task: Task) => void;
  onTaskOpen?: (task: Task) => void;
}

const TaskProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-brand-main h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const StepDetailsDialog: React.FC<StepDetailsDialogProps> = ({
  isOpen,
  onClose,
  stepDetails,
  onTaskSelect,
  onTaskOpen
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleTaskSelect = (taskName: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskName) 
        ? prev.filter(task => task !== taskName)
        : [...prev, taskName]
    );
    
    if (onTaskSelect) {
      // Create a task object with the taskName, since stepDetails.tasks is an array of strings
      const taskObject: Task = {
        id: `task-${Date.now()}`,
        title: taskName,
        description: `Task related to ${stepDetails?.title || "unknown step"}`,
        status: 'pending',
        categories: []
      };
      onTaskSelect(taskObject);
    }
  };

  // If stepDetails is null, return a simplified dialog
  if (!stepDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Step Details</DialogTitle>
            <DialogDescription>
              No step information available at this time.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{stepDetails.title}</DialogTitle>
          <DialogDescription>
            {stepDetails.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Progress</h4>
          <TaskProgressBar progress={stepDetails.progress || 0} />
        </div>

        {stepDetails.tasks && stepDetails.tasks.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Related Tasks</h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tasks">
                <AccordionTrigger className="text-sm">
                  View Tasks ({stepDetails.tasks.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {stepDetails.tasks.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`task-${index}`}
                          checked={selectedTasks.includes(task)}
                          onCheckedChange={() => handleTaskSelect(task)}
                        />
                        <label 
                          htmlFor={`task-${index}`}
                          className="text-sm cursor-pointer"
                        >
                          {task}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {stepDetails.categories && stepDetails.categories.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {stepDetails.categories.map((category, index) => (
                <Badge key={index} variant="outline">{category}</Badge>
              ))}
            </div>
          </div>
        )}

        {stepDetails.resources && stepDetails.resources.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Resources</h4>
            <ul className="list-disc pl-5 space-y-1">
              {stepDetails.resources.map((resource, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
