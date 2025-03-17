
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CheckCircle2, Calendar, AlertCircle } from 'lucide-react';

interface TaskStatusSelectorProps {
  status: 'completed' | 'in-progress' | 'pending';
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
  taskId?: string;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ 
  status, 
  onStatusChange,
  taskId = 'default'
}) => {
  const statusLabelId = `status-label-${taskId}`;
  
  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-2" id={statusLabelId}>Task Status</div>
      <Select 
        value={status} 
        onValueChange={(value: 'completed' | 'in-progress' | 'pending') => onStatusChange(value)}
        aria-labelledby={statusLabelId}
      >
        <SelectTrigger className="w-full" aria-label="Select task status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="pending" className="flex items-center">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" /> 
              <span>Not Started</span>
            </div>
          </SelectItem>
          <SelectItem value="in-progress" className="flex items-center">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" /> 
              <span>In Progress</span>
            </div>
          </SelectItem>
          <SelectItem value="completed" className="flex items-center">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 
              <span>Completed</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskStatusSelector;
