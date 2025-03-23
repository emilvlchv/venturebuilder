
import { Task, TaskCategory, Subtask, BusinessIdeaData } from '@/components/journey/types';
import { formatBusinessDataForAI } from './businessProfileUtils';

// Sample personalized tasks based on business data
export const generateAITasks = (businessData: BusinessIdeaData): Task[] => {
  console.log("Generating AI tasks based on business data:", businessData);
  
  // Default tasks that will be customized based on business data
  const tasks: Task[] = [];
  
  // Personalization variables from business data
  const industry = businessData.industry || businessData.teamStrengths || '';
  const stage = businessData.stage || businessData.teamComposition || '';
  const targetMarket = businessData.targetCustomers || businessData.targetMarket || '';
  const problem = businessData.problem || businessData.teamWeaknesses || '';
  const solution = businessData.solution || businessData.businessIdea || '';
  
  // Task 1: Market Research & Validation - Customized based on target market and industry
  const marketResearchTask: Task = {
    id: `task-mr-${Date.now()}`,
    title: `Market Research & Validation for ${industry ? industry + ' ' : ''}${solution ? solution.substring(0, 30) + '...' : 'Your Business Idea'}`,
    description: `Conduct thorough market research to validate your ${industry || 'business'} concept${targetMarket ? ' for ' + targetMarket : ''}.`,
    status: 'pending',
    stepId: 'market-research',
    resources: [
      targetMarket ? `Conduct surveys with ${targetMarket}` : 'Conduct customer surveys',
      `Analyze ${industry || 'industry'} reports for market trends`,
      `Interview potential customers${targetMarket ? ' in the ' + targetMarket + ' segment' : ''}`
    ],
    categories: [
      {
        id: 'cat-mr-1',
        title: 'Market Analysis',
        subtasks: [
          { id: 'subtask-mr-1', title: `Define ${targetMarket ? targetMarket + ' as your' : 'your'} target market`, completed: false },
          { id: 'subtask-mr-2', title: `Research competitors in the ${industry || 'industry'}`, completed: false },
          { id: 'subtask-mr-3', title: 'Identify market gaps and opportunities', completed: false }
        ],
        collapsed: false
      },
      {
        id: 'cat-mr-2',
        title: 'Validation Methods',
        subtasks: [
          { id: 'subtask-mr-4', title: `Create surveys for ${targetMarket || 'potential customers'}`, completed: false },
          { id: 'subtask-mr-5', title: 'Conduct customer interviews', completed: false },
          { id: 'subtask-mr-6', title: `Test your ${solution ? solution.substring(0, 20) + '...' : 'concept'} with focus groups`, completed: false }
        ],
        collapsed: false
      }
    ],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
  };
  tasks.push(marketResearchTask);
  
  // Task 2: Business Plan Development - Customized based on business stage and problem/solution
  const businessPlanTask: Task = {
    id: `task-bp-${Date.now()}`,
    title: `Develop Business Plan for ${stage ? stage + ' ' : ''}${solution ? solution.substring(0, 30) + '...' : 'Your Business'}`,
    description: `Create a comprehensive business plan that outlines your strategy for ${problem ? 'solving ' + problem : 'your business concept'}.`,
    status: 'pending',
    stepId: 'business-plan',
    resources: [
      'Business plan templates',
      `Financial forecasting tools for ${stage || 'startups'}`,
      `${industry || 'Industry'} benchmark data`
    ],
    categories: [
      {
        id: 'cat-bp-1',
        title: 'Strategic Planning',
        subtasks: [
          { id: 'subtask-bp-1', title: 'Define vision and mission statements', completed: false },
          { id: 'subtask-bp-2', title: `Set goals and objectives for ${stage || 'your business'}`, completed: false },
          { id: 'subtask-bp-3', title: 'Outline growth strategy', completed: false }
        ],
        collapsed: false
      },
      {
        id: 'cat-bp-2',
        title: 'Financial Projections',
        subtasks: [
          { id: 'subtask-bp-4', title: `Create sales forecast based on ${targetMarket || 'market research'}`, completed: false },
          { id: 'subtask-bp-5', title: `Determine startup costs for ${industry || 'your business'}`, completed: false },
          { id: 'subtask-bp-6', title: 'Project cash flow for first year', completed: false }
        ],
        collapsed: false
      }
    ],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
  };
  tasks.push(businessPlanTask);
  
  // Task 3: Marketing Strategy - Customized based on target market and solution
  const marketingTask: Task = {
    id: `task-mkt-${Date.now()}`,
    title: `Marketing Strategy for ${targetMarket ? targetMarket + ' ' : ''}${solution ? solution.substring(0, 30) + '...' : 'Your Business'}`,
    description: `Develop your brand identity and marketing approach to reach ${targetMarket || 'your target audience'} with your ${solution ? solution.substring(0, 20) + '...' : 'solution'}.`,
    status: 'pending',
    stepId: 'marketing',
    resources: [
      'Brand identity guidelines',
      `Marketing channel comparison for ${targetMarket || 'your target market'}`,
      'Content strategy templates'
    ],
    categories: [
      {
        id: 'cat-mkt-1',
        title: 'Brand Development',
        subtasks: [
          { id: 'subtask-mkt-1', title: `Design logo and visual elements for ${solution ? solution.substring(0, 20) + '...' : 'your brand'}`, completed: false },
          { id: 'subtask-mkt-2', title: 'Create brand messaging that resonates with your audience', completed: false },
          { id: 'subtask-mkt-3', title: 'Develop brand guidelines', completed: false }
        ],
        collapsed: false
      },
      {
        id: 'cat-mkt-2',
        title: 'Marketing Channels',
        subtasks: [
          { id: 'subtask-mkt-4', title: `Identify primary marketing channels for ${targetMarket || 'your audience'}`, completed: false },
          { id: 'subtask-mkt-5', title: 'Create content calendar', completed: false },
          { id: 'subtask-mkt-6', title: 'Set marketing budget', completed: false }
        ],
        collapsed: false
      }
    ],
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
  };
  tasks.push(marketingTask);
  
  return tasks;
};

// Generate AI response for the chatbot
export const generateAIChatResponse = (
  userMessage: string, 
  businessData?: BusinessIdeaData
): string => {
  // Basic intent detection
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! How can I help you with your business journey today?";
  }
  
  if (message.includes('business idea') || message.includes('concept')) {
    if (businessData?.businessIdea) {
      return `I see your business idea is about ${businessData.businessIdea}. This is interesting! What specific aspect would you like to explore further?`;
    }
    return "I'd be happy to discuss your business idea. Could you share more details about what you're thinking?";
  }
  
  if (message.includes('market research')) {
    return "Market research is critical for validation. Consider these methods: surveys, competitor analysis, interviews, focus groups, and industry reports. Which would you like to know more about?";
  }
  
  if (message.includes('funding') || message.includes('investment')) {
    return "For funding, you could explore bootstrapping, friends & family, angel investors, venture capital, crowdfunding, loans, or grants. Each has pros and cons depending on your business stage.";
  }
  
  if (message.includes('stuck') || message.includes('help') || message.includes('advice')) {
    return "I'm here to help! Could you provide more specific details about what you're struggling with?";
  }
  
  // Default response
  return "That's an interesting question. Could you provide more context about your specific situation so I can give you the most helpful guidance?";
};
