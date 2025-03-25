
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/hooks/useUserProfile';

export const usePasswordUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updatePassword = async (
    user: User, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ error: Error | null }> => {
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
        return { error: new Error('Current password is incorrect') };
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
        return { error: updatePasswordError };
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePassword,
    isLoading
  };
};
