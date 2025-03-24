
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import JourneyManager from '@/components/journey/JourneyManager';
import CurrentJourneyView from './CurrentJourneyView';
import AIChatAssistant from '@/components/journey/AIChatAssistant';
import { useJourneySelection } from './useJourneySelection';
import StepDetailsDialog from '@/components/journey/StepDetailsDialog';

const JourneyPage = () => {
  const { 
    selectedJourneyId, 
    selectedJourney, 
    hasCompletedInitialChat,
    isDialogOpen,
    selectedStep,
    handleJourneySelect,
    handleJourneyComplete,
    handleCloseDialog
  } = useJourneySelection();

  return (
    <Layout>
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="h2 mb-4 animate-fade-in">Your Entrepreneurial Journey</h1>
          <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
            Create and manage multiple business journeys to bring your ideas to life.
          </p>
        </div>
        
        <SubscriptionCheck>
          <div className="max-w-6xl mx-auto">
            {!selectedJourneyId || !selectedJourney ? (
              <div className="mb-10">
                <JourneyManager onSelectJourney={handleJourneySelect} />
              </div>
            ) : (
              <CurrentJourneyView
                selectedJourneyId={selectedJourneyId}
                selectedJourney={selectedJourney}
                hasCompletedInitialChat={hasCompletedInitialChat}
                onJourneyComplete={handleJourneyComplete}
                onSelectJourney={handleJourneySelect}
              />
            )}
          </div>
        </SubscriptionCheck>
      </div>
      
      <StepDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        stepDetails={selectedStep} 
      />
      
      <AIChatAssistant 
        journeyId={selectedJourneyId} 
        businessData={selectedJourney?.businessIdeaData}
      />
    </Layout>
  );
};

export default JourneyPage;
