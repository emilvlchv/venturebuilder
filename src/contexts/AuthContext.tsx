
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserProfile, User, UserRole, BusinessProfileData } from '@/hooks/useUserProfile';
import { useAuthMethods, SignupData } from '@/hooks/useAuthMethods';

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

// Export types that may be used in other files
export type { User, UserRole, BusinessProfileData, SignupData };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks
  const { session, supabaseUser, isLoading: authStateLoading } = useAuthState();
  const { user, setUser } = useUserProfile(supabaseUser);
  const { 
    login: performLogin, 
    signup, 
    logout: performLogout, 
    updateUserInfo: performUpdateUserInfo, 
    updatePassword: performUpdatePassword,
    isLoading: authMethodsLoading 
  } = useAuthMethods();

  // Check for demo user in local storage for development mode
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser && !user) {
        setUser(JSON.parse(demoUser));
      }
    }
  }, [setUser, user]);

  // Derived state
  const isLoading = authStateLoading || authMethodsLoading;
  const isAuthenticated = !!user;

  // Wrapper methods that update local state after API operations
  const login = async (email: string, password: string) => {
    await performLogin(email, password);
    
    // For development mode with demo users
    if (process.env.NODE_ENV === 'development') {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      }
    }
  };

  const updateUserInfo = async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    
    // For development mode with demo users
    if (process.env.NODE_ENV === 'development' && localStorage.getItem('demo_user')) {
      const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
      const updatedUser = { ...demoUser, ...data };
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return;
    }
    
    await performUpdateUserInfo(user, data);
    
    // Update local state
    setUser({ ...user, ...data });
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated');
    
    // For development mode with demo users
    if (process.env.NODE_ENV === 'development' && localStorage.getItem('demo_user')) {
      // Mock password update for demo users
      return;
    }
    
    await performUpdatePassword(user, currentPassword, newPassword);
  };

  const logout = async () => {
    // For development mode with demo users
    if (process.env.NODE_ENV === 'development' && localStorage.getItem('demo_user')) {
      localStorage.removeItem('demo_user');
      setUser(null);
      return;
    }
    
    await performLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
