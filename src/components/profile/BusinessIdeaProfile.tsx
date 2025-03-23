
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const businessIdeaSchema = z.object({
  businessIdea: z.string().min(10, { message: 'Please provide more details about your business idea.' }),
  industry: z.string().min(2, { message: 'Please select an industry.' }),
  problemStatement: z.string().min(10, { message: 'Please describe the problem your business solves.' }),
  targetMarket: z.string().min(10, { message: 'Please describe your target market.' }),
  uniqueValueProposition: z.string().min(10, { message: 'Please describe what makes your business unique.' }),
  businessStage: z.string().min(2, { message: 'Please select your business stage.' }),
});

type BusinessIdeaFormValues = z.infer<typeof businessIdeaSchema>;

const INDUSTRY_OPTIONS = [
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'other', label: 'Other' }
];

const BUSINESS_STAGE_OPTIONS = [
  { value: 'ideation', label: 'Ideation Stage' },
  { value: 'validation', label: 'Validation Stage' },
  { value: 'early', label: 'Early Stage' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'mature', label: 'Mature Business' }
];

export default function BusinessIdeaProfile() {
  const { user, updateUserInfo } = useAuth();
  const { toast } = useToast();
  
  // Default values from user business profile data
  const defaultValues = {
    businessIdea: user?.businessIdea || '',
    industry: user?.businessProfileData?.industry || '',
    problemStatement: user?.businessProfileData?.problem || '',
    targetMarket: user?.businessProfileData?.targetMarket || '',
    uniqueValueProposition: user?.businessProfileData?.solution || '',
    businessStage: user?.businessProfileData?.stage || '',
  };

  const form = useForm<BusinessIdeaFormValues>({
    resolver: zodResolver(businessIdeaSchema),
    defaultValues,
  });

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        businessIdea: user.businessIdea || '',
        industry: user.businessProfileData?.industry || '',
        problemStatement: user.businessProfileData?.problem || '',
        targetMarket: user.businessProfileData?.targetMarket || '',
        uniqueValueProposition: user.businessProfileData?.solution || '',
        businessStage: user.businessProfileData?.stage || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: BusinessIdeaFormValues) => {
    try {
      await updateUserInfo({
        businessIdea: data.businessIdea,
        businessProfileData: {
          industry: data.industry,
          problem: data.problemStatement,
          targetMarket: data.targetMarket,
          solution: data.uniqueValueProposition,
          stage: data.businessStage,
        }
      });
      
      toast({
        title: "Business idea updated",
        description: "Your business idea information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating business idea",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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
                    placeholder="Describe your business idea in detail..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear and concise description of your business idea.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="businessStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Stage</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUSINESS_STAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="problemStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Statement</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What problem does your business solve?" 
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
            name="targetMarket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Market</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Who are your customers? Describe your target market." 
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
            name="uniqueValueProposition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Value Proposition</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What makes your business unique? How is it different from competitors?" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Save Business Profile</Button>
        </form>
      </Form>
    </div>
  );
}
