
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { BusinessProfileData } from '@/utils/businessProfileUtils';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  businessIdea?: string;
  businessProfileData?: BusinessProfileData;
  role?: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initialSession = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      
      if (session?.user) {
        setSupabaseUser(session.user);
        await fetchUserProfile(session.user);
      }
      
      setIsLoading(false);
    };

    initialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setSupabaseUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          username: data.username || '',
          businessIdea: data.business_idea || '',
          businessProfileData: data.business_profile_data,
          role: data.role || 'user',
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
      
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserInfo = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      if (!user || !supabaseUser) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "You must be logged in to update your profile.",
        });
        throw new Error('Not authenticated');
      }
      
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
      const updates = {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.username && { username: data.username }),
        ...(data.businessIdea && { business_idea: data.businessIdea }),
        ...(data.businessProfileData && { business_profile_data: data.businessProfileData }),
        updated_at: new Date(),
      };
      
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
      
      // Update local state
      setUser({ ...user, ...data });
      
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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      if (!user || !supabaseUser) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "You must be logged in to change your password.",
        });
        throw new Error('Not authenticated');
      }
      
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserInfo,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
