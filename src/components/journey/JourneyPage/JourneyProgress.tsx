
import React from 'react';

interface JourneyProgressProps {
  title: string;
  description: string;
  progress: number;
}

const JourneyProgress: React.FC<JourneyProgressProps> = ({ 
  title, 
  description, 
  progress 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="w-full bg-muted rounded-full h-2 mb-1 max-w-md">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground">
        {progress}% complete
      </p>
    </div>
  );
};

export default JourneyProgress;
