
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import JourneyWizard from '@/components/journey/JourneyWizard';
import { Journey } from '@/components/journey/types';
import JourneyProgress from './JourneyProgress';
import BackToJourneysButton from './BackToJourneysButton';

interface CurrentJourneyViewProps {
  selectedJourneyId: string;
  selectedJourney: Journey;
  hasCompletedInitialChat: boolean;
  onJourneyComplete: (data: any) => void;
  onSelectJourney: (journeyId: string) => void;
}

const CurrentJourneyView: React.FC<CurrentJourneyViewProps> = ({
  selectedJourneyId,
  selectedJourney,
  hasCompletedInitialChat,
  onJourneyComplete,
  onSelectJourney
}) => {
  const navigate = useNavigate();

  const handleViewJourneyDetails = () => {
    if (selectedJourneyId) {
      const journeyDetailsPath = `/journey-details/${selectedJourneyId}`;
      console.log("Navigating to:", journeyDetailsPath);
      navigate(journeyDetailsPath);
    }
  };

  return (
    <>
      <div className="mb-6">
        <BackToJourneysButton onBack={() => onSelectJourney("")} />
      </div>
      
      <JourneyProgress 
        title={selectedJourney.title} 
        description={selectedJourney.description} 
        progress={selectedJourney.progress}
      />
      
      {!hasCompletedInitialChat ? (
        <JourneyWizard 
          onComplete={onJourneyComplete} 
          journeyId={selectedJourneyId}
        />
      ) : (
        <div className="text-center">
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Journey in Progress</h3>
            <p className="mb-6">
              Your journey is underway! View the detailed steps and progress in the Journey Details page.
            </p>
            <Button 
              onClick={handleViewJourneyDetails}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              View Journey Details
            </Button>
          </Card>
        </div>
      )}
    </>
  );
};

export default CurrentJourneyView;
