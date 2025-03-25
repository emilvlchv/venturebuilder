
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const logout = async (): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        return { error };
      }
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
