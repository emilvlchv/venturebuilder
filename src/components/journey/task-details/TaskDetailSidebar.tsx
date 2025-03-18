import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ResourcesList from './ResourcesList';
import { Task } from '../types';

interface TaskDetailSidebarProps {
  task: Task;
  onSaveChanges: () => void;
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
}

const TaskDetailSidebar: React.FC<TaskDetailSidebarProps> = ({ 
  task, 
  onSaveChanges, 
  onStatusChange 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-y-4">
          <Button 
            className="w-full flex items-center justify-center"
            onClick={onSaveChanges}
          >
            <Save className="h-5 w-5 mr-2" /> Save Changes
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Cancel
          </Button>
          
          <Separator className="my-4" />
          
          <Button 
            variant={task.status === 'completed' ? 'default' : 'outline'}
            className={`w-full flex items-center justify-center ${task.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
            onClick={() => onStatusChange(task.status === 'completed' ? 'in-progress' : 'completed')}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </div>
      
      {task.resources && task.resources.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <ResourcesList resources={task.resources} />
        </div>
      )}
      
      {task.stepId && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Related Step</h2>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => navigate(`/journey-details/${task.stepId}`)}
          >
            <Bookmark className="h-5 w-5 mr-2" /> View Related Step
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailSidebar;
