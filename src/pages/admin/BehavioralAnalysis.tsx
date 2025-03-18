
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  MousePointer, 
  Eye, 
  Clock, 
  Users,
  Heart,
  MapPin,
  Search,
  MessageSquare,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Area, 
  AreaChart,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for demos
const pageViewData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const userSessionData = [
  { name: '1-3 min', value: 2400 },
  { name: '3-5 min', value: 4567 },
  { name: '5-10 min', value: 1398 },
  { name: '10-15 min', value: 9800 },
  { name: '15+ min', value: 3908 },
];

const featureUsageData = [
  { name: 'Journey', value: 400 },
  { name: 'Education', value: 300 },
  { name: 'Community', value: 300 },
  { name: 'AI Assistant', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const userBehaviorTrends = [
  { date: 'Mon', pageViews: 140, engagement: 80, conversion: 40 },
  { date: 'Tue', pageViews: 180, engagement: 100, conversion: 45 },
  { date: 'Wed', pageViews: 220, engagement: 110, conversion: 50 },
  { date: 'Thu', pageViews: 250, engagement: 170, conversion: 70 },
  { date: 'Fri', pageViews: 280, engagement: 150, conversion: 60 },
  { date: 'Sat', pageViews: 240, engagement: 140, conversion: 55 },
  { date: 'Sun', pageViews: 190, engagement: 120, conversion: 50 },
];

const BehavioralAnalysis = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [userSegment, setUserSegment] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Behavioral Analysis</h1>
          <p className="text-muted-foreground">
            Analyze how users interact with your platform to improve user experience
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={userSegment} onValueChange={setUserSegment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select user segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
              <SelectItem value="returning">Returning Users</SelectItem>
              <SelectItem value="premium">Premium Subscribers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,578</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12m 48s</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.2%</div>
            <p className="text-xs text-muted-foreground">
              +4.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7%</div>
            <p className="text-xs text-muted-foreground">
              +1.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journey">Journey Analysis</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>User Activity Over Time</CardTitle>
                <CardDescription>
                  Daily active users and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={userBehaviorTrends}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="pageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="conversion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="pageViews" stroke="#8884d8" fillOpacity={1} fill="url(#pageViews)" />
                    <Area type="monotone" dataKey="engagement" stroke="#82ca9d" fillOpacity={1} fill="url(#engagement)" />
                    <Area type="monotone" dataKey="conversion" stroke="#ffc658" fillOpacity={1} fill="url(#conversion)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Feature Usage Distribution</CardTitle>
                <CardDescription>
                  Most popular features by usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={featureUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {featureUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Distribution</CardTitle>
                <CardDescription>
                  How long users spend on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userSessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Behavior Insights</CardTitle>
                <CardDescription>
                  Key behavioral patterns detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg border border-border">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      <Heart size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">High Engagement Content</h4>
                      <p className="text-xs text-muted-foreground">Business plan templates and idea validation resources show highest user engagement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg border border-border">
                    <div className="p-2 rounded-full bg-yellow-500/10 mr-3">
                      <Eye size={18} className="text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Drop-off Points</h4>
                      <p className="text-xs text-muted-foreground">26% of users leave during the financial planning stage of the journey</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg border border-border">
                    <div className="p-2 rounded-full bg-green-500/10 mr-3">
                      <TrendingUp size={18} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Conversion Trigger</h4>
                      <p className="text-xs text-muted-foreground">Users who interact with AI assistant are 3.2x more likely to subscribe</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Detailed Analysis</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journey Progression Analysis</CardTitle>
              <CardDescription>User advancement through the business development journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Journey analysis detailed metrics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Detailed engagement measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Engagement analysis detailed metrics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Path Analysis</CardTitle>
              <CardDescription>User journeys that lead to conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Conversion path analysis detailed metrics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralAnalysis;
