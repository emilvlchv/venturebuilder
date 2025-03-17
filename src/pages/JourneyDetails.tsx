import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessIdeaData, Journey } from '@/components/journey/types';
import { AlertCircle, CheckCircle2, Clock, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import StepDetailsDialog, { StepDetail } from '@/components/journey/StepDetailsDialog';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TaskCard, { Task, TaskCategory, Subtask } from '@/components/journey/TaskCard';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import TaskDetailSheet from '@/components/journey/TaskDetailSheet';

const JourneyDetails = () => {
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

  const nextStepsMap = {
    'Complete your business plan': 'ideation',
    'Research your market': 'ideation',
    'Define your unique value proposition': 'ideation',
    'Set up your legal structure': 'legal',
    'Create your marketing strategy': 'marketing'
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const handleStepClick = (tabId: string) => {
    setActiveTab(tabId);
    const tabsElement = document.querySelector('.tabs-section');
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleBackToJourneys = () => {
    navigate('/journey');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <SubscriptionCheck>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToJourneys}
                  className="text-primary hover:underline flex items-center mb-4"
                >
                  ← Back to All Journeys
                </Button>
                
                <div className="text-center mb-8">
                  <h1 className="h2 mb-4">{journey?.title || 'Your Entrepreneurial Journey'}</h1>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {journey?.description || 'Follow this personalized roadmap to turn your business idea into reality. Each phase contains actionable steps and resources to help you succeed.'}
                  </p>
                </div>
              </div>

              {businessData ? (
                <Card className="mb-10">
                  <CardHeader>
                    <CardTitle>Your Business Idea</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Business Concept</h3>
                        <p className="text-muted-foreground">{businessData.businessIdea}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Target Customers</h3>
                        <p className="text-muted-foreground">{businessData.targetCustomers}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Team Composition</h3>
                        <p className="text-muted-foreground">{businessData.teamComposition}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-10">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No business data available yet. Complete the initial questionnaire to see your personalized journey.</p>
                    <Button 
                      className="mt-4"
                      onClick={handleBackToJourneys}
                    >
                      Go to Journey Setup
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="mb-10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Next steps for your entrepreneurial journey:</h3>
                  <ol className="list-decimal list-inside space-y-3 pl-2">
                    {Object.entries(nextStepsMap).map(([stepText, tabId], index) => (
                      <li key={index}>
                        <button 
                          onClick={() => handleStepClick(tabId)}
                          className="text-left hover:text-primary inline-flex items-center"
                        >
                          {stepText}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4">Click on any step to begin, or use our AI assistant to guide you through the process.</p>
                </CardContent>
              </Card>

              <div className="tabs-section">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                    {journeyPhases.map((phase) => (
                      <TabsTrigger key={phase.id} value={phase.id}>{phase.title}</TabsTrigger>
                    ))}
                  </TabsList>

                  {journeyPhases.map((phase) => (
                    <TabsContent key={phase.id} value={phase.id}>
                      <h2 className="text-2xl font-bold mb-6">{phase.title} Phase</h2>
                      <div className="space-y-6">
                        {phase.steps.map((step, index) => (
                          <Card key={step.id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                                      {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                    <div className="ml-2">{renderStatusBadge(step.status)}</div>
                                  </div>
                                  <p className="text-muted-foreground mb-4">{step.description}</p>
                                  
                                  {getTasksByStepId(step.id).length > 0 && (
                                    <Badge variant="outline" className="mb-3">
                                      {getTasksByStepId(step.id).length} task{getTasksByStepId(step.id).length !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Resources:</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                      {step.resources.map((resource, i) => (
                                        <li key={i}>{resource}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleOpenStepDetails(step.id)}
                                    className="mr-2"
                                  >
                                    <Info className="h-4 w-4 mr-1" /> Details
                                  </Button>
                                  <Button size="sm">Start This Step</Button>
                                </div>
                              </div>
                              
                              {getTasksByStepId(step.id).length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                  <h4 className="font-medium mb-3">Related Tasks:</h4>
                                  <div className="space-y-4">
                                    {getTasksByStepId(step.id).map((task, taskIndex) => (
                                      <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={taskIndex}
                                        onOpenDetails={() => handleOpenTaskDetails(task)}
                                        onTaskStatusChange={handleTaskStatusChange}
                                        onSubtaskToggle={handleSubtaskToggle}
                                        onCategoryToggle={handleCategoryToggle}
                                        onDeadlineChange={handleDeadlineChange}
                                        onViewStep={(stepId) => handleOpenStepDetails(stepId)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </SubscriptionCheck>
        </div>
      </main>
      <Footer />
      
      <StepDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        stepDetails={selectedStep}
        relatedTasks={selectedStepId ? getTasksByStepId(selectedStepId) : []}
        onTaskToggle={handleSubtaskToggle}
        onTaskStatusChange={handleTaskStatusChange}
        onCategoryToggle={handleCategoryToggle}
        onDeadlineChange={handleDeadlineChange}
        onCreateTask={handleCreateTaskFromStep}
      />
      
      {selectedTask && (
        <TaskDetailSheet
          isOpen={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          taskTitle={selectedTask.title}
          taskId={selectedTask.id}
          categories={selectedTask.categories}
          deadline={selectedTask.deadline}
          onAddSubtask={handleAddSubtask}
          onRemoveSubtask={handleRemoveSubtask}
          onSubtaskToggle={(categoryId, subtaskId, completed) => 
            handleSubtaskToggle(selectedTask.id, categoryId, subtaskId, completed)}
          onDeadlineChange={(date) => handleDeadlineChange(selectedTask.id, date)}
        />
      )}
    </div>
  );
};

export default JourneyDetails;
