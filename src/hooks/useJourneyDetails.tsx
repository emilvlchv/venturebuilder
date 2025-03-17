import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCategory, Subtask } from '@/components/journey/TaskCard';
import { StepDetail } from '@/components/journey/StepDetailsDialog';

// Sample journey phases for the demo
const journeyPhasesData = [
  {
    id: 'discovery',
    title: 'Discovery Phase',
    description: 'Explore and validate your business idea',
    steps: [
      {
        id: 'market-research',
        title: 'Market Research',
        description: 'Understand your target market and competitors',
        status: 'in-progress',
        hasActiveTasks: true,
        allTasksCompleted: false,
      },
      {
        id: 'idea-validation',
        title: 'Idea Validation',
        description: 'Test your business concept with potential customers',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'customer-interviews',
        title: 'Customer Interviews',
        description: 'Gather insights from your target audience',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      }
    ]
  },
  {
    id: 'planning',
    title: 'Planning Phase',
    description: 'Develop your business strategy and plan',
    steps: [
      {
        id: 'business-model',
        title: 'Business Model Canvas',
        description: 'Define how your business will create and deliver value',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'financial-projection',
        title: 'Financial Projection',
        description: 'Estimate costs, revenue, and profitability',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'competitive-analysis',
        title: 'Competitive Analysis',
        description: 'Analyze your competitors and define your unique value',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      }
    ]
  },
  {
    id: 'launch',
    title: 'Launch Phase',
    description: 'Prepare to bring your business to market',
    steps: [
      {
        id: 'legal-setup',
        title: 'Legal Setup',
        description: 'Register your business and handle legal requirements',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'marketing-plan',
        title: 'Marketing Plan',
        description: 'Develop your marketing strategy and channels',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'launch-preparation',
        title: 'Launch Preparation',
        description: 'Prepare all elements needed for your business launch',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      }
    ]
  },
  {
    id: 'growth',
    title: 'Growth Phase',
    description: 'Scale and expand your business',
    steps: [
      {
        id: 'customer-acquisition',
        title: 'Customer Acquisition',
        description: 'Develop strategies to attract and convert customers',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'business-operations',
        title: 'Business Operations',
        description: 'Streamline and optimize your business processes',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      },
      {
        id: 'scaling-strategy',
        title: 'Scaling Strategy',
        description: 'Plan how to grow and expand your business',
        status: 'pending',
        hasActiveTasks: false,
        allTasksCompleted: false,
      }
    ]
  }
];

// Sample step details for the market research step
const stepDetailsData: Record<string, StepDetail> = {
  'market-research': {
    title: 'Market Research',
    description: 'Understand your target market and competitors',
    timeEstimate: '2-3 weeks',
    detailedDescription: 
      'Market research is a critical first step in validating your business idea. ' +
      'It involves gathering, analyzing, and interpreting information about a market, ' +
      'its potential customers, and competitors. This research will help you understand ' +
      'if there\'s a real need for your product or service, how to position it in the market, ' +
      'and how to effectively reach your target audience.',
    tasks: [
      'Define your target market segments',
      'Analyze competitor strengths and weaknesses',
      'Conduct surveys or interviews with potential customers',
      'Research industry trends and market size',
      'Identify potential pricing strategies'
    ],
    examples: [
      'Example: A food delivery startup conducting research to understand customer preferences, delivery times, and pricing expectations in different neighborhoods.',
      'Example: An e-commerce clothing brand researching competitors to identify gaps in the market for sustainable fashion.'
    ],
    stepId: 'market-research'
  },
  'idea-validation': {
    title: 'Idea Validation',
    description: 'Test your business concept with potential customers',
    timeEstimate: '1-2 weeks',
    detailedDescription: 
      'Idea validation is the process of testing your business concept to determine ' +
      'if it solves a real problem for your target market. This step helps you confirm ' +
      'there\'s demand for your product or service before investing significant time ' +
      'and resources into development.',
    tasks: [
      'Create a minimal viable product (MVP) or prototype',
      'Get feedback from potential customers',
      'Analyze willingness to pay',
      'Refine your value proposition',
      'Document validated learnings'
    ],
    examples: [
      'Example: A software startup creating a simple landing page to gauge interest in their solution and collect email addresses of interested users.',
      'Example: A physical product business creating a prototype and getting feedback from potential customers at local events or through online focus groups.'
    ],
    stepId: 'idea-validation'
  }
};

