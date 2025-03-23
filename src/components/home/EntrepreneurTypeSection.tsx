
import React from 'react';
import EntrepreneurQuiz from '../quiz/EntrepreneurQuiz';
import { Rocket } from 'lucide-react';

const EntrepreneurTypeSection = () => {
  return (
    <section id="entrepreneur-quiz" className="py-16 md:py-24 bg-secondary/30 scroll-mt-20">
      <div className="container-padding">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Rocket size={16} className="mr-2" />
            Discover Your Entrepreneurial Style
          </div>
          <h2 className="h2 mb-4">Find Your Entrepreneur Type</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn about your unique strengths and ideal business model by taking
            our quick personality assessment designed specifically for founders.
          </p>
        </div>
        
        <EntrepreneurQuiz />
      </div>
    </section>
  );
};

export default EntrepreneurTypeSection;
