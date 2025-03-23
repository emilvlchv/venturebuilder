
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BusinessIdeaCardProps {
  idea: {
    title: string;
    description: string;
    tags: string[];
  };
  className?: string;
}

export const BusinessIdeaCard = ({ idea, className }: BusinessIdeaCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden border-2 hover:border-primary/20 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{idea.title}</CardTitle>
        <CardDescription>{idea.description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        {idea.tags.map((tag, index) => (
          <Badge 
            key={index}
            variant={index % 2 === 0 ? "secondary" : "outline"}
            className="font-normal"
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};
