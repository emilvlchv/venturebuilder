
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { handleDemoLogin } from './authUtils';
import { LoginResponse, User } from './authTypes';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
      // For demo purposes, handle hardcoded demo credentials
      if (process.env.NODE_ENV === 'development') {
        const demoUser = handleDemoLogin(email, password);
        if (demoUser) {
          toast({
            title: "Demo login successful",
            description: "You are now logged in as a demo user",
          });
          return { user: { id: demoUser.id, email: demoUser.email }, error: null };
        }
      }
      
      // Regular Supabase authentication for non-demo users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Invalid email or password. Please try again.",
        });
        return { user: null, error };
      }
      
      console.log('Login successful for user:', data.user?.email);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      return { user: data.user || null, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading
  };
};
