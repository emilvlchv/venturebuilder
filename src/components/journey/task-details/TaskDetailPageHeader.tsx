
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskDetailPageHeaderProps {
  title: string;
}

const TaskDetailPageHeader: React.FC<TaskDetailPageHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mr-4"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default TaskDetailPageHeader;
