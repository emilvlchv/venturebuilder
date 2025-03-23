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
  name: string;
  category: TaskCategory;
  subtasks: Subtask[];
  isCompleted: boolean;
}

export enum TaskCategory {
  MARKETING = "Marketing",
  FINANCE = "Finance",
  OPERATIONS = "Operations",
  LEGAL = "Legal",
  PRODUCT_DEVELOPMENT = "Product Development",
  SALES = "Sales",
  HUMAN_RESOURCES = "Human Resources",
  STRATEGY = "Strategy",
  CUSTOMER_SERVICE = "Customer Service",
  RESEARCH_AND_DEVELOPMENT = "Research and Development",
}

export interface Subtask {
  name: string;
  isCompleted: boolean;
}
