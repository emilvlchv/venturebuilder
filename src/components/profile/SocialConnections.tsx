
import React, { useState } from 'react';
import { Users, Search, UserPlus, MessageSquare, X, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type Connection = {
  id: string;
  name: string;
  username: string;
  businessIdea: string;
  avatar?: string;
  connected: boolean;
};

export function SocialConnections() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Sample connections data
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      username: 'alexj',
      businessIdea: 'Sustainable packaging solutions',
      avatar: '',
      connected: true
    },
    {
      id: '2',
      name: 'Maria Garcia',
      username: 'mariag',
      businessIdea: 'Health & wellness app',
      avatar: '',
      connected: true
    },
    {
      id: '3',
      name: 'James Wilson',
      username: 'jwilson',
      businessIdea: 'Fintech startup',
      avatar: '',
      connected: false
    }
  ]);
  
  // Sample suggested connections
  const [suggestions, setSuggestions] = useState<Connection[]>([
    {
      id: '4',
      name: 'Samantha Lee',
      username: 'slee',
      businessIdea: 'Education technology platform',
      avatar: '',
      connected: false
    },
    {
      id: '5',
      name: 'Robert Chen',
      username: 'robchen',
      businessIdea: 'E-commerce for handmade goods',
      avatar: '',
      connected: false
    },
    {
      id: '6',
      name: 'Emily Davis',
      username: 'emilyd',
      businessIdea: 'AI-powered marketing tools',
      avatar: '',
      connected: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  
  const myConnections = connections.filter(c => c.connected);
  
  const handleConnect = (id: string) => {
    // Update suggestions
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, connected: true } : s
    ));
    
    // Move from suggestions to connections
    const connection = suggestions.find(s => s.id === id);
    if (connection) {
      setConnections([...connections, { ...connection, connected: true }]);
      
      toast({
        title: "Connection added",
        description: `You've connected with ${connection.name}.`,
      });
    }
  };
  
  const handleDisconnect = (id: string) => {
    setConnections(connections.map(c => 
      c.id === id ? { ...c, connected: false } : c
    ));
    
    toast({
      title: "Connection removed",
      description: "Connection has been removed from your network.",
    });
  };
  
  const handleViewProfile = (connection: Connection) => {
    setSelectedConnection(connection);
  };
  
  const handleMessage = (connection: Connection) => {
    toast({
      title: "Messaging coming soon",
      description: `Messaging feature is under development.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Network</h2>
        <div className="text-sm font-medium">
          <span className="text-primary">{myConnections.length}</span>
          <span className="text-muted-foreground"> connections</span>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search connections..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Connections */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Connections</CardTitle>
          </CardHeader>
          <CardContent>
            {myConnections.length > 0 ? (
              <div className="space-y-4">
                {myConnections.map(connection => (
                  <div key={connection.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{connection.name.slice(0, 2)}</AvatarFallback>
                        {connection.avatar && <AvatarImage src={connection.avatar} />}
                      </Avatar>
                      <div>
                        <div className="font-medium">{connection.name}</div>
                        <div className="text-sm text-muted-foreground">@{connection.username}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewProfile(connection)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleMessage(connection)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDisconnect(connection.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-20 mb-3" />
                <p>You don't have any connections yet.</p>
                <p>Connect with other entrepreneurs to grow your network!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Suggestions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.filter(s => !s.connected).map(suggestion => (
                <div key={suggestion.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{suggestion.name.slice(0, 2)}</AvatarFallback>
                      {suggestion.avatar && <AvatarImage src={suggestion.avatar} />}
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{suggestion.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {suggestion.businessIdea}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-xs"
                    onClick={() => handleConnect(suggestion.id)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
              
              {suggestions.filter(s => !s.connected).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No more suggestions right now</p>
                  <p className="text-sm">Check back later!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Selected profile details */}
      {selectedConnection && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Profile Details</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setSelectedConnection(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">{selectedConnection.name.slice(0, 2)}</AvatarFallback>
                {selectedConnection.avatar && <AvatarImage src={selectedConnection.avatar} />}
              </Avatar>
              
              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-semibold">{selectedConnection.name}</h3>
                  <p className="text-muted-foreground">@{selectedConnection.username}</p>
                </div>
                
                <div>
                  <Badge variant="outline" className="mr-2">Entrepreneur</Badge>
                  <Badge variant="secondary">New Member</Badge>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium">Business Idea</h4>
                  <p className="text-sm text-muted-foreground">{selectedConnection.businessIdea}</p>
                </div>
              </div>
              
              <div className="sm:ml-auto space-y-2 flex flex-col items-end">
                <Button onClick={() => handleMessage(selectedConnection)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                
                {selectedConnection.connected ? (
                  <Button variant="outline" onClick={() => handleDisconnect(selectedConnection.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => handleConnect(selectedConnection.id)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
