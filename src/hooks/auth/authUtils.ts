
import { supabase } from '@/lib/supabase';
import { User } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';

// Function to check if username exists
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const { data: existingProfiles, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username);
    
    if (error) {
      console.error('Error checking username:', error);
      throw error;
    }
    
    return existingProfiles && existingProfiles.length > 0;
  } catch (error) {
    console.error('Error in checkUsernameExists:', error);
    throw error;
  }
};

// Demo user utilities
export const createDemoUser = (email: string, type: 'user' | 'admin') => {
  const isAdmin = type === 'admin';
  
  return {
    id: `demo_${type}_id`,
    email: email,
    firstName: 'Demo',
    lastName: isAdmin ? 'Admin' : 'User',
    username: isAdmin ? 'demoadmin' : 'demouser',
    role: isAdmin ? 'admin' : 'user'
  };
};

// Handle demo login in development mode
export const handleDemoLogin = (email: string, password: string): boolean => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  
  // Demo user account
  if (email === 'user@example.com' && password === 'password123') {
    localStorage.setItem('demo_user', JSON.stringify(createDemoUser(email, 'user')));
    toast({
      title: "Login successful",
      description: `Welcome back, Demo User!`,
    });
    return true;
  }
  
  // Demo admin account
  if (email === 'admin@example.com' && password === 'password123') {
    localStorage.setItem('demo_user', JSON.stringify(createDemoUser(email, 'admin')));
    toast({
      title: "Login successful",
      description: `Welcome back, Demo Admin!`,
    });
    return true;
  }
  
  return false;
};
