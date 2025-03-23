
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const signInSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authMode, setAuthMode] = React.useState<'ui' | 'manual'>('manual');
  
  // If user is already authenticated, redirect to journey page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/journey');
    }
  }, [isAuthenticated, navigate]);
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setAuthError(null);
      await login(data.email, data.password);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      navigate('/journey');
    } catch (error: any) {
      setAuthError(error.message || "Invalid email or password");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={authMode} onValueChange={(value) => setAuthMode(value as 'ui' | 'manual')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Standard Login</TabsTrigger>
              <TabsTrigger value="ui">Supabase Auth UI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <LogIn className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="ui">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="light"
                providers={[]}
                redirectTo={window.location.origin + '/journey'}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="text-center flex-col">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
