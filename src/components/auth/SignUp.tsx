
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

  // Set up auth state listener to capture errors
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user);
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
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/journey`}
            view="sign_up"
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
