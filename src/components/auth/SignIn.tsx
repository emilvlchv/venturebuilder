
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignIn = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Get redirect URL from query params or default to journey
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo') || '/journey';
  
  // If user is already authenticated, redirect to journey page or specified redirect
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to:", redirectTo);
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, isLoading, redirectTo]);
  
  // Clear error when component mounts or location changes
  useEffect(() => {
    setAuthError(null);
  }, [location]);

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

  console.log("SignIn rendering, auth state:", { isAuthenticated, isLoading, redirectTo });
  
  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
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
            redirectTo={`${window.location.origin}${redirectTo}`}
            view="sign_in"
          />
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
