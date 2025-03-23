
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
      <h2 className="h3 mb-4">Find Your Entrepreneur Type</h2>
      <p className="text-muted-foreground mb-6">
        Learn about your unique strengths and ideal business model by taking
        our quick personality assessment designed specifically for founders.
      </p>
      
      <div className="flex-grow">
        <EntrepreneurQuiz />
      </div>
    </div>
  );
};

export default EntrepreneurTypeSection;
