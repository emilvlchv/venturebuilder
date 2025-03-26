
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import WaitlistForm from './WaitlistForm';
import { cn } from '@/lib/utils';

interface WaitlistButtonProps extends ButtonProps {
  text?: string;
  className?: string;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({ 
  text = "Join the Waitlist", 
  className,
  ...props 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn("bg-brand-accent hover:bg-brand-accent/90", className)}
        data-gtm-category="Waitlist"
        data-gtm-action="click"
        data-gtm-label="Join Waitlist Button"
        {...props}
      >
        {text}
      </Button>
      
      <WaitlistForm 
        open={open} 
        onOpenChange={setOpen}
      />
    </>
  );
};

export default WaitlistButton;
