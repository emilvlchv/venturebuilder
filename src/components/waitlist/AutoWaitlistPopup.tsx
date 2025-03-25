
import React from 'react';
import WaitlistForm from './WaitlistForm';
import { useWaitlistPopup } from '@/hooks/useWaitlistPopup';

interface AutoWaitlistPopupProps {
  delay?: number;
  showOnce?: boolean;
}

const AutoWaitlistPopup: React.FC<AutoWaitlistPopupProps> = ({ 
  delay = 4000,
  showOnce = true 
}) => {
  const { open, setOpen, onSuccess } = useWaitlistPopup({
    delay,
    showOnce
  });

  return (
    <WaitlistForm 
      open={open} 
      onOpenChange={setOpen}
      onSuccess={onSuccess}
    />
  );
};

export default AutoWaitlistPopup;
