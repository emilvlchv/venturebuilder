
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart, LineChart, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart as RechartsLineChart, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for charts
  const userRegistrationData = [
    { date: 'Jan', users: 120 },
    { date: 'Feb', users: 150 },
    { date: 'Mar', users: 180 },
    { date: 'Apr', users: 210 },
    { date: 'May', users: 250 },
    { date: 'Jun', users: 300 },
    { date: 'Jul', users: 340 },
    { date: 'Aug', users: 380 },
    { date: 'Sep', users: 420 },
    { date: 'Oct', users: 460 },
    { date: 'Nov', users: 500 },
    { date: 'Dec', users: 550 },
  ];

  const taskCompletionData = [
    { name: 'Jan', value: 235 },
    { name: 'Feb', value: 290 },
    { name: 'Mar', value: 310 },
    { name: 'Apr', value: 350 },
    { name: 'May', value: 400 },
    { name: 'Jun', value: 430 },
    { name: 'Jul', value: 470 },
    { name: 'Aug', value: 510 },
    { name: 'Sep', value: 550 },
    { name: 'Oct', value: 590 },
    { name: 'Nov', value: 630 },
    { name: 'Dec', value: 670 },
  ];

  const userActivityData = [
    { name: 'Mon', active: 400, new: 24 },
    { name: 'Tue', active: 300, new: 13 },
    { name: 'Wed', active: 520, new: 29 },
    { name: 'Thu', active: 450, new: 34 },
    { name: 'Fri', active: 380, new: 18 },
    { name: 'Sat', active: 250, new: 7 },
    { name: 'Sun', active: 210, new: 5 },
  ];

  const subscriptionData = [
    { name: 'Free', value: 65 },
    { name: 'Basic', value: 20 },
    { name: 'Pro', value: 10 },
    { name: 'Enterprise', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <LineChart className="h-4 w-4 mr-2" />
            User Metrics
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <PieChart className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userRegistrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8884d8" name="New Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>Monthly task completion activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Completed Tasks" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* User Metrics Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>User activity by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" fill="#8884d8" name="Active Users" />
                      <Bar dataKey="new" fill="#82ca9d" name="New Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Users by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Journey Progress</CardTitle>
                <CardDescription>Average completion rate by journey phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Idea Generation', completion: 85 },
                        { name: 'Market Research', completion: 65 },
                        { name: 'Business Plan', completion: 45 },
                        { name: 'Financial Planning', completion: 35 },
                        { name: 'Legal Setup', completion: 30 },
                        { name: 'Marketing Strategy', completion: 25 },
                        { name: 'Launch Preparation', completion: 20 },
                      ]}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="completion" fill="#8884d8" name="Completion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'AI Assistant', value: 850 },
                        { name: 'Task Management', value: 750 },
                        { name: 'Education Content', value: 600 },
                        { name: 'Community', value: 450 },
                        { name: 'Resource Library', value: 300 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" name="Usage Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Monthly active user retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { month: 'Jan', retention: 95 },
                        { month: 'Feb', retention: 92 },
                        { month: 'Mar', retention: 88 },
                        { month: 'Apr', retention: 85 },
                        { month: 'May', retention: 82 },
                        { month: 'Jun', retention: 80 },
                        { month: 'Jul', retention: 78 },
                        { month: 'Aug', retention: 76 },
                        { month: 'Sep', retention: 75 },
                        { month: 'Oct', retention: 73 },
                        { month: 'Nov', retention: 72 },
                        { month: 'Dec', retention: 70 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="retention" 
                        stroke="#ff7300" 
                        name="Retention %" 
                        strokeWidth={2} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
