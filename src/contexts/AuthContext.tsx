
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessProfileData } from '@/utils/businessProfileUtils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { toast } = useToast();

  const initializeUsers = () => {
    console.log('Initializing users');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const adminExists = users.some((u: any) => u.email === 'admin@example.com');
    
    if (!adminExists) {
      console.log('Admin user does not exist, creating...');
      const adminUser = {
        id: 'user_admin',
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      };
      
      users.push(adminUser);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    const regularUserExists = users.some((u: any) => u.email === 'user@example.com');
    
    if (!regularUserExists) {
      console.log('Regular user does not exist, creating...');
      const regularUser = {
        id: 'user_regular',
        firstName: 'Regular',
        lastName: 'User',
        username: 'user',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        businessIdea: 'E-commerce platform for handmade crafts'
      };
      
      users.push(regularUser);
      console.log('Regular user created');
    } else {
      console.log('Regular user already exists');
    }
    
    localStorage.setItem('users', JSON.stringify(users));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User session restored:', parsedUser.email);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    initializeUsers();
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log(`Found ${users.length} users in localStorage`);
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        console.error('No matching user found');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
        throw new Error('Invalid email or password');
      }
      
      console.log('Login successful for user:', foundUser.email);
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.firstName}!`,
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
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: any) => u.email === userData.email)) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "A user with this email already exists. Please use a different email.",
        });
        throw new Error('User with this email already exists');
      }
      
      if (users.some((u: any) => u.username === userData.username)) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "This username is already taken. Please choose a different username.",
        });
        throw new Error('Username is already taken');
      }
      
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
        role: userData.role || 'user'
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
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

  const updateUserInfo = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "You must be logged in to update your profile.",
        });
        throw new Error('Not authenticated');
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "User not found. Please logout and login again.",
        });
        throw new Error('User not found');
      }
      
      if (data.username && data.username !== user.username) {
        const usernameExists = users.some((u: any) => 
          u.id !== user.id && u.username === data.username
        );
        if (usernameExists) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "This username is already taken. Please choose a different one.",
          });
          throw new Error('Username is already taken');
        }
      }
      
      if (data.email && data.email !== user.email) {
        const emailExists = users.some((u: any) => 
          u.id !== user.id && u.email === data.email
        );
        if (emailExists) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "This email is already in use. Please use a different one.",
          });
          throw new Error('Email is already in use');
        }
      }
      
      const updatedUser = { ...users[userIndex], ...data };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser({ ...user, ...data });
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      
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
      if (!user) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "You must be logged in to change your password.",
        });
        throw new Error('Not authenticated');
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "User not found. Please logout and login again.",
        });
        throw new Error('User not found');
      }
      
      if (users[userIndex].password !== currentPassword) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "Current password is incorrect. Please try again.",
        });
        throw new Error('Current password is incorrect');
      }
      
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
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
