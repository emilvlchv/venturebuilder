
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard from '@/components/journey/JourneyWizard';

const Journey = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Start Your Entrepreneurial Journey</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Our AI assistant will guide you through a few questions to create a personalized roadmap for your business.
            </p>
          </div>
          
          <JourneyWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journey;
