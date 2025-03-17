
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../TaskCard';

interface TaskProgressDisplayProps {
  task: Task;
}

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

  // Get color based on task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
      default:
        return 'bg-muted';
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-muted text-foreground"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-2 mb-3">
      <div className="flex justify-between items-center">
        <div>
          {task.categories && 
            <span className="text-sm text-muted-foreground">
              {progress}% Complete
            </span>
          }
        </div>
        <div>
          {renderStatusBadge(task.status)}
        </div>
      </div>
      <Progress value={progress} className={`h-2 ${getStatusColor(task.status)}`} />
    </div>
  );
};

export default TaskProgressDisplay;
