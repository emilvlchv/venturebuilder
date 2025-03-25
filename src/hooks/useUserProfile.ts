
import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define a type for business profile data
export type BusinessProfileData = any; // Using 'any' since we don't know the exact structure

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
        // Safely cast the role to our UserRole type
        const safeRole: UserRole = data.role === 'admin' ? 'admin' : 'user';
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          username: data.username || '',
          businessIdea: data.business_idea || '',
          // Handle business_profile_data property safely
          businessProfileData: data.business_profile_data || null,
          role: safeRole,
        });
      } else {
        // If profile doesn't exist yet, just use basic info from auth
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
