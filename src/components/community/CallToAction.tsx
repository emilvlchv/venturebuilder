
import React from 'react';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <p className="mb-4 text-muted-foreground">Have something to share with the community?</p>
      <Button variant="default">Start a Discussion</Button>
    </div>
  );
};

export default CallToAction;
