
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/hooks/useUserProfile';
import { checkUsernameExists } from './authUtils';

export const useProfileUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUserInfo = async (user: User, data: Partial<User>): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      
      // Check if username is unique if it's being updated
      if (data.username && data.username !== user.username) {
        const usernameExists = await checkUsernameExists(data.username);
        
        if (usernameExists) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "This username is already taken. Please choose a different one.",
          });
          return { error: new Error('Username is already taken') };
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
          return { error: updateAuthError };
        }
      }
      
      // Update profile in the profiles table
      const updates: Record<string, any> = {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.username && { username: data.username }),
        ...(data.businessIdea && { business_idea: data.businessIdea }),
        updated_at: new Date().toISOString(),
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
        return { error: updateProfileError };
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Update user info error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUserInfo,
    isLoading
  };
};
