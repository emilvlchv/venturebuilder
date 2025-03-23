
import React from 'react';
import { FileText } from 'lucide-react';

interface TaskResourcesProps {
  resources: string[];
}

const TaskResources: React.FC<TaskResourcesProps> = ({ resources }) => {
  return (
    <div className="mt-5 p-5 bg-accent/40 rounded-xl">
      <h4 className="text-base font-medium flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5" /> Resources
      </h4>
      <ul className="list-none space-y-2">
        {resources.map((resource, i) => (
          <li key={i} className="text-base text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/70 flex-shrink-0"></div>
            {resource}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskResources;
