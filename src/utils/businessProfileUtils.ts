import { BusinessIdeaData } from '@/components/journey/types';

// Function to format business data for AI processing
export const formatBusinessDataForAI = (businessData: BusinessIdeaData) => {
  return `
Business Idea: ${businessData?.businessIdea || 'Not specified'}
Target Customers: ${businessData?.targetCustomers || 'Not specified'}
Team Composition: ${businessData?.teamComposition || 'Not specified'}
Team Strengths: ${businessData?.teamStrengths || 'Not specified'}
Team Weaknesses: ${businessData?.teamWeaknesses || 'Not specified'}
Revenue Model: ${businessData?.revenueModel || 'Not specified'}
  `.trim();
};

// This type defines the business profile data structure
export interface BusinessProfileData {
  solution?: string;
  targetMarket?: string;
  stage?: string;
  industry?: string;
  problem?: string;
  revenueModel?: string;
}

// Helper function to convert user business data to the standard format
export const adaptBusinessDataFromProfile = (profileData: BusinessProfileData): BusinessIdeaData => {
  return {
    businessIdea: profileData?.solution || '',
    targetCustomers: profileData?.targetMarket || '',
    teamComposition: profileData?.stage || '',
    teamStrengths: profileData?.industry || '',
    teamWeaknesses: profileData?.problem || '',
    revenueModel: profileData?.revenueModel || ''
  };
};

// This interface extends the User type with the business data field
export interface UserWithBusinessData {
  id: string;
  email: string;
  displayName?: string;
  businessIdea?: string;
  businessProfileData?: BusinessProfileData;
  // Other user properties...
}
