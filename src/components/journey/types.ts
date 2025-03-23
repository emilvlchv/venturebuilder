
export interface StepDetail {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  detailedDescription: string;
  status: 'pending' | 'in-progress' | 'completed';
  tasks: string[];
  businessIdea?: string;
  examples?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  stepId?: string;
  deadline?: Date | string;
  categories: TaskCategory[];
  resources?: string[];
  name?: string;
  category?: TaskCategory;
  subtasks?: Subtask[];
  isCompleted?: boolean;
}

export interface TaskCategory {
  id: string;
  title: string;
  subtasks: Subtask[];
  collapsed?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  name?: string;
  isCompleted?: boolean;
}

export interface BusinessIdeaData {
  businessIdea?: string;
  teamComposition?: string;
  teamStrengths?: string;
  teamWeaknesses?: string;
  targetCustomers?: string;
  revenueModel?: string;
  industry?: string;
  stage?: string;
  problem?: string;
  solution?: string;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  businessIdeaData?: BusinessIdeaData;
  status: 'active' | 'completed' | 'archived';
  progress: number;
}
