
import React from 'react';

interface BackToJourneysButtonProps {
  onBack: () => void;
}

const BackToJourneysButton: React.FC<BackToJourneysButtonProps> = ({ onBack }) => {
  return (
    <button 
      onClick={onBack}
      className="text-primary hover:underline flex items-center"
    >
      ← Back to All Journeys
    </button>
  );
};

export default BackToJourneysButton;
