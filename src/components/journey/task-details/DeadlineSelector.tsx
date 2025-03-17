
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DeadlineSelectorProps {
  deadline?: Date;
  onDeadlineChange: (date: Date | undefined) => void;
  taskId: string;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ deadline, onDeadlineChange, taskId }) => {
  const calendarId = `calendar-${taskId}`;
  const buttonId = `deadline-button-${taskId}`;
  
  // Function to handle keyboard navigation for removing deadline
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (deadline) {
        onDeadlineChange(undefined);
        e.preventDefault();
      }
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2" id={`deadline-label-${taskId}`}>Task Deadline</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={buttonId}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !deadline && "text-muted-foreground"
            )}
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-labelledby={`deadline-label-${taskId}`}
            onKeyDown={handleKeyDown}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {deadline ? (
              <span>{format(deadline, "PPP")}</span>
            ) : (
              <span>Set deadline</span>
            )}
            {deadline && (
              <span className="sr-only">
                Current deadline: {format(deadline, "PPPP")}. Press Delete or Backspace to remove.
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            id={calendarId}
            mode="single"
            selected={deadline}
            onSelect={onDeadlineChange}
            initialFocus
            className="p-3 pointer-events-auto"
            aria-label="Select deadline date"
          />
          {deadline && (
            <div className="p-3 border-t">
              <Button 
                variant="ghost" 
                className="text-destructive hover:text-destructive/90 w-full justify-start"
                onClick={() => onDeadlineChange(undefined)}
                aria-label="Remove deadline"
              >
                Remove deadline
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DeadlineSelector;
