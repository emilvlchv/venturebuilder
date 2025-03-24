
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignUp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // If user is already authenticated, redirect to journey page
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to journey");
      navigate('/journey');
    }
  }, [isAuthenticated, navigate, isLoading]);
  
  // Clear error when component mounts
  useEffect(() => {
    setAuthError(null);
  }, []);

  // Set up auth state listener to capture errors and events
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user);
      } else if (event === 'USER_CREATED' && session) {
        console.log('User signed up:', session.user);
        setAuthError(null);
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        setAuthError('Please check your email to reset your password');
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  console.log("SignUp rendering, auth state:", { isAuthenticated, isLoading });
  
  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: 'hsl(var(--primary))', color: 'white' },
                anchor: { color: 'hsl(var(--primary))' },
                message: { 
                  color: 'red' 
                },
                container: { gap: '8px' }
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/journey`}
            view="sign_up"
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                  link_text: 'Don\'t have an account? Sign up'
                }
              }
            }}
          />
        </CardContent>
        
        <CardFooter className="text-center flex-col">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
