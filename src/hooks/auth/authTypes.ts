
import { UserRole } from '@/hooks/useUserProfile';

export type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  error: Error | null;
};

export type SignupResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  error: Error | null;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  isSubscribed?: boolean;
  subscription?: {
    planId: string;
    status: string;
    currentPeriodEnd: string;
  };
};
