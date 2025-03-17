
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DeadlineSelectorProps {
  taskId: string;
  deadline?: Date;
  onDeadlineChange: (taskId: string, deadline: Date | undefined) => void;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ taskId, deadline, onDeadlineChange }) => {
  const setDefaultDeadline = () => {
    // Set deadline to 2 weeks from now
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    onDeadlineChange(taskId, twoWeeksFromNow);
  };

  return (
    <div className="space-y-3 p-5 bg-accent/30 rounded-xl">
      <h3 className="text-base font-medium flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2 text-primary" /> Set Deadline
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={setDefaultDeadline}
            className="flex-1"
          >
            Set Default (2 weeks)
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onDeadlineChange(taskId, undefined)}
            className="flex-1"
          >
            Clear Deadline
          </Button>
        </div>
        
        <div className="p-5 bg-white rounded-lg shadow-sm">
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={(date) => onDeadlineChange(taskId, date || undefined)}
            initialFocus
            className="pointer-events-auto w-full"
          />
        </div>
        
        <div className="pt-2">
          {deadline ? (
            <p className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-100 text-base">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
              Current deadline: {format(deadline, 'PPP')}
            </p>
          ) : (
            <p className="text-base text-muted-foreground bg-gray-50 p-3 rounded-lg border border-gray-100">No deadline set</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineSelector;
