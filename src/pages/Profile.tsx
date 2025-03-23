
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { UserProfileSettings } from '@/components/profile/UserProfileSettings';
import { BusinessIdeaForm } from '@/components/profile/BusinessIdeaForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-16 px-4 md:px-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-16 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and business ideas</p>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="business">Business Idea</TabsTrigger>
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
