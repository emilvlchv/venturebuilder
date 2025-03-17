
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BadgePlus, Check, ChevronRight, Clock, MoreHorizontal, PenLine, Plus, Trash2 } from 'lucide-react';
import { Journey } from './types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface JourneyManagerProps {
  onSelectJourney: (journeyId: string) => void;
}

const JourneyManager: React.FC<JourneyManagerProps> = ({ onSelectJourney }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [showNewJourneyDialog, setShowNewJourneyDialog] = useState(false);
  const [newJourney, setNewJourney] = useState({
    title: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Load journeys from local storage
  useEffect(() => {
    if (user?.id) {
      const storedJourneys = localStorage.getItem(`journeys_${user.id}`);
      if (storedJourneys) {
        try {
          const parsedJourneys = JSON.parse(storedJourneys);
          setJourneys(parsedJourneys);
        } catch (error) {
          console.error("Error loading journeys:", error);
          setJourneys([]);
        }
      } else {
        // If no journeys, check if there's existing business data to migrate
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.businessData) {
              // Create a default journey with the existing business data
              const defaultJourney: Journey = {
                id: uuidv4(),
                title: "My First Business Journey",
                description: parsedUser.businessData.businessIdea || "A journey to bring my business idea to life.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                businessIdeaData: parsedUser.businessData,
                status: 'active',
                progress: 15, // Default progress
              };
              setJourneys([defaultJourney]);
              saveJourneys([defaultJourney]);
            }
          } catch (error) {
            console.error("Error migrating existing business data:", error);
          }
        }
      }
    }
  }, [user?.id]);

  // Save journeys to local storage
  const saveJourneys = (updatedJourneys: Journey[]) => {
    if (user?.id) {
      localStorage.setItem(`journeys_${user.id}`, JSON.stringify(updatedJourneys));
    }
  };

  // Create a new journey
  const handleCreateJourney = () => {
    if (!newJourney.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your journey.",
        variant: "destructive"
      });
      return;
    }

    const journey: Journey = {
      id: uuidv4(),
      title: newJourney.title,
      description: newJourney.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      progress: 0
    };

    const updatedJourneys = [...journeys, journey];
    setJourneys(updatedJourneys);
    saveJourneys(updatedJourneys);
    
    setNewJourney({
      title: '',
      description: ''
    });
    
    setShowNewJourneyDialog(false);
    
    toast({
      title: "Journey Created",
      description: "Your new journey has been created successfully.",
    });

    // Select the new journey
    onSelectJourney(journey.id);
  };

  // Delete a journey
  const handleDeleteJourney = (id: string) => {
    const updatedJourneys = journeys.filter(journey => journey.id !== id);
    setJourneys(updatedJourneys);
    saveJourneys(updatedJourneys);
    
    toast({
      title: "Journey Deleted",
      description: "Your journey has been deleted successfully.",
    });
  };

  // Update a journey
  const handleUpdateJourney = (id: string, updates: Partial<Journey>) => {
    const updatedJourneys = journeys.map(journey => 
      journey.id === id ? { ...journey, ...updates, updatedAt: new Date().toISOString() } : journey
    );
    setJourneys(updatedJourneys);
    saveJourneys(updatedJourneys);
    
    setIsEditing(null);
    
    toast({
      title: "Journey Updated",
      description: "Your journey has been updated successfully.",
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return "Invalid date";
    }
  };

  // Render status badge
  const renderStatusBadge = (status: Journey['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><Clock className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500"><Check className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Business Journeys</h2>
        <Dialog open={showNewJourneyDialog} onOpenChange={setShowNewJourneyDialog}>
          <DialogTrigger asChild>
            <Button className="transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Create New Journey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Business Journey</DialogTitle>
              <DialogDescription>
                Start a new business journey to track your progress from idea to launch.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Journey Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., My Coffee Shop Business"
                  value={newJourney.title}
                  onChange={(e) => setNewJourney({ ...newJourney, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your business idea or goal..."
                  value={newJourney.description}
                  onChange={(e) => setNewJourney({ ...newJourney, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewJourneyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJourney}>
                Create Journey
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {journeys.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BadgePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Journeys Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Start your first business journey to track your progress from idea to launch with personalized steps and resources.
            </p>
            <Button onClick={() => setShowNewJourneyDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Journey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <Card key={journey.id} className="overflow-hidden transition-all hover:shadow-md">
              {isEditing === journey.id ? (
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`edit-title-${journey.id}`} className="text-sm font-medium">
                        Journey Title
                      </label>
                      <Input
                        id={`edit-title-${journey.id}`}
                        value={journey.title}
                        onChange={(e) => setJourneys(journeys.map(j => 
                          j.id === journey.id ? { ...j, title: e.target.value } : j
                        ))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`edit-desc-${journey.id}`} className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id={`edit-desc-${journey.id}`}
                        value={journey.description}
                        onChange={(e) => setJourneys(journeys.map(j => 
                          j.id === journey.id ? { ...j, description: e.target.value } : j
                        ))}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateJourney(journey.id, {
                        title: journey.title,
                        description: journey.description
                      })}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{journey.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setIsEditing(journey.id)}>
                            <PenLine className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteJourney(journey.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStatusBadge(journey.status)}
                      <span className="text-xs text-muted-foreground">
                        Created: {formatDate(journey.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-2">
                      {journey.description || "No description provided."}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mb-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${journey.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">
                      {journey.progress}% complete
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => onSelectJourney(journey.id)}
                    >
                      Continue Journey <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyManager;
