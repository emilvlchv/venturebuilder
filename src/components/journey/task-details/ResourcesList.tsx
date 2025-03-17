
import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';

interface ResourcesListProps {
  resources: string[];
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  if (resources.length === 0) return null;
  
  return (
    <div className="p-5 bg-accent/40 rounded-xl">
      <h4 className="text-base font-medium flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5" /> Resources
      </h4>
      <ul className="list-none space-y-2">
        {resources.map((resource, i) => (
          <li key={i} className="text-base text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/70 flex-shrink-0"></div>
            <span className="flex-1">{resource}</span>
            <LinkIcon className="h-4 w-4 text-primary cursor-pointer hover:text-primary/80" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourcesList;
