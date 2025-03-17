
import React from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({ className }) => {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      Skip to content
    </a>
  );
};
