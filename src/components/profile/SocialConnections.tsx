
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users, Search, MessageSquare, UserPlus } from 'lucide-react';

// Mock data - in a real app, this would come from your backend
const CONNECTIONS = [
  {
    id: 'user1',
    name: 'Emily Johnson',
    username: 'emilyjohnson',
    businessIdea: 'Sustainable eco-friendly packaging solutions',
    avatarUrl: '',
    industry: 'Manufacturing',
    connected: true,
  },
  {
    id: 'user2',
    name: 'Michael Chen',
    username: 'mikechen',
    businessIdea: 'AI-powered financial advisory platform',
    avatarUrl: '',
    industry: 'Finance',
    connected: true,
  },
  {
    id: 'user3',
    name: 'Sara Rodriguez',
    username: 'sararod',
    businessIdea: 'Virtual reality education platform',
    avatarUrl: '',
    industry: 'Education',
    connected: true,
  },
];

const SUGGESTED_CONNECTIONS = [
  {
    id: 'user4',
    name: 'David Kim',
    username: 'davidkim',
    businessIdea: 'On-demand healthcare services app',
    avatarUrl: '',
    industry: 'Healthcare',
    connected: false,
  },
  {
    id: 'user5',
    name: 'Priya Patel',
    username: 'priyapatel',
    businessIdea: 'Personalized nutrition meal planning',
    avatarUrl: '',
    industry: 'Food & Beverage',
    connected: false,
  },
  {
    id: 'user6',
    name: 'James Wilson',
    username: 'jameswilson',
    businessIdea: 'Smart home energy management system',
    avatarUrl: '',
    industry: 'Technology',
    connected: false,
  },
];

export default function SocialConnections() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('connections');

  // Filter connections based on search term
  const filteredConnections = CONNECTIONS.filter(
    connection => 
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.businessIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter suggested connections based on search term
  const filteredSuggestions = SUGGESTED_CONNECTIONS.filter(
    connection => 
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.businessIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and statistics section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search entrepreneurs by name, business idea, or industry..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" /> 
                Your Network
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold">{CONNECTIONS.length}</div>
              <p className="text-xs text-muted-foreground">Connections</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections">
            <Users className="h-4 w-4 mr-2" />
            My Connections
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <UserPlus className="h-4 w-4 mr-2" />
            Suggested Connections
          </TabsTrigger>
        </TabsList>
        
        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4 mt-6">
          {filteredConnections.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No connections found</h3>
              <p className="text-sm">Try a different search term or connect with new entrepreneurs</p>
            </div>
          ) : (
            filteredConnections.map(connection => (
              <Card key={connection.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatarUrl} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{connection.name}</h3>
                          <p className="text-sm text-muted-foreground">@{connection.username}</p>
                        </div>
                        <Badge variant="outline">{connection.industry}</Badge>
                      </div>
                      <p className="text-sm mt-2">{connection.businessIdea}</p>
                    </div>
                    <div className="flex gap-2 self-end md:self-center mt-2 md:mt-0">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="destructive">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4 mt-6">
          {filteredSuggestions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No suggestions found</h3>
              <p className="text-sm">Try a different search term or check back later</p>
            </div>
          ) : (
            filteredSuggestions.map(suggestion => (
              <Card key={suggestion.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={suggestion.avatarUrl} alt={suggestion.name} />
                      <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{suggestion.name}</h3>
                          <p className="text-sm text-muted-foreground">@{suggestion.username}</p>
                        </div>
                        <Badge variant="outline">{suggestion.industry}</Badge>
                      </div>
                      <p className="text-sm mt-2">{suggestion.businessIdea}</p>
                    </div>
                    <div className="self-end md:self-center mt-2 md:mt-0">
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
