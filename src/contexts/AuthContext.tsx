
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  businessIdea?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUserInfo: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
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

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This is a mock login - in a real app, you would call an API
      // For demo purposes, we'll check if the user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
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
      // This is a mock signup - in a real app, you would call an API
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }
      
      if (users.some((u: any) => u.username === userData.username)) {
        throw new Error('Username is already taken');
      }
      
      // Create new user with ID
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log user in after signup
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInfo = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('Not authenticated');
      
      // Update user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Check if username is being updated and is already taken
      if (data.username && data.username !== user.username) {
        const usernameExists = users.some((u: any) => 
          u.id !== user.id && u.username === data.username
        );
        if (usernameExists) throw new Error('Username is already taken');
      }
      
      // Check if email is being updated and is already taken
      if (data.email && data.email !== user.email) {
        const emailExists = users.some((u: any) => 
          u.id !== user.id && u.email === data.email
        );
        if (emailExists) throw new Error('Email is already in use');
      }
      
      // Update user data while preserving the password
      const updatedUser = { ...users[userIndex], ...data };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user state and localStorage
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser({ ...user, ...data });
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      
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
      if (!user) throw new Error('Not authenticated');
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Verify current password
      if (users[userIndex].password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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

