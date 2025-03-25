
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import BusinessIdeaGenerator from '@/components/idea-generator/BusinessIdeaGenerator';
import EntrepreneurTypeSection from '@/components/home/EntrepreneurTypeSection';
import AutoWaitlistPopup from '@/components/waitlist/AutoWaitlistPopup';
import WaitlistButton from '@/components/waitlist/WaitlistButton';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  
  // Admin redirect logic
  const fromAdmin = location.state?.fromAdmin === true;
  const shouldRedirect = isAuthenticated && isAdmin && !fromAdmin;
  
  if (shouldRedirect) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Waitlist Call to Action Section */}
        <section className="py-16 bg-brand-secondary">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="h3 mb-6">Ready to start your entrepreneurial journey?</h2>
            <WaitlistButton size="lg" className="shadow-md">Join the Waitlist →</WaitlistButton>
          </div>
        </section>
        
        {/* Interactive Tools Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="h2 mb-4">Interactive Tools for Entrepreneurs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Use our interactive tools to discover your entrepreneur type and generate 
                business ideas tailored to your unique strengths and interests.
              </p>
            </div>
            
            {/* Grid layout for the two components side by side with clear visual separation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Entrepreneur Type Quiz Section */}
              <div id="entrepreneur-quiz" className="scroll-mt-20 bg-white p-6 rounded-xl shadow-sm border border-border/50">
                <EntrepreneurTypeSection />
              </div>
              
              {/* Visual separator for mobile view */}
              <div className="block lg:hidden my-4">
                <Separator className="bg-border/50" />
              </div>
              
              {/* Business Idea Generator Section */}
              <div id="idea-generator" className="scroll-mt-20 bg-white p-6 rounded-xl shadow-sm border border-border/50">
                <BusinessIdeaGenerator />
              </div>
            </div>
          </div>
        </section>
        
        {/* Admin welcome message */}
        {isAdmin && fromAdmin && (
          <div className="container mx-auto px-4 sm:px-6 my-8">
            <Alert className="bg-primary/5 border-primary/20">
              <AlertTitle className="text-xl font-bold text-primary">
                Welcome to the Main Site, Administrator
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                You are currently viewing the main site as an administrator. You can return to your
                admin dashboard using the "Admin Panel" button in the navigation bar.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </main>
      <Footer />
      
      {/* Auto-popup waitlist form */}
      <AutoWaitlistPopup delay={5000} showOnce={true} />
    </div>
  );
};

export default Index;
