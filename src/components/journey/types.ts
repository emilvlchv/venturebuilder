
export interface Journey {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  businessIdeaData?: BusinessIdeaData;
  status: 'active' | 'completed' | 'archived';
  progress: number; // 0-100
}

export interface BusinessIdeaData {
  businessIdea: string;
  teamComposition: string;
  teamStrengths: string;
  teamWeaknesses: string;
  targetCustomers: string;
  revenueModel?: string;
  marketingApproach?: string;
  challengesForeseen?: string;
  startupCosts?: string;
  timelineMilestones?: string;
  additionalInfo?: string;
}
