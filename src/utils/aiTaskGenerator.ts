
import { v4 as uuidv4 } from 'uuid';
import { BusinessIdeaData, Task, TaskCategory, Subtask } from '@/components/journey/types';

/**
 * Generates a set of AI-customized tasks based on the user's business idea data
 */
export const generateAITasks = (businessData: BusinessIdeaData): Task[] => {
  if (!businessData || !businessData.businessIdea) {
    return [];
  }

  const tasks: Task[] = [];
  
  // Generate market validation tasks
  if (businessData.targetCustomers) {
    tasks.push(createMarketValidationTask(businessData));
  }
  
  // Generate team optimization tasks
  if (businessData.teamStrengths || businessData.teamWeaknesses) {
    tasks.push(createTeamOptimizationTask(businessData));
  }
  
  // Generate product development tasks
  if (businessData.businessIdea && businessData.problem) {
    tasks.push(createProductDevelopmentTask(businessData));
  }
  
  // Generate financial planning tasks
  if (businessData.revenueModel || businessData.businessIdea) {
    tasks.push(createFinancialPlanningTask(businessData));
  }
  
  // Generate marketing strategy tasks
  if (businessData.targetCustomers) {
    tasks.push(createMarketingStrategyTask(businessData));
  }
  
  return tasks;
};

/**
 * Creates a market validation task customized to the user's target customers
 */
const createMarketValidationTask = (businessData: BusinessIdeaData): Task => {
  const targetMarket = businessData.targetCustomers || 'target market';
  const businessIdea = businessData.businessIdea || 'business idea';
  const industry = businessData.industry || 'your industry';
  
  return {
    id: `ai-task-${Date.now()}-${uuidv4().substring(0, 8)}`,
    title: `Validate Your Idea with ${targetMarket.substring(0, 30)}`,
    description: `Create a validation strategy specifically for ${targetMarket} to ensure your business idea "${businessIdea.substring(0, 50)}..." resonates with them in the ${industry} space.`,
    status: 'pending',
    stepId: 'market-research',
    resources: ['Customer Interview Template', 'Validation Framework', 'Market Research Guide'],
    categories: [
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Customer Validation',
        subtasks: [
          { id: uuidv4(), title: `Create interview questions specific to ${targetMarket}`, completed: false },
          { id: uuidv4(), title: `Identify 8-10 potential customers from ${targetMarket}`, completed: false },
          { id: uuidv4(), title: 'Schedule and conduct customer interviews', completed: false },
          { id: uuidv4(), title: 'Document and analyze feedback patterns', completed: false },
          { id: uuidv4(), title: 'Prepare a validation summary report', completed: false }
        ],
        collapsed: false
      },
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Competitive Analysis',
        subtasks: [
          { id: uuidv4(), title: `Identify 5 main competitors serving ${targetMarket}`, completed: false },
          { id: uuidv4(), title: 'Analyze competitor strengths and weaknesses', completed: false },
          { id: uuidv4(), title: 'Identify market gaps and opportunities', completed: false },
          { id: uuidv4(), title: 'Define your unique value proposition', completed: false }
        ],
        collapsed: false
      }
    ]
  };
};

/**
 * Creates a team optimization task based on team strengths and weaknesses
 */
const createTeamOptimizationTask = (businessData: BusinessIdeaData): Task => {
  const strengths = businessData.teamStrengths || 'your team strengths';
  const weaknesses = businessData.teamWeaknesses || 'areas for improvement';
  const composition = businessData.teamComposition || 'your current team';
  
  return {
    id: `ai-task-${Date.now()}-${uuidv4().substring(0, 8)}`,
    title: `Team Optimization Strategy`,
    description: `Develop a plan to leverage "${strengths.substring(0, 40)}..." while addressing "${weaknesses.substring(0, 40)}..." with your ${composition} team structure.`,
    status: 'pending',
    stepId: 'idea-validation',
    resources: ['Team Assessment Template', 'Skill Gap Analysis Framework', 'Team Building Resources'],
    categories: [
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Team Assessment',
        subtasks: [
          { id: uuidv4(), title: `Document detailed team strengths in ${strengths.split(' ').slice(0, 3).join(' ')}`, completed: false },
          { id: uuidv4(), title: `Create improvement plan for ${weaknesses.split(' ').slice(0, 3).join(' ')}`, completed: false },
          { id: uuidv4(), title: 'Assign roles based on team member strengths', completed: false },
          { id: uuidv4(), title: 'Identify skills gaps and outsourcing needs', completed: false }
        ],
        collapsed: false
      },
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Team Development',
        subtasks: [
          { id: uuidv4(), title: 'Create a communication protocol for the team', completed: false },
          { id: uuidv4(), title: 'Establish decision-making framework', completed: false },
          { id: uuidv4(), title: 'Set up regular check-ins and progress reviews', completed: false },
          { id: uuidv4(), title: 'Identify training or mentorship opportunities', completed: false }
        ],
        collapsed: false
      }
    ]
  };
};

/**
 * Creates a product development task based on business idea and problem
 */
