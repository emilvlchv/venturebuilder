
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../TaskCard';

interface TaskProgressDisplayProps {
  task: Task;
}

// Export the renderStatusBadge function separately so it can be used by other components
export const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-muted/80 text-foreground"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
  }
};

const TaskProgressDisplay: React.FC<TaskProgressDisplayProps> = ({ task }) => {
  const calculateProgress = (task: Task): number => {
    if (!task.categories) return 0;
    
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    
    task.categories.forEach(category => {
      totalSubtasks += category.subtasks.length;
      completedSubtasks += category.subtasks.filter(subtask => subtask.completed).length;
    });
    
    return totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  };

  const progress = calculateProgress(task);

  // Get color based on task status or progress
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-muted';
  };

  return (
    <div className="space-y-2 mb-3">
      <div className="flex justify-between items-center">
        <div>
          {task.categories && 
            <span className="text-sm font-medium">
              <strong className="text-primary">{progress}%</strong> Complete
            </span>
          }
        </div>
        <div>
          {renderStatusBadge(task.status)}
        </div>
      </div>
      <Progress value={progress} className={`h-2.5 ${getProgressColor(progress)}`} />
      <div className="text-xs text-muted-foreground">
        {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length}/{task.categories.flatMap(c => c.subtasks).length} subtasks completed
      </div>
    </div>
  );
};

export default TaskProgressDisplay;
