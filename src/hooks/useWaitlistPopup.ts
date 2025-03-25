
import { useState, useEffect } from 'react';

interface WaitlistPopupOptions {
  delay?: number;
  showOnce?: boolean;
  storageKey?: string;
}

export function useWaitlistPopup({
  delay = 4000,
  showOnce = true,
  storageKey = 'ventureway_waitlist_shown'
}: WaitlistPopupOptions = {}) {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Check if we should show the popup (if showOnce is true)
    if (showOnce) {
      const hasShown = localStorage.getItem(storageKey);
      if (hasShown) {
        return; // Don't show if it's been shown before
      }
    }
    
    // Set a timeout to show the popup after the delay
    const timer = setTimeout(() => {
      setOpen(true);
      
      // If showOnce is true, mark as shown in localStorage
      if (showOnce) {
        localStorage.setItem(storageKey, 'true');
      }
    }, delay);
    
    // Clear the timeout on component unmount
    return () => clearTimeout(timer);
  }, [delay, showOnce, storageKey]);
  
  // Function to manually close the popup
  const closePopup = () => {
    setOpen(false);
  };
  
  // Function to manually open the popup
  const openPopup = () => {
    setOpen(true);
    if (showOnce) {
      localStorage.setItem(storageKey, 'true');
    }
  };
  
  // Function called on successful submission
  const onSuccess = () => {
    // Additional logic can be added here
  };
  
  return {
    open,
    setOpen,
    closePopup,
    openPopup,
    onSuccess
  };
}
