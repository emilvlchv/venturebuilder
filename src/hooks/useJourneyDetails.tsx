import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessIdeaData, Journey } from '@/components/journey/types';
import { Task, TaskCategory, Subtask } from '@/components/journey/TaskCard';
import { StepDetail } from '@/components/journey/StepDetailsDialog';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export const useJourneyDetails = () => {
  const { user } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessIdeaData | null>(null);
  const [activeTab, setActiveTab] = useState('ideation');
  const [selectedStep, setSelectedStep] = useState<StepDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.id && journeyId) {
      try {
        const journeysKey = `journeys_${user.id}`;
        const journeysData = localStorage.getItem(journeysKey);
        
        if (journeysData) {
          const journeys = JSON.parse(journeysData);
          const currentJourney = journeys.find((j: Journey) => j.id === journeyId);
          
          if (currentJourney) {
            setJourney(currentJourney);
            setBusinessData(currentJourney.businessIdeaData || null);
            loadTasks();
            return;
          }
        }
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.businessData) {
          setBusinessData(currentUser.businessData);
        }
      } catch (error) {
        console.error("Error loading journey data:", error);
      }
    }
  }, [user?.id, journeyId]);

  const loadTasks = () => {
    if (!user?.id || !journeyId) return;
    
    try {
      const tasksKey = `tasks_${user.id}_${journeyId}`;
      const tasksData = localStorage.getItem(tasksKey);
      
      if (tasksData) {
        const parsedTasks = JSON.parse(tasksData);
        setTasks(parsedTasks);
      } else {
        setTasks(getSampleTasks());
        saveTasks(getSampleTasks());
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    if (!user?.id || !journeyId) return;
    
    try {
      const tasksKey = `tasks_${user.id}_${journeyId}`;
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const getSampleTasks = (): Task[] => {
    
    return [
      {
        id: uuidv4(),
        title: "Market Research",
        description: "Research your target market and competitors",
        status: "in-progress",
        resources: ["Market Research Template", "Competitive Analysis Guide"],
        stepId: "market-research",
        categories: [
          {
            id: uuidv4(),
            title: "Target Audience",
            subtasks: [
              {
                id: uuidv4(),
                title: "Define primary customer personas",
                completed: true
              },
              {
                id: uuidv4(),
                title: "Identify customer pain points",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Estimate market size",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Analyze demographic data",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create customer journey map",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Competitor Analysis",
            subtasks: [
              {
                id: uuidv4(),
                title: "Identify top 3 competitors",
                completed: true
              },
              {
                id: uuidv4(),
                title: "Analyze competitor pricing models",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Document competitor strengths and weaknesses",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Analyze competitors' marketing strategies",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Review competitors' product features",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Industry Trends",
            subtasks: [
              {
                id: uuidv4(),
                title: "Identify key industry trends",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Analyze market growth rate",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Research technological advancements",
                completed: false
              }
            ]
          }
        ],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: "Value Proposition",
        description: "Define your unique value proposition",
        status: "pending",
        resources: ["Value Proposition Canvas", "Customer Value Template"],
        stepId: "value-proposition",
        categories: [
          {
            id: uuidv4(),
            title: "Core Benefits",
            subtasks: [
              {
                id: uuidv4(),
                title: "List key product/service benefits",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Identify unique selling points",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Map benefits to customer needs",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Quantify value delivered to customers",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Differentiation",
            subtasks: [
              {
                id: uuidv4(),
                title: "Compare with competitor offerings",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Craft value proposition statement",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Test proposition with potential customers",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Refine based on feedback",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Messaging",
            subtasks: [
              {
                id: uuidv4(),
                title: "Create elevator pitch",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Develop key marketing messages",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create customer-facing materials",
                completed: false
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: "MVP Planning",
        description: "Define core features for your minimum viable product",
        status: "pending",
        resources: ["Feature Prioritization Template", "MVP Guide"],
        stepId: "mvp",
        categories: [
          {
            id: uuidv4(),
            title: "Feature Prioritization",
            subtasks: [
              {
                id: uuidv4(),
                title: "List all potential features",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Score features based on value/effort",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Select core MVP features",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create feature roadmap",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Timeline Planning",
            subtasks: [
              {
                id: uuidv4(),
                title: "Set key development milestones",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create MVP development schedule",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Plan beta testing phase",
                completed: false
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Revenue Model Development",
        description: "Create a sustainable revenue model for your business",
        status: "pending",
        resources: ["Pricing Strategy Guide", "Revenue Model Templates"],
        stepId: "revenue-model",
        categories: [
          {
            id: uuidv4(),
            title: "Pricing Strategy",
            subtasks: [
              {
                id: uuidv4(),
                title: "Research industry pricing models",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Analyze competitor pricing",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Calculate cost-based pricing floor",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Determine value-based pricing ceiling",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Test pricing with potential customers",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Revenue Streams",
            subtasks: [
              {
                id: uuidv4(),
                title: "Identify primary revenue stream",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Explore secondary revenue opportunities",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create financial projections",
                completed: false
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Cost Structure Analysis",
        description: "Define your business cost structure",
        status: "pending",
        resources: ["Cost Analysis Template", "Break-even Calculator"],
        stepId: "cost-structure",
        categories: [
          {
            id: uuidv4(),
            title: "Fixed Costs",
            subtasks: [
              {
                id: uuidv4(),
                title: "Identify all fixed monthly costs",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Calculate yearly overhead",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Identify cost reduction opportunities",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Variable Costs",
            subtasks: [
              {
                id: uuidv4(),
                title: "Calculate per-unit production costs",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Estimate customer acquisition costs",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Analyze scaling cost implications",
                completed: false
              }
            ]
          },
          {
            id: uuidv4(),
            title: "Break-even Analysis",
            subtasks: [
              {
                id: uuidv4(),
                title: "Calculate break-even point",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Create sensitivity analysis",
                completed: false
              },
              {
                id: uuidv4(),
                title: "Project time to profitability",
                completed: false
              }
            ]
          }
        ]
      }
    ];
  };

  const handleTaskStatusChange = (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => {
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: `Task ${newStatus === 'completed' ? 'completed' : 'updated'}`,
      description: `"${task.title}" has been marked as ${newStatus}.`,
      variant: "default",
    });
  };

  const handleSubtaskToggle = (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedCategories = task.categories.map(category => {
          if (category.id === categoryId) {
            const updatedSubtasks = category.subtasks.map(subtask => {
              if (subtask.id === subtaskId) {
                return { ...subtask, completed };
              }
              return subtask;
            });
            
            return { ...category, subtasks: updatedSubtasks };
          }
          return category;
        });
        
        return { ...task, categories: updatedCategories };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleCategoryToggle = (taskId: string, categoryId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedCategories = task.categories.map(category => {
          if (category.id === categoryId) {
            return { ...category, collapsed: !category.collapsed };
          }
          return category;
        });
        
        return { ...task, categories: updatedCategories };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleDeadlineChange = (taskId: string, deadline: Date | undefined) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, deadline };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Deadline updated",
      description: deadline 
        ? `Deadline set to ${deadline.toLocaleDateString()}` 
        : "Deadline has been removed",
      variant: "default",
    });
  };

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleAddSubtask = (categoryId: string, title: string) => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        const updatedCategories = task.categories.map(category => {
          if (category.id === categoryId) {
            const newSubtask: Subtask = {
              id: uuidv4(),
              title,
              completed: false
            };
            
            return {
              ...category,
              subtasks: [...category.subtasks, newSubtask]
            };
          }
          return category;
        });
        
        return { ...task, categories: updatedCategories };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    const updatedSelectedTask = updatedTasks.find(t => t.id === selectedTask.id);
    if (updatedSelectedTask) {
      setSelectedTask(updatedSelectedTask);
    }
  };

  const handleRemoveSubtask = (categoryId: string, subtaskId: string) => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        const updatedCategories = task.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              subtasks: category.subtasks.filter(subtask => subtask.id !== subtaskId)
            };
          }
          return category;
        });
        
        return { ...task, categories: updatedCategories };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    const updatedSelectedTask = updatedTasks.find(t => t.id === selectedTask.id);
    if (updatedSelectedTask) {
      setSelectedTask(updatedSelectedTask);
    }
  };

  const handleCreateTaskFromStep = (stepId: string, title: string, description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: "pending",
      resources: [],
      stepId,
      categories: [
        {
          id: uuidv4(),
          title: "Action Items",
          subtasks: []
        }
      ]
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Task Created",
      description: `A new task "${title}" has been created.`,
      variant: "default",
    });
  };

  const getTasksByStepId = (stepId: string) => {
    return tasks.filter(task => task.stepId === stepId);
  };

  const handleOpenStepDetails = (stepId: string) => {
    const stepDetails = stepsDetailsMap[stepId];
    if (stepDetails) {
      setSelectedStep({
        ...stepDetails,
        stepId
      });
      setSelectedStepId(stepId);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStep(null);
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailOpen(false);
  };

  const handleBackToJourneys = () => {
    navigate('/journey');
  };

  
  const stepsDetailsMap: Record<string, StepDetail> = {
    
    'market-research': {
      title: 'Market Research',
      description: 'Research your target market and competitors',
      timeEstimate: '2-3 weeks',
      detailedDescription: 'Market research is crucial for understanding your customers, competitors, and industry trends. This foundational step helps you validate your business idea and identify potential gaps in the market.',
      tasks: [
        'Identify your target audience and create customer personas',
        'Analyze at least 3-5 direct competitors',
        'Research market size and growth potential',
        'Identify key industry trends and challenges',
        'Conduct customer interviews or surveys (aim for 10-15 responses)'
      ],
      examples: [
        'Example: A meal-prep startup might research busy professionals aged 25-45, analyze competitors like HelloFresh and Blue Apron, and survey potential customers about their meal preparation pain points.'
      ]
    },
    'value-proposition': {
      title: 'Value Proposition',
      description: 'Define your unique value proposition',
      timeEstimate: '1-2 weeks',
      detailedDescription: 'Your value proposition clearly articulates why customers should choose your product or service over competitors. It focuses on the specific benefits and solutions you provide to your target market.',
      tasks: [
        'Identify your product/service key benefits',
        'Define what makes your offering unique',
        'Create a compelling value proposition statement',
        'Test your value proposition with potential customers',
        'Refine based on feedback'
      ],
      examples: [
        'Example: Dropbox simple value proposition: "Secure file sharing and storage, anywhere" identifies both the core benefit (file sharing/storage) and the key differentiator (anywhere access).'
      ]
    },
    'mvp': {
      title: 'Minimum Viable Product',
      description: 'Plan your MVP features and timeline',
      timeEstimate: '2-4 weeks',
      detailedDescription: 'An MVP (Minimum Viable Product) is the simplest version of your product that delivers value to customers. Creating an MVP allows you to test your concept with real users while minimizing development time and resources.',
      tasks: [
        'List all possible features for your product/service',
        'Prioritize features based on customer needs and technical feasibility',
        'Define the core features for your MVP',
        'Create a development timeline with key milestones',
        'Establish success metrics for your MVP launch'
      ],
      examples: [
        'Example: Facebook MVP was simply a profile page and the ability to connect with friends - no marketplace, no groups, no video calls.'
      ]
    },
    'revenue-model': {
      title: 'Revenue Model',
      description: 'Define how your business will make money',
      timeEstimate: '1-2 weeks',
      detailedDescription: 'Your revenue model outlines how your business will generate income. It\'s essential to have a clear understanding of your pricing strategy, payment structure, and potential revenue streams.',
      tasks: [
        'Research pricing models in your industry',
        'Analyze competitor pricing strategies',
        'Define your primary and secondary revenue streams',
        'Calculate your cost structure and profit margins',
        'Test different pricing scenarios'
      ],
      examples: [
        'Example: A SaaS company might use a freemium model with basic features free and premium features at tiered subscription levels of $9.99, $19.99, and $49.99 per month.'
      ]
    },
    'cost-structure': {
      title: 'Cost Structure',
      description: 'Identify all costs associated with your business',
      timeEstimate: '1-2 weeks',
      detailedDescription: 'Understanding your cost structure helps you determine pricing, funding needs, and the path to profitability. This includes both one-time startup costs and ongoing operational expenses.',
      tasks: [
        'List all startup costs (equipment, licenses, legal fees, etc.)',
        'Identify fixed monthly costs (rent, salaries, subscriptions)',
        'Calculate variable costs per unit/service',
        'Estimate marketing and customer acquisition costs',
        'Create a break-even analysis'
      ],
      examples: [
        'Example: A boutique clothing store might have startup costs of $50,000 (renovations, inventory, POS system), fixed monthly costs of $8,000 (rent, utilities, staff), and variable costs of 40% of retail price per item sold.'
      ]
    },
    'business-entity': {
      title: 'Business Entity',
      description: 'Choose and register your business entity',
      timeEstimate: '2-3 weeks',
      detailedDescription: 'Selecting the right business entity type affects your legal liability, tax obligations, fundraising capabilities, and operational requirements. This is a crucial legal foundation for your business.',
      tasks: [
        'Research different business entity types (LLC, C-Corp, S-Corp, etc.)',
        'Consult with a business attorney or tax professional',
        'Register your chosen entity with state/local authorities',
        'Obtain necessary licenses and permits',
        'Set up your tax ID numbers and accounts'
      ],
      examples: [
        'Example: Many tech startups choose to form a C-Corporation in Delaware due to the state business-friendly laws and the ability to issue different classes of stock to investors.'
      ]
    },
    'accounting': {
      title: 'Accounting Setup',
      description: 'Set up your accounting and tax processes',
      timeEstimate: '1-2 weeks',
      detailedDescription: 'Proper accounting systems help you track finances, prepare for taxes, and make informed business decisions. Setting this up early helps avoid costly mistakes and compliance issues.',
      tasks: [
        'Select accounting software appropriate for your business',
        'Set up your chart of accounts',
        'Establish bookkeeping processes (weekly/monthly)',
        'Determine tax filing requirements and deadlines',
        'Consider hiring an accountant or bookkeeper'
      ],
      examples: [
        'Example: A small service business might start with QuickBooks Online ($25/month), set up weekly invoicing processes, and hire a part-time bookkeeper for 5 hours per month.'
      ]
    },
    'brand-identity': {
      title: 'Brand Identity',
      description: 'Create your brand identity and messaging',
      timeEstimate: '2-3 weeks',
      detailedDescription: 'Your brand identity encompasses your visual elements, voice, and messaging that communicate your company values and personality to customers. A consistent brand builds recognition and trust.',
      tasks: [
        'Define your brand values, mission, and personality',
        'Create your company name, logo, and visual elements',
        'Develop your brand voice and messaging guidelines',
        'Design basic marketing materials (business cards, etc.)',
        'Create brand style guidelines for consistency'
      ],
      examples: [
        'Example: Mailchimp playful brand identity features a distinctive yellow color, friendly chimp mascot, and conversational voice that makes email marketing seem approachable and fun.'
      ]
    },
    'marketing-plan': {
      title: 'Marketing Plan',
      description: 'Develop a comprehensive marketing plan',
      timeEstimate: '2-4 weeks',
      detailedDescription: 'A marketing plan outlines how you will reach and convert your target audience. It identifies the most effective channels, messaging, and tactics to acquire and retain customers.',
      tasks: [
        'Set specific, measurable marketing goals',
        'Identify key marketing channels for your audience',
        'Create a content strategy and editorial calendar',
        'Develop an advertising budget and plan',
        'Establish metrics to measure marketing effectiveness'
      ],
      examples: [
        'Example: A B2B software company might focus on LinkedIn content, industry webinars, and targeted email campaigns to reach decision-makers, with goals of generating 100 qualified leads per month.'
      ]
    },
    'launch-strategy': {
      title: 'Launch Strategy',
      description: 'Plan your product/service launch',
      timeEstimate: '2-4 weeks',
      detailedDescription: 'A well-executed launch introduces your product/service to the market with maximum impact. This critical phase requires careful planning to build anticipation and drive initial adoption.',
      tasks: [
        'Set launch goals and success metrics',
        'Create a launch timeline with key milestones',
        'Develop promotional assets and materials',
        'Plan launch events or activities',
        'Prepare customer onboarding and support processes'
      ],
      examples: [
        'Example: A mobile app might use a phased launch with a closed beta for 100 users, followed by an invite-only period to build exclusivity, and finally a public launch with press outreach and social media campaign.'
      ]
    }
  };

  
  const journeyPhases = [
    {
      id: 'ideation',
      title: 'Idea Validation',
      steps: [
        { 
          id: 'market-research', 
          title: 'Market Research', 
          description: 'Research your target market and competitors',
          status: 'in-progress',
          resources: ['Market Research Template', 'Competitive Analysis Guide']
        },
        { 
          id: 'value-proposition', 
          title: 'Value Proposition', 
          description: 'Define your unique value proposition',
          status: 'pending',
          resources: ['Value Proposition Canvas', 'Customer Value Template']
        },
        { 
          id: 'mvp', 
          title: 'Minimum Viable Product', 
          description: 'Plan your MVP features and timeline',
          status: 'pending',
          resources: ['MVP Planning Worksheet', 'Feature Prioritization Guide']
        }
      ]
    },
    {
      id: 'business-model',
      title: 'Business Model',
      steps: [
        { 
          id: 'revenue-model', 
          title: 'Revenue Model', 
          description: 'Define how your business will make money',
          status: 'pending',
          resources: ['Revenue Model Templates', 'Pricing Strategy Guide']
        },
        { 
          id: 'cost-structure', 
          title: 'Cost Structure', 
          description: 'Identify all costs associated with your business',
          status: 'pending',
          resources: ['Startup Cost Calculator', 'Operational Budget Template']
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Finance',
      steps: [
        { 
          id: 'business-entity', 
          title: 'Business Entity', 
          description: 'Choose and register your business entity',
          status: 'pending',
          resources: ['Entity Comparison Guide', 'Registration Checklist']
        },
        { 
          id: 'accounting', 
          title: 'Accounting Setup', 
          description: 'Set up your accounting and tax processes',
          status: 'pending',
          resources: ['Accounting Basics', 'Tax Considerations Guide']
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing & Launch',
      steps: [
        { 
          id: 'brand-identity', 
          title: 'Brand Identity', 
          description: 'Create your brand identity and messaging',
          status: 'pending',
          resources: ['Brand Strategy Template', 'Visual Identity Guide']
        },
        { 
          id: 'marketing-plan', 
          title: 'Marketing Plan', 
          description: 'Develop a comprehensive marketing plan',
          status: 'pending',
          resources: ['Marketing Plan Template', 'Digital Marketing Guide']
        },
        { 
          id: 'launch-strategy', 
          title: 'Launch Strategy', 
          description: 'Plan your product/service launch',
          status: 'pending',
          resources: ['Launch Checklist', 'Go-to-Market Strategy']
        }
      ]
    }
  ];

  return {
    journey,
    businessData,
    activeTab,
    setActiveTab,
    selectedStep,
    isDialogOpen,
    isTaskDetailOpen,
    journeyId,
    tasks,
    selectedTask,
    selectedStepId,
    handleTaskStatusChange,
    handleSubtaskToggle,
    handleCategoryToggle,
    handleDeadlineChange,
    handleOpenTaskDetails,
    handleAddSubtask,
    handleRemoveSubtask,
    handleCreateTaskFromStep,
    getTasksByStepId,
    handleOpenStepDetails,
    handleCloseDialog,
    handleCloseTaskDetail,
    handleBackToJourneys,
    stepsDetailsMap,
    journeyPhases
  };
};
