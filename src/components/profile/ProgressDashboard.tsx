
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Mock data - in a real app, this would come from your backend
const JOURNEY_PHASES = [
  { name: 'Ideation', value: 85, color: '#10b981' },
  { name: 'Validation', value: 65, color: '#3b82f6' },
  { name: 'Development', value: 40, color: '#6366f1' },
  { name: 'Launch', value: 10, color: '#8b5cf6' },
];

const WEEKLY_PROGRESS = [
  { name: 'Mon', tasks: 3 },
  { name: 'Tue', tasks: 5 },
  { name: 'Wed', tasks: 2 },
  { name: 'Thu', tasks: 7 },
  { name: 'Fri', tasks: 4 },
  { name: 'Sat', tasks: 1 },
  { name: 'Sun', tasks: 2 },
];

const SKILLS_DATA = [
  { name: 'Marketing', value: 65, color: '#10b981' },
  { name: 'Finance', value: 40, color: '#3b82f6' },
  { name: 'Product Dev', value: 75, color: '#6366f1' },
  { name: 'Legal', value: 25, color: '#8b5cf6' },
  { name: 'Sales', value: 55, color: '#ec4899' },
];

export default function ProgressDashboard() {
  const { user } = useAuth();
  const [overallProgress, setOverallProgress] = React.useState(0);

  React.useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => setOverallProgress(68), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total completed tasks
  const completedTasks = WEEKLY_PROGRESS.reduce((acc, day) => acc + day.tasks, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              You're making good progress on your journey!
            </p>
          </CardContent>
        </Card>
        
        {/* Tasks Completed Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Tasks completed this week
            </p>
          </CardContent>
        </Card>
        
        {/* Current Phase Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Validation</div>
            <p className="text-xs text-muted-foreground mt-2">
              65% complete in this phase
            </p>
          </CardContent>
        </Card>
        
        {/* Time Invested Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 hrs</div>
            <p className="text-xs text-muted-foreground mt-2">
              Total time spent on your journey
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journey Progress Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Journey Progress</CardTitle>
            <CardDescription>
              Your progress across different phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={JOURNEY_PHASES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {JOURNEY_PHASES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Activity Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Tasks completed per day this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_PROGRESS}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Skills Development */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Development</CardTitle>
          <CardDescription>
            Track your entrepreneurial skills development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SKILLS_DATA.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.value}%</span>
                </div>
                <Progress value={skill.value} className="h-2" indicatorColor={skill.color} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