const createProductDevelopmentTask = (businessData: BusinessIdeaData): Task => {
  const problem = businessData.problem || 'the problem you\'re addressing';
  const solution = businessData.solution || businessData.businessIdea || 'your solution';
  
  return {
    id: `ai-task-${Date.now()}-${uuidv4().substring(0, 8)}`,
    title: `Develop MVP for ${solution.substring(0, 30)}`,
    description: `Create a minimal viable product (MVP) that addresses "${problem.substring(0, 50)}..." through your solution "${solution.substring(0, 50)}..."`,
    status: 'pending',
    stepId: 'business-plan',
    resources: ['MVP Planning Template', 'Feature Prioritization Framework', 'User Testing Guidelines'],
    categories: [
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'MVP Planning',
        subtasks: [
          { id: uuidv4(), title: 'Define core features that address the key problem', completed: false },
          { id: uuidv4(), title: 'Create MVP feature list and prioritization matrix', completed: false },
          { id: uuidv4(), title: 'Develop timeline and resource requirements', completed: false },
          { id: uuidv4(), title: 'Identify success metrics for MVP testing', completed: false }
        ],
        collapsed: false
      },
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Development & Testing',
        subtasks: [
          { id: uuidv4(), title: 'Create MVP prototype or initial version', completed: false },
          { id: uuidv4(), title: 'Develop testing protocol with target users', completed: false },
          { id: uuidv4(), title: 'Conduct MVP testing and collect feedback', completed: false },
          { id: uuidv4(), title: 'Document learnings and plan iterations', completed: false }
        ],
        collapsed: false
      }
    ]
  };
};

/**
 * Creates a financial planning task based on revenue model
 */
const createFinancialPlanningTask = (businessData: BusinessIdeaData): Task => {
  const revenueModel = businessData.revenueModel || 'your revenue model';
  const businessIdea = businessData.businessIdea || 'your business';
  
  return {
    id: `ai-task-${Date.now()}-${uuidv4().substring(0, 8)}`,
    title: `Financial Strategy for ${businessIdea.substring(0, 25)}`,
    description: `Develop a comprehensive financial plan and revenue strategy based on "${revenueModel.substring(0, 50) || businessIdea.substring(0, 50)}"`,
    status: 'pending',
    stepId: 'financial-projection',
    resources: ['Financial Projection Templates', 'Pricing Strategy Guide', 'Cash Flow Management Tools'],
    categories: [
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Financial Projections',
        subtasks: [
          { id: uuidv4(), title: 'Create startup cost estimation', completed: false },
          { id: uuidv4(), title: 'Develop 12-month revenue projection', completed: false },
          { id: uuidv4(), title: 'Create expense forecast and budget', completed: false },
          { id: uuidv4(), title: 'Calculate break-even analysis', completed: false },
          { id: uuidv4(), title: 'Develop 3-year financial forecast', completed: false }
        ],
        collapsed: false
      },
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Revenue Strategy',
        subtasks: [
          { id: uuidv4(), title: 'Finalize pricing model and strategy', completed: false },
          { id: uuidv4(), title: 'Define key revenue streams and metrics', completed: false },
          { id: uuidv4(), title: 'Create sales forecast and targets', completed: false },
          { id: uuidv4(), title: 'Develop financial KPIs and tracking systems', completed: false }
        ],
        collapsed: false
      }
    ]
  };
};

/**
 * Creates a marketing strategy task based on target customers
 */
const createMarketingStrategyTask = (businessData: BusinessIdeaData): Task => {
  const targetCustomers = businessData.targetCustomers || 'your target market';
  const businessIdea = businessData.businessIdea || 'your business';
  
  return {
    id: `ai-task-${Date.now()}-${uuidv4().substring(0, 8)}`,
    title: `Marketing Strategy for ${targetCustomers.substring(0, 25)}`,
    description: `Develop a targeted marketing plan to reach ${targetCustomers} and effectively communicate the value of ${businessIdea.substring(0, 40)}`,
    status: 'pending',
    stepId: 'marketing',
    resources: ['Marketing Plan Template', 'Customer Persona Worksheet', 'Channel Strategy Guide'],
    categories: [
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Audience Strategy',
        subtasks: [
          { id: uuidv4(), title: `Create detailed personas for ${targetCustomers}`, completed: false },
          { id: uuidv4(), title: 'Map customer journey and touchpoints', completed: false },
          { id: uuidv4(), title: 'Identify key messaging and value propositions', completed: false },
          { id: uuidv4(), title: 'Develop brand positioning statement', completed: false }
        ],
        collapsed: false
      },
      {
        id: `ai-cat-${Date.now()}-${uuidv4().substring(0, 8)}`,
        title: 'Channel Strategy',
        subtasks: [
          { id: uuidv4(), title: 'Identify primary marketing channels', completed: false },
          { id: uuidv4(), title: 'Develop content strategy and calendar', completed: false },
          { id: uuidv4(), title: 'Create marketing budget allocation', completed: false },
          { id: uuidv4(), title: 'Set up analytics and tracking systems', completed: false },
          { id: uuidv4(), title: 'Plan launch campaign', completed: false }
        ],
        collapsed: false
      }
    ]
  };
};
