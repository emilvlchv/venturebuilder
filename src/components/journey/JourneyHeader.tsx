
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessIdeaData } from '@/components/journey/types';
import { useNavigate } from 'react-router-dom';

interface JourneyHeaderProps {
  title: string;
  description: string;
  businessData: BusinessIdeaData | null;
}

const JourneyHeader: React.FC<JourneyHeaderProps> = ({ 
  title, 
  description, 
  businessData 
}) => {
  const navigate = useNavigate();

  const handleBackToJourneys = () => {
    navigate('/journey');
  };

  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={handleBackToJourneys}
        className="text-primary hover:underline flex items-center mb-4"
      >
        ← Back to All Journeys
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="h2 mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {businessData ? (
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Your Business Idea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Business Concept</h3>
                <p className="text-muted-foreground">{businessData.businessIdea || businessData.solution || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium">Target Customers</h3>
                <p className="text-muted-foreground">{businessData.targetCustomers || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium">Team Composition</h3>
                <p className="text-muted-foreground">{businessData.teamComposition || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium">Team Strengths</h3>
                <p className="text-muted-foreground">{businessData.teamStrengths || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium">Team Weaknesses</h3>
                <p className="text-muted-foreground">{businessData.teamWeaknesses || "Not specified"}</p>
              </div>
              {businessData.revenueModel && (
                <div>
                  <h3 className="font-medium">Revenue Model</h3>
                  <p className="text-muted-foreground">{businessData.revenueModel || "Not specified"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-10">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No business data available yet. Complete the initial questionnaire to see your personalized journey.</p>
            <Button className="mt-4" onClick={() => navigate('/journey/new')}>
              Create Your Business Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneyHeader;
