
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart, FileText, Layers } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    { 
      title: "Total Users", 
      value: "1,254", 
      change: "+12%", 
      icon: <Users className="h-6 w-6" />,
      description: "Active users on the platform" 
    },
    { 
      title: "Business Ideas", 
      value: "847", 
      change: "+5%", 
      icon: <Layers className="h-6 w-6" />,
      description: "Ideas being developed" 
    },
    { 
      title: "Tasks Completed", 
      value: "15,648", 
      change: "+22%", 
      icon: <FileText className="h-6 w-6" />,
      description: "Tasks completed by users" 
    },
    { 
      title: "Avg. Completion Rate", 
      value: "68%", 
      change: "+3%", 
      icon: <BarChart className="h-6 w-6" />,
      description: "Tasks completion rate" 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </p>
              <CardDescription className="pt-1">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest user activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock activity data */}
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4 border-b border-border pb-3 last:border-0">
                  <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User signed up</p>
                    <p className="text-xs text-muted-foreground">
                      {i} {i === 1 ? 'hour' : 'hours'} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-sm text-green-500 font-medium">99.9%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "99.9%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">API Response Time</p>
                  <p className="text-sm text-amber-500 font-medium">189ms</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Database Load</p>
                  <p className="text-sm text-blue-500 font-medium">45%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Memory Usage</p>
                  <p className="text-sm text-primary font-medium">68%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
