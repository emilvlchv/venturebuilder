
import { useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define a type for the auth state
export type AuthState = {
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
};

/**
 * Hook to manage authentication state with Supabase
 */
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    supabaseUser: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    const initialSession = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      setAuthState({
        session,
        supabaseUser: session?.user || null,
        isLoading: false,
      });
    };

    initialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setAuthState({
          session,
          supabaseUser: session?.user || null,
          isLoading: false,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
