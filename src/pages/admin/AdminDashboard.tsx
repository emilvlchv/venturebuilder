
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart, FileText, Layers, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    { 
      title: "Total Users", 
      value: "1,254", 
      change: "+12%", 
      trend: "up",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: "Active users on the platform" 
    },
    { 
      title: "Business Ideas", 
      value: "847", 
      change: "+5%", 
      trend: "up",
      icon: <Layers className="h-6 w-6 text-purple-500" />,
      description: "Ideas being developed" 
    },
    { 
      title: "Tasks Completed", 
      value: "15,648", 
      change: "+22%", 
      trend: "up",
      icon: <FileText className="h-6 w-6 text-green-500" />,
      description: "Tasks completed by users" 
    },
    { 
      title: "Conversion Rate", 
      value: "68%", 
      change: "-3%", 
      trend: "down",
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      description: "Free to paid subscription" 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary/20 to-primary"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>{stat.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <ArrowDownRight size={14} className="mr-1" />
                    <span>{stat.change}</span>
                  </div>
                )}
                <span className="ml-1 text-gray-500">from last month</span>
              </div>
              <CardDescription className="mt-2">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activities</CardTitle>
            <CardDescription>Latest user activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: <Users size={16} className="text-blue-500" />, action: "Sarah Johnson signed up", time: "1 hour ago", color: "bg-blue-50" },
                { icon: <FileText size={16} className="text-green-500" />, action: "New business plan submitted", time: "3 hours ago", color: "bg-green-50" },
                { icon: <TrendingUp size={16} className="text-amber-500" />, action: "Subscription upgraded to Pro", time: "5 hours ago", color: "bg-amber-50" },
                { icon: <Layers size={16} className="text-purple-500" />, action: "New learning module completed", time: "1 day ago", color: "bg-purple-50" },
                { icon: <BarChart size={16} className="text-indigo-500" />, action: "Monthly report generated", time: "2 days ago", color: "bg-indigo-50" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-4 border-b border-gray-100 pb-3 last:border-0">
                  <div className={`rounded-full h-8 w-8 ${activity.color} flex items-center justify-center`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platform Health</CardTitle>
            <CardDescription>System status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-sm text-green-500 font-medium">99.9%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "99.9%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">API Response Time</p>
                  <p className="text-sm text-amber-500 font-medium">189ms</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Database Load</p>
                  <p className="text-sm text-blue-500 font-medium">45%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Memory Usage</p>
                  <p className="text-sm text-purple-500 font-medium">68%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: "68%" }}></div>
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
