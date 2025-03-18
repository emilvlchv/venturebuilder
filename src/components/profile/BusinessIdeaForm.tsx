import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { BusinessProfileData } from '@/utils/businessProfileUtils';

const businessIdeaSchema = z.object({
  businessIdea: z.string().min(10, { message: 'Please provide more details about your business idea.' }),
  targetCustomers: z.string().min(5, { message: 'Please describe your target customers.' }),
  teamComposition: z.string().min(3, { message: 'Please describe your team composition.' }),
  teamStrengths: z.string().min(3, { message: 'Please describe your team strengths.' }),
  teamWeaknesses: z.string().min(3, { message: 'Please describe areas where your team needs improvement.' }),
  revenueModel: z.string().optional(),
});

type BusinessIdeaFormValues = z.infer<typeof businessIdeaSchema>;

export function BusinessIdeaForm() {
  const { user, updateUserInfo } = useAuth();
  const { toast } = useToast();

  // Extract default values safely from user object
  const defaultValues = {
    businessIdea: user?.businessIdea || user?.businessProfileData?.solution || '',
    targetCustomers: user?.businessProfileData?.targetMarket || '',
    teamComposition: user?.businessProfileData?.stage || '',
    teamStrengths: user?.businessProfileData?.industry || '',
    teamWeaknesses: user?.businessProfileData?.problem || '',
    revenueModel: user?.businessProfileData?.revenueModel || '',
  };

  const form = useForm<BusinessIdeaFormValues>({
    resolver: zodResolver(businessIdeaSchema),
    defaultValues,
  });

  const onSubmit = async (data: BusinessIdeaFormValues) => {
    try {
      await updateUserInfo({ 
        businessIdea: data.businessIdea,
        businessProfileData: {
          solution: data.businessIdea,
          targetMarket: data.targetCustomers,
          stage: data.teamComposition,
          industry: data.teamStrengths,
          problem: data.teamWeaknesses,
          revenueModel: data.revenueModel,
        } as BusinessProfileData
      });
      
      // Also update any active journeys with this business data
      if (user?.id) {
        const journeysKey = `journeys_${user.id}`;
        const journeysData = localStorage.getItem(journeysKey);
        
        if (journeysData) {
          const journeys = JSON.parse(journeysData);
          let updated = false;
          
          const updatedJourneys = journeys.map((journey: any) => {
            if (journey.businessIdeaData) {
              updated = true;
              return {
                ...journey,
                businessIdeaData: {
                  ...journey.businessIdeaData,
                  businessIdea: data.businessIdea,
                  targetCustomers: data.targetCustomers,
                  teamComposition: data.teamComposition,
                  teamStrengths: data.teamStrengths,
                  teamWeaknesses: data.teamWeaknesses,
                  revenueModel: data.revenueModel,
                  // Add compatibility with the other format
                  solution: data.businessIdea,
                  targetMarket: data.targetCustomers,
                  stage: data.teamComposition,
                  industry: data.teamStrengths,
                  problem: data.teamWeaknesses,
                },
                updatedAt: new Date().toISOString()
              };
            }
            return journey;
          });
          
          if (updated) {
            localStorage.setItem(journeysKey, JSON.stringify(updatedJourneys));
          }
        }
      }
      
      toast({
        title: "Business information saved",
        description: "Your business details have been saved successfully. This will help personalize your journey and generate AI-powered recommendations.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving business information",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Your Business Profile</h2>
        <p className="text-muted-foreground mb-6">
          Share details about your business idea and team to receive a more personalized journey 
          experience with AI-generated tasks and recommendations tailored to your specific situation.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="businessIdea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Idea</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business idea in detail. What problem does it solve? What is your unique value proposition?" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetCustomers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Customers</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Who are your target customers? What are their demographics, needs, and pain points?" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="teamComposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Composition</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Who is on your team? What roles do they play?" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="revenueModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue Model (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How do you plan to make money? What is your pricing strategy?" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="teamStrengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Strengths</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What are your team's core strengths and expertise?" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teamWeaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas for Improvement</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What skills, knowledge or resources does your team currently lack?" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <FormDescription className="mb-4">
                This information will be used by our AI assistant to generate personalized tasks and recommendations 
                tailored to your specific business situation and team composition.
              </FormDescription>
              <Button type="submit">Save Business Profile</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
