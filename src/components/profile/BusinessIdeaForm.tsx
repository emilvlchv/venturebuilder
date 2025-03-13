
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const businessIdeaSchema = z.object({
  businessIdea: z.string().min(10, { message: 'Please provide more details about your business idea.' }),
});

type BusinessIdeaFormValues = z.infer<typeof businessIdeaSchema>;

export function BusinessIdeaForm() {
  const { user, updateUserInfo } = useAuth();
  const { toast } = useToast();

  const form = useForm<BusinessIdeaFormValues>({
    resolver: zodResolver(businessIdeaSchema),
    defaultValues: {
      businessIdea: user?.businessIdea || '',
    },
  });

  const onSubmit = async (data: BusinessIdeaFormValues) => {
    try {
      await updateUserInfo({ businessIdea: data.businessIdea });
      toast({
        title: "Business idea saved",
        description: "Your business idea has been saved successfully. This will help personalize your journey.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving business idea",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Business Idea</h2>
      <p className="text-muted-foreground mb-6">
        Share details about your business idea to receive a more personalized journey experience.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessIdea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Idea Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your business idea in detail. What problem does it solve? Who is your target audience? What makes your idea unique?" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This information will be used by our AI assistant to customize your journey and provide more relevant guidance.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save Business Idea</Button>
        </form>
      </Form>
    </div>
  );
}
