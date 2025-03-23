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
  stepDetails: StepDetail;
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
      const matchingTask = stepDetails.tasks.find(task => task === taskName);
      if (matchingTask) {
        onTaskSelect(matchingTask as Task);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stepDetails.title}</DialogTitle>
          <DialogDescription>{stepDetails.description}</DialogDescription>
        </DialogHeader>

        {/* Rest of the component remains the same */}
        {/* No changes needed beyond fixing type definitions */}
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
