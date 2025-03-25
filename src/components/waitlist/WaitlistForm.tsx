
import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface WaitlistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  open, 
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // Here you would typically send this data to your API
    setIsSubmitted(true);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#f6f9fc] border-none shadow-lg animate-scale-in">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-brand-secondary p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
            <Rocket className="h-7 w-7 text-brand-accent" />
          </div>
          <DialogTitle className="text-2xl font-bold text-brand-main">
            Be First to Build with Ventureway
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Get early access to the platform that helps you map your startup journey. 
            Personalized plans, tools, and community.
          </p>
        </DialogHeader>

        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Full Name (optional)" 
                        {...field}
                        className="bg-white border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Email Address *" 
                        required
                        {...field}
                        className="bg-white border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-brand-accent hover:bg-brand-accent/90"
              >
                Join the Waitlist →
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </Form>
        ) : (
          <div className="py-8 text-center animate-fade-in">
            <div className="text-2xl mb-2">🎉</div>
            <h3 className="text-xl font-medium text-brand-main mb-2">
              You're on the list!
            </h3>
            <p className="text-muted-foreground">
              We'll keep you posted 👋
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistForm;
