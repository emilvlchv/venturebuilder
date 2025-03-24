
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileInformation from '@/components/profile/ProfileInformation';
import BusinessIdeaProfile from '@/components/profile/BusinessIdeaProfile';
import ProgressDashboard from '@/components/profile/ProgressDashboard';
import AchievementBadges from '@/components/profile/AchievementBadges';
import SocialConnections from '@/components/profile/SocialConnections';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/user-profile${value !== "profile" ? `?tab=${value}` : ''}`, { replace: true });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need to sign in to access your profile.",
      });
      navigate('/signin');
    }
  }, [isLoading, isAuthenticated, toast, navigate]);

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto py-16 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // This additional check ensures component doesn't try to render with null user
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Entrepreneur Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile, track your business progress, and connect with other entrepreneurs.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="business">Business Idea</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileInformation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Idea</CardTitle>
                <CardDescription>
                  Develop and refine your business concept
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessIdeaProfile />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Dashboard</CardTitle>
                <CardDescription>
                  Track your entrepreneurial journey and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
                <CardDescription>
                  Achievements and milestones you've reached
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementBadges />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Community Connections</CardTitle>
                <CardDescription>
                  Connect with other entrepreneurs in the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialConnections />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
