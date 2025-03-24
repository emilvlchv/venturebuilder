
import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a default context with empty functions
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Since we're not implementing real authentication, we'll just return the default context
  return (
    <AuthContext.Provider value={defaultAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};
