
import React, { useState, useEffect } from 'react';
import { PlusCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { Journey } from './types';

interface JourneyManagerProps {
  onSelectJourney: (journeyId: string) => void;
}

const JourneyManager: React.FC<JourneyManagerProps> = ({ onSelectJourney }) => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, [user?.id]);

  const loadJourneys = () => {
    setIsLoading(true);
    
    if (user?.id) {
      try {
        const journeysKey = `journeys_${user.id}`;
        const storedJourneys = localStorage.getItem(journeysKey);
        
        if (storedJourneys) {
          setJourneys(JSON.parse(storedJourneys));
        } else {
          // Initialize with empty array if no journeys found
          localStorage.setItem(journeysKey, JSON.stringify([]));
          setJourneys([]);
        }
      } catch (error) {
        console.error("Error loading journeys:", error);
        setJourneys([]);
      }
    } else {
      // For demo purposes when there's no authenticated user
      setJourneys([
        {
          id: 'demo-journey-1',
          title: "Demo Journey",
          description: "This is a demo journey for exploration",
          progress: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }
    
    setIsLoading(false);
  };

  const handleCreateJourney = () => {
    if (user?.id) {
      try {
        const newJourneyId = uuidv4();
        const newJourney: Journey = {
          id: newJourneyId,
          title: "New Business Journey",
          description: "A personalized roadmap to help you turn your business idea into reality.",
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const journeysKey = `journeys_${user.id}`;
        const updatedJourneys = [...journeys, newJourney];
        
        localStorage.setItem(journeysKey, JSON.stringify(updatedJourneys));
        setJourneys(updatedJourneys);
        
        // Automatically select the new journey
        onSelectJourney(newJourneyId);
      } catch (error) {
        console.error("Error creating journey:", error);
      }
    } else {
      // For demo without authentication
      const newJourneyId = uuidv4();
      onSelectJourney(newJourneyId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Journeys</h2>
        <Button onClick={handleCreateJourney} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>New Journey</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : journeys.length === 0 ? (
        <Card className="border-dashed border-2 p-6 text-center">
          <CardHeader>
            <CardTitle>No Journeys Yet</CardTitle>
            <CardDescription>
              Start your first entrepreneurial journey by clicking the "New Journey" button.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateJourney} className="mt-4">
              Create First Journey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <Card 
              key={journey.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectJourney(journey.id)}
            >
              <CardHeader>
                <CardTitle className="text-xl flex justify-between items-start">
                  <span>{journey.title}</span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {journey.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{journey.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${journey.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(journey.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card 
            className="border-dashed border-2 flex flex-col justify-center items-center p-6 h-full min-h-[200px] hover:bg-accent/5 transition-colors cursor-pointer"
            onClick={handleCreateJourney}
          >
            <PlusCircle size={32} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Create a new journey</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JourneyManager;
