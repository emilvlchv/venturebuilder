
import React, { useState } from 'react';
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type BusinessIdea = {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
};

export function BusinessIdeaMenu() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<BusinessIdea[]>(() => {
    // Initialize with user's business idea if available
    if (user?.businessIdea) {
      return [{
        id: '1',
        name: user.businessIdea,
        description: 'Your main business idea',
        industry: 'Technology',
        stage: 'Concept'
      }];
    }
    return [];
  });
  
  const [newIdea, setNewIdea] = useState({
    name: '',
    description: '',
    industry: '',
    stage: 'Concept'
  });
  
  const [isAdding, setIsAdding] = useState(false);

  const handleDeleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
    toast({
      title: "Idea deleted",
      description: "Your business idea has been removed.",
    });
  };

  const handleAddIdea = () => {
    if (!newIdea.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for your business idea.",
        variant: "destructive"
      });
      return;
    }

    const id = Date.now().toString();
    setIdeas([...ideas, { id, ...newIdea }]);
    setNewIdea({
      name: '',
      description: '',
      industry: '',
      stage: 'Concept'
    });
    setIsAdding(false);
    
    toast({
      title: "Idea added",
      description: "Your new business idea has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Business Ideas</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Idea
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Business Idea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Business Name
                </label>
                <Input
                  id="name"
                  value={newIdea.name}
                  onChange={(e) => setNewIdea({ ...newIdea, name: e.target.value })}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  placeholder="Describe your business idea"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="industry">
                  Industry
                </label>
                <Input
                  id="industry"
                  value={newIdea.industry}
                  onChange={(e) => setNewIdea({ ...newIdea, industry: e.target.value })}
                  placeholder="e.g. Technology, Food, Retail"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddIdea}>Save Idea</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {ideas.length === 0 && !isAdding ? (
          <div className="text-center py-10 text-muted-foreground">
            <Briefcase className="mx-auto h-12 w-12 opacity-20 mb-3" />
            <p>You don't have any business ideas yet.</p>
            <p>Click "New Idea" to get started!</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <Card key={idea.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium">{idea.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {idea.industry && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {idea.industry}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-secondary rounded text-xs">
                          {idea.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
