
import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AiAssistancePopoverProps {
  taskTitle: string;
  businessIdea?: string;
}

const AiAssistancePopover: React.FC<AiAssistancePopoverProps> = ({ 
  taskTitle,
  businessIdea 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assistanceText, setAssistanceText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getAiAssistance = () => {
    setIsLoading(true);
    
    // Simulate API call for AI assistance
    setTimeout(() => {
      // Generate contextual advice based on task title and business idea
      const advice = generateAdvice(taskTitle, businessIdea);
      setAssistanceText(advice);
      setIsLoading(false);
    }, 1500);
  };

  const generateAdvice = (task: string, business?: string) => {
    const businessContext = business ? 
      `For your ${business} business, ` : 
      'For your business idea, ';
    
    // Map common task titles to specific advice
    if (task.toLowerCase().includes('market research')) {
      return `${businessContext}consider researching competitors, identifying your target audience, and analyzing market trends. Focus on understanding customer pain points and how your solution addresses them better than alternatives.`;
    } else if (task.toLowerCase().includes('business plan')) {
      return `${businessContext}your business plan should clearly articulate your value proposition, revenue model, and go-to-market strategy. Include financial projections and resource requirements.`;
    } else if (task.toLowerCase().includes('marketing')) {
      return `${businessContext}develop a marketing strategy that resonates with your target audience. Consider digital marketing channels, content strategy, and metrics to measure success.`;
    } else if (task.toLowerCase().includes('legal') || task.toLowerCase().includes('compliance')) {
      return `${businessContext}ensure you understand the regulatory requirements for your industry. Consider consulting with a legal expert about business structure, contracts, and intellectual property protection.`;
    } else if (task.toLowerCase().includes('finance') || task.toLowerCase().includes('funding')) {
      return `${businessContext}explore different funding options such as bootstrapping, angel investors, venture capital, or loans. Prepare a detailed financial model showing projected revenues and expenses.`;
    }
    
    // Generic advice for other task types
    return `${businessContext}approach this task methodically by breaking it down into smaller steps. Research best practices in your industry and consider consulting with mentors or experts in this area.`;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !assistanceText) {
      getAiAssistance();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 p-0 group transition-colors"
          aria-label="Get AI assistance for this task"
        >
          <Lightbulb 
            className="h-5 w-5 group-hover:text-yellow-400 transition-colors" 
            strokeWidth={1.5}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 shadow-lg"
        align="center"
        side="top"
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            AI Assistant Tip
          </h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Generating advice...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{assistanceText}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiAssistancePopover;
