
import React from 'react';
import Layout from '@/components/layout/Layout';
import { UserProfileSettings } from '@/components/profile/UserProfileSettings';
import { BusinessIdeaForm } from '@/components/profile/BusinessIdeaForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { BusinessIdeaMenu } from '@/components/profile/BusinessIdeaMenu';
import { ProgressDashboard } from '@/components/profile/ProgressDashboard';
import { AchievementBadges } from '@/components/profile/AchievementBadges';
import { SocialConnections } from '@/components/profile/SocialConnections';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-16 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and business ideas</p>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business Idea</TabsTrigger>
            <TabsTrigger value="idea-menu">Idea Menu</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="p-6">
              <UserProfileSettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="business">
            <Card className="p-6">
              <BusinessIdeaForm />
            </Card>
          </TabsContent>

          <TabsContent value="idea-menu">
            <Card className="p-6">
              <BusinessIdeaMenu />
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="p-6">
              <ProgressDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="p-6">
              <AchievementBadges />
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="p-6">
              <SocialConnections />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
