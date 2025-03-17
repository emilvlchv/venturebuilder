
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarClock, CheckCircle2 } from 'lucide-react';

export interface StepDetail {
  title: string;
  description: string;
  timeEstimate: string;
  detailedDescription: string;
  tasks: string[];
  examples?: string[];
}

interface StepDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stepDetails: StepDetail | null;
}

const StepDetailsDialog = ({ isOpen, onClose, stepDetails }: StepDetailsDialogProps) => {
  if (!stepDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto">
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
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Start This Step</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepDetailsDialog;
