import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfileData } from '@/utils/businessProfileUtils';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  businessIdea?: string;
  businessProfileData?: BusinessProfileData;
  role?: 'admin' | 'user';
  avatarUrl?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (data: Partial<AuthUser>) => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Successfully signed in",
              description: "Welcome to VentureWayfinder!",
            });
            
            // Get redirect URL from query params or default to journey
            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirectTo') || '/journey';
            navigate(redirectTo);
          }
        } else {
          setUser(null);
          
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been successfully signed out.",
            });
            navigate('/');
          }
        }

        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (profile) {
        const userProfile: AuthUser = {
          id: profile.id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          username: profile.username || '',
          email: authUser.email || '',
          businessIdea: profile.business_idea || undefined,
          role: (profile.role as 'admin' | 'user') || 'user',
          avatarUrl: profile.avatar_url || undefined
        };
        
        setUser(userProfile);
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
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        throw error;
      }
      
      console.log('Login successful for user:', data.user?.email);
      
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
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
            role: userData.role || 'user'
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message,
        });
        throw error;
      }
      
      console.log('Signup successful:', data);
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInfo = async (data: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      if (!user || !session) throw new Error('Not authenticated');
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          business_idea: data.businessIdea
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Update user info error:', error);
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: error.message,
        });
        throw error;
      }
      
      // Update local user state
      setUser({ ...user, ...data });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
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
      if (!session) throw new Error('Not authenticated');
      
      // First, verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      });
      
      if (signInError) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "Current password is incorrect",
        });
        throw new Error('Current password is incorrect');
      }
      
      // If sign-in succeeded, update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: error.message,
        });
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message,
        });
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
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
