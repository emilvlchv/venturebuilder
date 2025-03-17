
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
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Task Deadline</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !deadline && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {deadline ? format(deadline, "PPP") : <span>Set deadline</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={onDeadlineChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DeadlineSelector;
