
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
    // Set up auth state listener FIRST (best practice for Supabase auth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.email);
        setAuthState({
          session,
          supabaseUser: session?.user || null,
          isLoading: false,
        });
      }
    );

    // THEN check for existing session
    const initialSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        console.log("Initial session check:", session?.user?.email || "No session");
        
        setAuthState({
          session,
          supabaseUser: session?.user || null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error in initialSession:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
