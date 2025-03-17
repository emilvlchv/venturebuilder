
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard, { BusinessIdeaData } from '@/components/journey/JourneyWizard';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { PenLine } from 'lucide-react';
import Button from '@/components/shared/Button';
import { useToast } from '@/hooks/use-toast';

const Journey = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasCompletedInitialChat, setHasCompletedInitialChat] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessIdeaData | null>(null);
  const [editingField, setEditingField] = useState<keyof BusinessIdeaData | null>(null);
  const [editValue, setEditValue] = useState('');

  // Load user data on component mount
  useEffect(() => {
    if (user?.id) {
      // Check if user has completed the initial chat
      const completedChat = localStorage.getItem(`journey_initial_chat_${user.id}`) === 'completed';
      setHasCompletedInitialChat(completedChat);
      
      // Load business data if available
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.businessData) {
          setBusinessData(currentUser.businessData);
        }
      } catch (error) {
        console.error("Error loading business data:", error);
      }
    }
  }, [user?.id]);

  const handleJourneyComplete = () => {
    console.log("Journey complete callback triggered");
    // Mark initial chat as completed when user finishes
    if (user?.id) {
      localStorage.setItem(`journey_initial_chat_${user.id}`, 'completed');
    }
    setHasCompletedInitialChat(true);
    
    // Reload business data
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.businessData) {
        setBusinessData(currentUser.businessData);
      }
    } catch (error) {
      console.error("Error loading updated business data:", error);
    }
  };

  const handleEditClick = (field: keyof BusinessIdeaData) => {
    if (businessData) {
      setEditingField(field);
      setEditValue(businessData[field] as string);
    }
  };

  const handleSaveEdit = () => {
    if (!editingField || !businessData) return;
    
    try {
      // Create updated business data
      const updatedBusinessData = {
        ...businessData,
        [editingField]: editValue
      };
      
      // Update in state
      setBusinessData(updatedBusinessData);
      
      // Save to localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.businessData = updatedBusinessData;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Update users array if needed
      if (user?.id) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].businessData = updatedBusinessData;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
      
      toast({
        title: "Update Successful",
        description: "Your business information has been updated."
      });
      
      // Reset editing state
      setEditingField(null);
    } catch (error) {
      console.error("Error updating business data:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const renderFieldContent = (field: keyof BusinessIdeaData, label: string) => {
    if (!businessData) return null;
    
    const displayValue = businessData[field] as string;
    const isEditing = editingField === field;
    
    return (
      <div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {!isEditing && (
            <Button 
              onClick={() => handleEditClick(field)}
              variant="ghost" 
              size="sm"
              icon={<PenLine size={14} />}
              aria-label={`Edit ${label.toLowerCase()}`}
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[80px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p>{displayValue}</p>
        )}
      </div>
    );
  };

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
          
          {hasCompletedInitialChat ? (
            <SubscriptionCheck>
              {/* This content is only shown to users with subscriptions */}
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Personalized Journey</h2>
                <p className="text-center mb-8">
                  Based on your business idea, we've created a personalized roadmap to help you succeed.
                </p>
                
                {businessData && (
                  <div className="space-y-6 mb-10">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4">Your Business Summary</h3>
                        <div className="space-y-4">
                          {renderFieldContent('businessIdea', 'Business Idea')}
                          {renderFieldContent('teamComposition', 'Team Composition')}
                          {renderFieldContent('teamStrengths', 'Team Strengths')}
                          {renderFieldContent('teamWeaknesses', 'Areas for Improvement')}
                          {renderFieldContent('targetCustomers', 'Target Customers')}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="glass rounded-2xl p-6 md:p-8">
                  <p className="text-center text-lg mb-4">Your personalized journey is ready!</p>
                  {/* Additional journey content */}
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Next steps for your entrepreneurial journey:</h3>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                      <li>Complete your business plan with our AI-powered templates</li>
                      <li>Research your market and competitors</li>
                      <li>Define your unique value proposition</li>
                      <li>Set up your legal structure and financial foundation</li>
                      <li>Create your marketing strategy</li>
                    </ol>
                    <p className="mt-4">Click on any step to begin, or use our AI assistant to guide you through the process.</p>
                  </div>
                </div>
              </div>
            </SubscriptionCheck>
          ) : (
            /* This is shown to all users - the initial chat to get their business idea */
            <JourneyWizard onComplete={handleJourneyComplete} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journey;
