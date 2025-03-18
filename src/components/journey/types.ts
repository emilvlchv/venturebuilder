export interface BusinessIdeaData {
  businessIdea: string;
  targetCustomers: string;
  teamComposition: string;
  teamStrengths: string;
  teamWeaknesses: string;
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

export interface JourneyTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  stepId: string;
  deadline?: Date;
  resources: string[];
  categories: {
    id: string;
    title: string;
    subtasks: {
      id: string;
      title: string;
      completed: boolean;
    }[];
    collapsed?: boolean;
  }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  stepId?: string;
  deadline?: Date;
  resources: string[];
  categories: TaskCategory[];
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
}

export interface StepDetail {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  detailedDescription: string;
  businessIdea?: string;
  status: string;
  tasks?: Task[];
}
