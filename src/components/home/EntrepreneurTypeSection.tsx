
import React from 'react';
import EntrepreneurQuiz from '../quiz/EntrepreneurQuiz';
import { Rocket } from 'lucide-react';

const EntrepreneurTypeSection = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
        <Rocket size={16} className="mr-2" />
        Discover Your Entrepreneurial Style
      </div>
      
      <div className="flex-grow">
        <EntrepreneurQuiz />
      </div>
    </div>
  );
};

export default EntrepreneurTypeSection;
