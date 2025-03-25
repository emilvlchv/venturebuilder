
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from './useUserProfile';

export type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
};

/**
 * Hook providing authentication methods for login, signup, logout, etc.
 */
export const useAuthMethods = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
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
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from login');
      }
      
      console.log('Login successful for user:', data.user.email);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      
      // Check if username already exists in the profiles table
      const { data: existingProfiles, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', userData.username);
      
      if (usernameCheckError) {
        console.error('Error checking username:', usernameCheckError);
        throw usernameCheckError;
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "This username is already taken. Please choose a different username.",
        });
        throw new Error('Username is already taken');
      }
      
      // Sign up with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
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
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from signup');
      }
      
      // Create user profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            role: userData.role || 'user',
          },
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          variant: "destructive",
          title: "Profile creation failed",
          description: "Your account was created but we couldn't set up your profile. Please contact support.",
        });
        
        // We still continue as the auth account was created successfully
      }
      
      toast({
        title: "Account created successfully",
        description: `Welcome to VentureWayfinder, ${userData.firstName}!`,
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserInfo = async (user: User, data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Check if username is unique if it's being updated
      if (data.username && data.username !== user.username) {
        const { data: existingProfiles, error: usernameCheckError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', data.username);
        
        if (usernameCheckError) {
          console.error('Error checking username:', usernameCheckError);
          throw usernameCheckError;
        }
        
        if (existingProfiles && existingProfiles.length > 0) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "This username is already taken. Please choose a different one.",
          });
          throw new Error('Username is already taken');
        }
      }
      
      // Update user metadata in auth if email is changing
      if (data.email && data.email !== user.email) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          email: data.email,
        });
        
        if (updateAuthError) {
          console.error('Error updating auth email:', updateAuthError);
          toast({
            variant: "destructive",
            title: "Update failed",
            description: updateAuthError.message,
          });
          throw updateAuthError;
        }
      }
      
      // Update profile in the profiles table
      const updates: Record<string, any> = {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.username && { username: data.username }),
        ...(data.businessIdea && { business_idea: data.businessIdea }),
        updated_at: new Date().toISOString(), // Convert Date to ISO string
      };
      
      // Only add business_profile_data if it exists in data
      if (data.businessProfileData) {
        updates.business_profile_data = data.businessProfileData;
      }
      
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: updateProfileError.message,
        });
        throw updateProfileError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
    } catch (error) {
      console.error('Update user info error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (user: User, currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "Current password is incorrect. Please try again.",
        });
        throw new Error('Current password is incorrect');
      }
      
      // Update the password
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updatePasswordError) {
        console.error('Error updating password:', updatePasswordError);
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: updatePasswordError.message,
        });
        throw updatePasswordError;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    updateUserInfo,
    updatePassword,
    isLoading,
  };
};
