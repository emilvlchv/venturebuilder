
import { useState } from 'react';
import { User } from './useUserProfile';
import { SignupData } from './auth/authTypes';
import { useLogin } from './auth/useLogin';
import { useSignup } from './auth/useSignup';
import { useLogout } from './auth/useLogout';
import { useProfileUpdate } from './auth/useProfileUpdate';
import { usePasswordUpdate } from './auth/usePasswordUpdate';

// Re-export types
export type { SignupData };

/**
 * Hook providing authentication methods for login, signup, logout, etc.
 * This is a composite hook that combines specialized authentication hooks.
 */
export const useAuthMethods = () => {
  const { login: performLogin, isLoading: loginLoading } = useLogin();
  const { signup: performSignup, isLoading: signupLoading } = useSignup();
  const { logout: performLogout, isLoading: logoutLoading } = useLogout();
  const { updateUserInfo: performUpdateUserInfo, isLoading: updateInfoLoading } = useProfileUpdate();
  const { updatePassword: performUpdatePassword, isLoading: updatePasswordLoading } = usePasswordUpdate();
  
  // Overall loading state
  const isLoading = loginLoading || signupLoading || logoutLoading || updateInfoLoading || updatePasswordLoading;
  
  // Main login method
  const login = async (email: string, password: string) => {
    const result = await performLogin(email, password);
    if (result.error) {
      throw result.error;
    }
  };
  
  // Main signup method
  const signup = async (userData: SignupData) => {
    const result = await performSignup(userData);
    if (result.error) {
      throw result.error;
    }
  };
  
  // Main logout method
  const logout = async () => {
    const result = await performLogout();
    if (result.error) {
      throw result.error;
    }
  };
  
  // Main update user info method
  const updateUserInfo = async (user: User, data: Partial<User>) => {
    const result = await performUpdateUserInfo(user, data);
    if (result.error) {
      throw result.error;
    }
  };
  
  // Main update password method
  const updatePassword = async (user: User, currentPassword: string, newPassword: string) => {
    const result = await performUpdatePassword(user, currentPassword, newPassword);
    if (result.error) {
      throw result.error;
    }
  };
  
  return {
    login,
    signup,
    logout,
    updateUserInfo,
    updatePassword,
    isLoading
  };
};
