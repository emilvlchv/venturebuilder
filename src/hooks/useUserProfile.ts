
import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define a type for business profile data
export type BusinessProfileData = any; // We'll keep this flexible for now

// Define UserRole type to ensure type safety
export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  businessIdea?: string;
  businessProfileData?: BusinessProfileData;
  role?: UserRole;
};

/**
 * Hook to fetch and manage user profile data
 */
export const useUserProfile = (supabaseUser: SupabaseUser | null) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (supabaseUser) {
      fetchUserProfile(supabaseUser);
    } else {
      setUser(null);
    }
  }, [supabaseUser]);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log("Fetching profile for user ID:", supabaseUser.id);
      
      // Fetch user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log("Profile data received:", data);
        
        // Safely cast the role to our UserRole type
        const safeRole: UserRole = data.role === 'admin' ? 'admin' : 'user';
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          username: data.username || '',
          businessIdea: data.business_idea || '',
          businessProfileData: data.business_profile_data || null,
          role: safeRole,
        });
      } else {
        // If profile doesn't exist yet, just use basic info from auth
        console.log("No profile found for user, using basic auth data");
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: '',
          lastName: '',
          username: '',
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  return { user, setUser };
};
