
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { checkUsernameExists } from './authUtils';
import { SignupData, SignupResponse } from './authTypes';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signup = async (userData: SignupData): Promise<SignupResponse> => {
    try {
      setIsLoading(true);
      
      // Check if username already exists
      const usernameExists = await checkUsernameExists(userData.username);
      
      if (usernameExists) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "This username is already taken. Please choose a different username.",
        });
        return { user: null, error: new Error('Username is already taken') };
      }
      
      // Sign up with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message,
        });
        return { user: null, error };
      }
      
      toast({
        title: "Account created successfully",
        description: `Welcome to VentureWayfinder${userData.firstName ? ', ' + userData.firstName : ''}!`,
      });
      
      return { 
        user: data.user ? { id: data.user.id, email: data.user.email || '' } : null, 
        error: null 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading
  };
};
