
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Info, ExternalLink } from 'lucide-react';
import { Task } from './types';
import { useNavigate } from 'react-router-dom';

interface StepProps {
  id: string;
  title: string;
  description: string;
  status: string;
  relatedTasks: Task[];
  onOpenTaskDetails: (task: Task) => void;
  hasActiveTasks?: boolean;
  allTasksCompleted?: boolean;
  journeyId?: string;
}

const StepCard: React.FC<StepProps> = ({
  id,
  title,
  description,
  status,
  relatedTasks,
  onOpenTaskDetails,
  hasActiveTasks = false,
  allTasksCompleted = false,
  journeyId
}) => {
  const navigate = useNavigate();
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const handleViewDetails = () => {
    if (journeyId) {
      navigate(`/journey-details/${journeyId}/step/${id}`);
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      hasActiveTasks ? 'border-blue-400 border-2' : ''
    } ${
      allTasksCompleted ? 'border-green-400 border-2' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {renderStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {relatedTasks.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Related Tasks:</h4>
            <ul className="space-y-1 text-sm">
              {relatedTasks.map(task => (
                <li key={task.id} className="flex items-center justify-between">
                  <span className="flex items-center">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleViewDetails} 
            variant="outline" 
            size="sm"
            className="w-full flex justify-center gap-2"
          >
            <Info className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
