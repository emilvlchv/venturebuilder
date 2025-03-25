
import { User } from './authTypes';

// Demo users for development
const demoUsers = {
  user: {
    id: 'demo_user_id',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    username: 'demouser',
    role: 'user',
    isSubscribed: true,
    subscription: {
      planId: 'basic',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  admin: {
    id: 'demo_admin_id',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    username: 'adminuser',
    role: 'admin',
    isSubscribed: true,
    subscription: {
      planId: 'premium',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
};

/**
 * Handles demo login for development purposes
 */
export const handleDemoLogin = (email: string, password: string): User | null => {
  if (email === 'demo@example.com' && password === 'demo123') {
    localStorage.setItem('demo_user', JSON.stringify(demoUsers.user));
    localStorage.setItem('auth_token', 'demo_token_user');
    return demoUsers.user;
  } 
  
  if (email === 'admin@example.com' && password === 'admin123') {
    localStorage.setItem('demo_user', JSON.stringify(demoUsers.admin));
    localStorage.setItem('auth_token', 'demo_token_admin');
    return demoUsers.admin;
  }
  
  return null;
};

/**
 * Gets demo user from localStorage
 */
export const getDemoUser = (): User | null => {
  const demoUserJson = localStorage.getItem('demo_user');
  
  if (demoUserJson) {
    try {
      return JSON.parse(demoUserJson) as User;
    } catch (error) {
      console.error('Error parsing demo user from localStorage:', error);
      return null;
    }
  }
  
  return null;
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date and time
 */
export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid date';
  }
};
