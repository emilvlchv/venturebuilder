
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signInSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const supabaseReady = isSupabaseConfigured();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  
  // Check if there's a redirect path in the location state
  const from = location.state?.from || '/journey';
  
  // If user is already authenticated, redirect to journey page or the page they tried to access
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setLoginError(null);
      await login(data.email, data.password);
      // Navigation will happen in the effect when isAuthenticated changes
    } catch (error) {
      console.error("Login submission error:", error);
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  // Demo account quick login buttons for development
  const loginWithDemoAccount = async (email: string, password: string) => {
    try {
      setLoginError(null);
      await login(email, password);
      // Navigation will happen in the effect when isAuthenticated changes
    } catch (error) {
      console.error("Demo login error:", error);
      setLoginError('Failed to log in with demo account. Please try again.');
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue your entrepreneurial journey</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loginError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-2" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </Form>
        
        {process.env.NODE_ENV === 'development' && (
          <>
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Dev mode login options
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => loginWithDemoAccount('user@example.com', 'password123')}
                className="text-xs"
              >
                Demo User
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => loginWithDemoAccount('admin@example.com', 'password123')}
                className="text-xs"
              >
                Demo Admin
              </Button>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