// Sample tasks data
const initialTasksData = [
  {
    id: 'task-1',
    title: 'Conduct Customer Interviews',
    description: 'Interview at least 10 potential customers to understand their needs and pain points related to your business idea.',
    status: 'in-progress' as 'completed' | 'in-progress' | 'pending',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    stepId: 'market-research',
    resources: [
      'Interview Question Template',
      'Customer Persona Guidelines',
      'Interview Recording Tool Recommendations'
    ],
    categories: [
      {
        id: 'cat-1',
        title: 'Preparation',
        subtasks: [
          {
            id: 'subtask-1',
            title: 'Create list of interview questions',
            completed: true
          },
          {
            id: 'subtask-2',
            title: 'Identify 15-20 potential interviewees',
            completed: true
          },
          {
            id: 'subtask-3',
            title: 'Prepare interview script',
            completed: false
          }
        ]
      },
      {
        id: 'cat-2',
        title: 'Execution',
        subtasks: [
          {
            id: 'subtask-4',
            title: 'Schedule interviews with at least 10 people',
            completed: true
          },
          {
            id: 'subtask-5',
            title: 'Conduct interviews and record insights',
            completed: false
          },
          {
            id: 'subtask-6',
            title: 'Send thank you notes to participants',
            completed: false
          }
        ]
      },
      {
        id: 'cat-3',
        title: 'Analysis',
        subtasks: [
          {
            id: 'subtask-7',
            title: 'Organize and categorize feedback',
            completed: false
          },
          {
            id: 'subtask-8',
            title: 'Identify common patterns and insights',
            completed: false
          },
          {
            id: 'subtask-9',
            title: 'Create summary report of findings',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'task-2',
    title: 'Analyze Competitors',
    description: 'Research at least 5 direct competitors to understand their offerings, strengths, weaknesses, and market positioning.',
    status: 'pending' as 'completed' | 'in-progress' | 'pending',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    stepId: 'market-research',
    resources: [
      'Competitor Analysis Template',
      'Online Research Tools Guide',
      'SWOT Analysis Framework'
    ],
    categories: [
      {
        id: 'cat-4',
        title: 'Identification',
        subtasks: [
          {
            id: 'subtask-10',
            title: 'Identify 5-7 direct competitors',
            completed: false
          },
          {
            id: 'subtask-11',
            title: 'Identify 3-5 indirect competitors',
            completed: false
          }
        ]
      },
      {
        id: 'cat-5',
        title: 'Research',
        subtasks: [
          {
            id: 'subtask-12',
            title: 'Analyze pricing strategies',
            completed: false
          },
          {
            id: 'subtask-13',
            title: 'Evaluate marketing approaches',
            completed: false
          },
          {
            id: 'subtask-14',
            title: 'Review product/service features',
            completed: false
          },
          {
            id: 'subtask-15',
            title: 'Assess customer reviews and feedback',
            completed: false
          }
        ]
      },
      {
        id: 'cat-6',
        title: 'Comparison',
        subtasks: [
          {
            id: 'subtask-16',
            title: 'Create comparative matrix',
            completed: false
          },
          {
            id: 'subtask-17',
            title: 'Identify gaps and opportunities',
            completed: false
          },
          {
            id: 'subtask-18',
            title: 'Document competitive advantages',
            completed: false
          }
        ]
      }
    ]
  }
];

// Mock business data
const mockBusinessData = {
  name: 'EcoFresh Delivery',
  industry: 'Food & Beverage',
  stage: 'Idea/Concept',
  targetMarket: 'Urban professionals concerned about sustainability',
  problem: 'Excessive packaging waste in food delivery services',
  solution: 'Eco-friendly food delivery using reusable containers and electric vehicles'
};

export const useJourneyDetails = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [tasks, setTasks] = useState<Task[]>(initialTasksData);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newSubtasks, setNewSubtasks] = useState<{[key: string]: string}>({});
  
  const journey = {
    id: '8818f516-349c-46ec-a000-a89506ae78f6',
    title: 'Your Entrepreneurial Journey',
    description: 'A personalized roadmap to help you turn your business idea into reality.'
  };
  
  const getTasksByStepId = useCallback((stepId: string) => {
    return tasks.filter(task => task.stepId === stepId);
  }, [tasks]);
  
  const handleCreateTaskFromStep = useCallback((stepId: string, title: string, description: string, deadline?: Date) => {
    const taskDeadline = deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'pending',
      stepId,
      deadline: taskDeadline,
      resources: [],
      categories: [
        {
          id: uuidv4(),
          title: 'Getting Started',
          subtasks: [
            {
              id: uuidv4(),
              title: 'Define the scope of this task',
              completed: false
            },
            {
              id: uuidv4(),
              title: 'Set up initial resources needed',
              completed: false
            }
          ]
        }
      ]
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  }, []);
  
  const handleTaskStatusChange = useCallback((task: Task, status: 'completed' | 'in-progress' | 'pending') => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === task.id ? { ...t, status } : t
      )
    );
  }, []);
  
  const handleSubtaskToggle = useCallback((taskId: string, categoryId: string, subtaskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedCategories = task.categories.map(category => {
            if (category.id === categoryId) {
              const updatedSubtasks = category.subtasks.map(subtask => 
                subtask.id === subtaskId ? { ...subtask, completed } : subtask
              );
              return { ...category, subtasks: updatedSubtasks };
            }
            return category;
          });
          
          let newStatus = task.status;
          const allSubtasks = updatedCategories.flatMap(category => category.subtasks);
          const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
          
          if (completedCount === allSubtasks.length && allSubtasks.length > 0) {
            newStatus = 'completed';
          } else if (completedCount > 0) {
            newStatus = 'in-progress';
          } else {
            newStatus = 'pending';
          }
          
          return { ...task, categories: updatedCategories, status: newStatus };
        }
        return task;
      })
    );
  }, []);
  
  const handleCategoryToggle = useCallback((taskId: string, categoryId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedCategories = task.categories.map(category => 
            category.id === categoryId ? 
              { ...category, collapsed: !category.collapsed } : 
              category
          );
          return { ...task, categories: updatedCategories };
        }
        return task;
      })
    );
  }, []);
  
  const handleDeadlineChange = useCallback((taskId: string, deadline: Date | undefined) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, deadline } : task
      )
    );
  }, []);
  
  const handleOpenTaskDetails = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  }, []);
  
  const handleCloseTaskDetail = useCallback(() => {
    setIsTaskDetailOpen(false);
  }, []);
  
  const handleAddSubtask = useCallback((categoryId: string, title: string) => {
    if (!selectedTask) return;
    
    const newSubtask: Subtask = {
      id: uuidv4(),
      title,
      completed: false
    };
    
    const updatedTask = { ...selectedTask };
    const categoryIndex = updatedTask.categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks.push(newSubtask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id ? updatedTask : task
        )
      );
      
      setSelectedTask(updatedTask);
      
      if (updatedTask.status === 'pending') {
        handleTaskStatusChange(updatedTask, 'in-progress');
      }
    }
  }, [selectedTask, handleTaskStatusChange]);
  
  const handleRemoveSubtask = useCallback((categoryId: string, subtaskId: string) => {
    if (!selectedTask) return;
    
    const updatedTask = { ...selectedTask };
    const categoryIndex = updatedTask.categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex !== -1) {
      updatedTask.categories[categoryIndex].subtasks = 
        updatedTask.categories[categoryIndex].subtasks.filter(s => s.id !== subtaskId);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id ? updatedTask : task
        )
      );
      
      setSelectedTask(updatedTask);
      
      const allSubtasks = updatedTask.categories.flatMap(cat => cat.subtasks);
      if (allSubtasks.length === 0) {
        handleTaskStatusChange(updatedTask, 'pending');
      } else if (allSubtasks.every(subtask => subtask.completed)) {
        handleTaskStatusChange(updatedTask, 'completed');
      } else if (allSubtasks.some(subtask => subtask.completed)) {
        handleTaskStatusChange(updatedTask, 'in-progress');
      } else {
        handleTaskStatusChange(updatedTask, 'pending');
      }
    }
  }, [selectedTask, handleTaskStatusChange]);
  
  const safelyGetDate = (dateInput: Date | string | undefined): Date | undefined => {
    if (!dateInput) return undefined;
    
    try {
      if (typeof dateInput === 'string') {
        return new Date(dateInput);
      }
      return dateInput;
    } catch (error) {
      console.error('Error converting date:', error);
      return undefined;
    }
  };
  
  return {
    journey,
    businessData: mockBusinessData,
    journeyPhases: journeyPhasesData,
    activeTab,
    setActiveTab,
    tasks,
    selectedTask,
    isTaskDetailOpen,
    stepsDetailsMap: stepDetailsData,
    getTasksByStepId,
    handleCreateTaskFromStep,
    handleTaskStatusChange,
    handleSubtaskToggle,
    handleCategoryToggle,
    handleDeadlineChange,
    handleOpenTaskDetails,
    handleCloseTaskDetail,
    handleAddSubtask,
    handleRemoveSubtask,
    newSubtasks,
    setNewSubtasks,
    safelyGetDate
  };
};
