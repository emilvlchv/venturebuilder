import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyWizard, { BusinessIdeaData } from '@/components/journey/JourneyWizard';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, ArrowRight, Info } from 'lucide-react';
import Button from '@/components/shared/Button';
import { useToast } from '@/hooks/use-toast';
import StepDetailsDialog, { StepDetail } from '@/components/journey/StepDetailsDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskCard, { Task, TaskCategory, Subtask } from '@/components/journey/TaskCard';
import { v4 as uuidv4 } from 'uuid';

const Journey = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCompletedInitialChat, setHasCompletedInitialChat] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessIdeaData | null>(null);
  const [editingField, setEditingField] = useState<keyof BusinessIdeaData | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState('ideation');
  const [selectedStep, setSelectedStep] = useState<StepDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  // Load user data on component mount
  useEffect(() => {
    if (user?.id) {
      // Check if user has completed the initial chat
      const completedChat = localStorage.getItem(`journey_initial_chat_${user.id}`) === 'completed';
      setHasCompletedInitialChat(completedChat);
      
      // Load business data if available
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.businessData) {
          setBusinessData(currentUser.businessData);
        }
        
        // Load tasks if available
        const savedTasks = localStorage.getItem(`journey_tasks_${user.id}`);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          // Generate initial tasks if none exist
          setTasks(generateInitialTasks());
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // If there's an error, still generate initial tasks
        setTasks(generateInitialTasks());
      }
    }
  }, [user?.id]);

  // Generate initial tasks
  const generateInitialTasks = () => {
    const initialTasks: Record<string, Task[]> = {
      'ideation': [
        {
          id: uuidv4(),
          title: 'Market Research',
          description: 'Research your target market and competitors',
          status: 'in-progress',
          resources: ['Market Research Template', 'Competitive Analysis Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Customer Research',
              subtasks: [
                { id: uuidv4(), title: 'Create detailed customer personas', completed: false },
                { id: uuidv4(), title: 'Identify pain points and needs', completed: false },
                { id: uuidv4(), title: 'Research demographic information', completed: false },
                { id: uuidv4(), title: 'Map customer journey', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Competitor Analysis',
              subtasks: [
                { id: uuidv4(), title: 'Identify direct competitors', completed: true },
                { id: uuidv4(), title: 'Analyze competitor pricing', completed: false },
                { id: uuidv4(), title: 'Review competitor marketing strategies', completed: false },
                { id: uuidv4(), title: 'Identify gaps in competitor offerings', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Market Size & Trends',
              subtasks: [
                { id: uuidv4(), title: 'Research total addressable market', completed: false },
                { id: uuidv4(), title: 'Identify industry growth rate', completed: false },
                { id: uuidv4(), title: 'Document key market trends', completed: false },
                { id: uuidv4(), title: 'Analyze seasonal patterns', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Value Proposition',
          description: 'Define your unique value proposition',
          status: 'pending',
          resources: ['Value Proposition Canvas', 'Customer Value Template'],
          categories: [
            {
              id: uuidv4(),
              title: 'Core Benefits',
              subtasks: [
                { id: uuidv4(), title: 'List all product/service benefits', completed: false },
                { id: uuidv4(), title: 'Rank benefits by importance to customers', completed: false },
                { id: uuidv4(), title: 'Link benefits to customer pain points', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Differentiation',
              subtasks: [
                { id: uuidv4(), title: 'Identify unique features', completed: false },
                { id: uuidv4(), title: 'Compare with competitor offerings', completed: false },
                { id: uuidv4(), title: 'Define clear points of differentiation', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Value Statement',
              subtasks: [
                { id: uuidv4(), title: 'Create initial value proposition statement', completed: false },
                { id: uuidv4(), title: 'Test with potential customers', completed: false },
                { id: uuidv4(), title: 'Refine based on feedback', completed: false },
                { id: uuidv4(), title: 'Create final value statement', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Minimum Viable Product',
          description: 'Plan your MVP features and timeline',
          status: 'pending',
          resources: ['MVP Planning Worksheet', 'Feature Prioritization Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Feature Definition',
              subtasks: [
                { id: uuidv4(), title: 'List all possible features', completed: false },
                { id: uuidv4(), title: 'Categorize features (must-have vs nice-to-have)', completed: false },
                { id: uuidv4(), title: 'Link features to customer needs', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Prioritization',
              subtasks: [
                { id: uuidv4(), title: 'Score features by value and complexity', completed: false },
                { id: uuidv4(), title: 'Create priority matrix', completed: false },
                { id: uuidv4(), title: 'Select core MVP features', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Development Planning',
              subtasks: [
                { id: uuidv4(), title: 'Create development roadmap', completed: false },
                { id: uuidv4(), title: 'Set key milestones', completed: false },
                { id: uuidv4(), title: 'Establish MVP success metrics', completed: false }
              ]
            }
          ]
        }
      ],
      'business-model': [
        {
          id: uuidv4(),
          title: 'Revenue Model',
          description: 'Define how your business will make money',
          status: 'pending',
          resources: ['Revenue Model Templates', 'Pricing Strategy Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Pricing Strategy',
              subtasks: [
                { id: uuidv4(), title: 'Research industry pricing models', completed: false },
                { id: uuidv4(), title: 'Analyze competitor pricing', completed: false },
                { id: uuidv4(), title: 'Calculate value-based pricing', completed: false },
                { id: uuidv4(), title: 'Create pricing tiers', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Revenue Streams',
              subtasks: [
                { id: uuidv4(), title: 'Identify primary revenue stream', completed: false },
                { id: uuidv4(), title: 'Explore secondary revenue opportunities', completed: false },
                { id: uuidv4(), title: 'Evaluate recurring vs one-time revenue', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Financial Projections',
              subtasks: [
                { id: uuidv4(), title: 'Create sales forecast for 12 months', completed: false },
                { id: uuidv4(), title: 'Project revenue growth', completed: false },
                { id: uuidv4(), title: 'Calculate revenue targets', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Cost Structure',
          description: 'Identify all costs associated with your business',
          status: 'pending',
          resources: ['Startup Cost Calculator', 'Operational Budget Template'],
          categories: [
            {
              id: uuidv4(),
              title: 'Startup Costs',
              subtasks: [
                { id: uuidv4(), title: 'List one-time startup expenses', completed: false },
                { id: uuidv4(), title: 'Research equipment/technology needs', completed: false },
                { id: uuidv4(), title: 'Calculate legal and licensing costs', completed: false },
                { id: uuidv4(), title: 'Determine initial inventory needs', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Fixed Costs',
              subtasks: [
                { id: uuidv4(), title: 'Calculate monthly rent/lease costs', completed: false },
                { id: uuidv4(), title: 'Estimate insurance expenses', completed: false },
                { id: uuidv4(), title: 'Determine subscription services needed', completed: false },
                { id: uuidv4(), title: 'Calculate staff salaries', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Variable Costs',
              subtasks: [
                { id: uuidv4(), title: 'Calculate cost per unit/service', completed: false },
                { id: uuidv4(), title: 'Estimate shipping and fulfillment costs', completed: false },
                { id: uuidv4(), title: 'Project marketing expenses', completed: false },
                { id: uuidv4(), title: 'Determine commission structure', completed: false }
              ]
            }
          ]
        }
      ],
      'legal': [
        {
          id: uuidv4(),
          title: 'Business Entity',
          description: 'Choose and register your business entity',
          status: 'pending',
          resources: ['Entity Comparison Guide', 'Registration Checklist'],
          categories: [
            {
              id: uuidv4(),
              title: 'Entity Selection',
              subtasks: [
                { id: uuidv4(), title: 'Research business entity types', completed: false },
                { id: uuidv4(), title: 'Compare tax implications', completed: false },
                { id: uuidv4(), title: 'Evaluate liability protection', completed: false },
                { id: uuidv4(), title: 'Consult with legal advisor', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Registration Process',
              subtasks: [
                { id: uuidv4(), title: 'Choose business name', completed: false },
                { id: uuidv4(), title: 'File formation documents', completed: false },
                { id: uuidv4(), title: 'Obtain EIN/tax ID', completed: false },
                { id: uuidv4(), title: 'Register with state/local authorities', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Compliance',
              subtasks: [
                { id: uuidv4(), title: 'Research required licenses', completed: false },
                { id: uuidv4(), title: 'Apply for permits', completed: false },
                { id: uuidv4(), title: 'Understand regulatory requirements', completed: false },
                { id: uuidv4(), title: 'Set up compliance calendar', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Accounting Setup',
          description: 'Set up your accounting and tax processes',
          status: 'pending',
          resources: ['Accounting Basics', 'Tax Considerations Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Accounting System',
              subtasks: [
                { id: uuidv4(), title: 'Research accounting software options', completed: false },
                { id: uuidv4(), title: 'Set up chart of accounts', completed: false },
                { id: uuidv4(), title: 'Configure payment processing', completed: false },
                { id: uuidv4(), title: 'Connect bank accounts', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Financial Processes',
              subtasks: [
                { id: uuidv4(), title: 'Set up invoice templates', completed: false },
                { id: uuidv4(), title: 'Create expense tracking system', completed: false },
                { id: uuidv4(), title: 'Establish bookkeeping routine', completed: false },
                { id: uuidv4(), title: 'Define financial reporting process', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Tax Planning',
              subtasks: [
                { id: uuidv4(), title: 'Identify tax filing requirements', completed: false },
                { id: uuidv4(), title: 'Research sales tax obligations', completed: false },
                { id: uuidv4(), title: 'Set up tax calendar', completed: false },
                { id: uuidv4(), title: 'Find tax professional', completed: false }
              ]
            }
          ]
        }
      ],
      'marketing': [
        {
          id: uuidv4(),
          title: 'Brand Identity',
          description: 'Create your brand identity and messaging',
          status: 'pending',
          resources: ['Brand Strategy Template', 'Visual Identity Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Brand Foundation',
              subtasks: [
                { id: uuidv4(), title: 'Define brand values and mission', completed: false },
                { id: uuidv4(), title: 'Develop brand personality', completed: false },
                { id: uuidv4(), title: 'Create brand story', completed: false },
                { id: uuidv4(), title: 'Define brand positioning', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Visual Identity',
              subtasks: [
                { id: uuidv4(), title: 'Design logo', completed: false },
                { id: uuidv4(), title: 'Select brand colors', completed: false },
                { id: uuidv4(), title: 'Choose typography', completed: false },
                { id: uuidv4(), title: 'Create visual style guide', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Brand Voice',
              subtasks: [
                { id: uuidv4(), title: 'Define tone of voice', completed: false },
                { id: uuidv4(), title: 'Create messaging guidelines', completed: false },
                { id: uuidv4(), title: 'Develop tagline/slogan', completed: false },
                { id: uuidv4(), title: 'Create elevator pitch', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Marketing Plan',
          description: 'Develop a comprehensive marketing plan',
          status: 'pending',
          resources: ['Marketing Plan Template', 'Digital Marketing Guide'],
          categories: [
            {
              id: uuidv4(),
              title: 'Strategy Development',
              subtasks: [
                { id: uuidv4(), title: 'Set SMART marketing goals', completed: false },
                { id: uuidv4(), title: 'Define KPIs', completed: false },
                { id: uuidv4(), title: 'Establish marketing budget', completed: false },
                { id: uuidv4(), title: 'Identify target segments', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Channel Selection',
              subtasks: [
                { id: uuidv4(), title: 'Research marketing channels', completed: false },
                { id: uuidv4(), title: 'Prioritize channels based on audience', completed: false },
                { id: uuidv4(), title: 'Create channel-specific strategies', completed: false },
                { id: uuidv4(), title: 'Develop testing plan', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Content Planning',
              subtasks: [
                { id: uuidv4(), title: 'Identify content types', completed: false },
                { id: uuidv4(), title: 'Create content calendar', completed: false },
                { id: uuidv4(), title: 'Plan content production', completed: false },
                { id: uuidv4(), title: 'Develop distribution strategy', completed: false }
              ]
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Launch Strategy',
          description: 'Plan your product/service launch',
          status: 'pending',
          resources: ['Launch Checklist', 'Go-to-Market Strategy'],
          categories: [
            {
              id: uuidv4(),
              title: 'Pre-launch',
              subtasks: [
                { id: uuidv4(), title: 'Create launch timeline', completed: false },
                { id: uuidv4(), title: 'Develop teaser campaign', completed: false },
                { id: uuidv4(), title: 'Set up early access/waitlist', completed: false },
                { id: uuidv4(), title: 'Prepare press kit', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Launch Day',
              subtasks: [
                { id: uuidv4(), title: 'Prepare launch announcement', completed: false },
                { id: uuidv4(), title: 'Plan social media campaign', completed: false },
                { id: uuidv4(), title: 'Organize launch event', completed: false },
                { id: uuidv4(), title: 'Prepare email campaign', completed: false }
              ]
            },
            {
              id: uuidv4(),
              title: 'Post-launch',
              subtasks: [
                { id: uuidv4(), title: 'Plan follow-up communications', completed: false },
                { id: uuidv4(), title: 'Create customer onboarding process', completed: false },
                { id: uuidv4(), title: 'Set up feedback collection', completed: false },
                { id: uuidv4(), title: 'Prepare metrics tracking', completed: false }
              ]
            }
          ]
        }
      ]
    };
    
    return initialTasks;
  };

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Record<string, Task[]>) => {
    if (user?.id) {
      localStorage.setItem(`journey_tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const handleJourneyComplete = () => {
    console.log("Journey complete callback triggered");
    // Mark initial chat as completed when user finishes
    if (user?.id) {
      localStorage.setItem(`journey_initial_chat_${user.id}`, 'completed');
    }
    setHasCompletedInitialChat(true);
    
    // Reload business data
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.businessData) {
        setBusinessData(currentUser.businessData);
      }
    } catch (error) {
      console.error("Error loading updated business data:", error);
    }
  };

  const handleTaskStatusChange = (task: Task, newStatus: 'completed' | 'in-progress' | 'pending') => {
    const updatedTasks = { ...tasks };
    const phaseKey = activeTab;
    
    if (updatedTasks[phaseKey]) {
      const taskIndex = updatedTasks[phaseKey].findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        updatedTasks[phaseKey][taskIndex] = {
          ...updatedTasks[phaseKey][taskIndex],
          status: newStatus
        };
        
        // If marking as completed, also mark all subtasks as completed
        if (newStatus === 'completed') {
          updatedTasks[phaseKey][taskIndex].categories = updatedTasks[phaseKey][taskIndex].categories.map(category => ({
            ...category,
            subtasks: category.subtasks.map(subtask => ({
              ...subtask,
              completed: true
            }))
          }));
        }
        
        // If marking as in-progress and all subtasks are completed, update some subtasks to not completed
        if (newStatus === 'in-progress') {
          const allCompleted = updatedTasks[phaseKey][taskIndex].categories.every(
            category => category.subtasks.every(subtask => subtask.completed)
          );
          
          if (allCompleted) {
            updatedTasks[phaseKey][taskIndex].categories = updatedTasks[phaseKey][taskIndex].categories.map(category => {
              // Mark the last subtask in each category as not completed
              const updatedSubtasks = [...category.subtasks];
              if (updatedSubtasks.length > 0) {
                updatedSubtasks[updatedSubtasks.length - 1].completed = false;
              }
              return {
                ...category,
                subtasks: updatedSubtasks
              };
            });
          }
        }
        
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        
        toast({
          title: `Task ${newStatus === 'completed' ? 'Completed' : 'Updated'}`,
          description: `"${task.title}" has been marked as ${newStatus}.`,
        });
      }
    }
  };

  const handleSubtaskToggle = (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => {
    const updatedTasks = { ...tasks };
    const phaseKey = activeTab;
    
    if (updatedTasks[phaseKey]) {
      const taskIndex = updatedTasks[phaseKey].findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const categoryIndex = updatedTasks[phaseKey][taskIndex].categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
          const subtaskIndex = updatedTasks[phaseKey][taskIndex].categories[categoryIndex].subtasks.findIndex(s => s.id === subtaskId);
          if (subtaskIndex !== -1) {
            // Update the specific subtask
            updatedTasks[phaseKey][taskIndex].categories[categoryIndex].subtasks[subtaskIndex].completed = completed;
            
            // Check if all subtasks are completed
            const allCompleted = updatedTasks[phaseKey][taskIndex].categories.every(
              category => category.subtasks.every(subtask => subtask.completed)
            );
            
            // Update task status based on subtasks
            if (allCompleted) {
              updatedTasks[phaseKey][taskIndex].status = 'completed';
            } else {
              updatedTasks[phaseKey][taskIndex].status = 'in-progress';
            }
            
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      }
    }
  };

  const handleCategoryToggle = (taskId: string, categoryId: string) => {
    const updatedTasks = { ...tasks };
    const phaseKey = activeTab;
    
    if (updatedTasks[phaseKey]) {
      const taskIndex = updatedTasks[phaseKey].findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const categoryIndex = updatedTasks[phaseKey][taskIndex].categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
          // Toggle the collapsed state
          updatedTasks[phaseKey][taskIndex].categories[categoryIndex].collapsed = 
            !updatedTasks[phaseKey][taskIndex].categories[categoryIndex].collapsed;
          
          setTasks(updatedTasks);
          saveTasks(updatedTasks);
        }
      }
    }
  };

  const handleDeadlineChange = (taskId: string, deadline: Date | undefined) => {
    const updatedTasks = { ...tasks };
    const phaseKey = activeTab;
    
    if (updatedTasks[phaseKey]) {
      const taskIndex = updatedTasks[phaseKey].findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[phaseKey][taskIndex].deadline = deadline;
        
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        
        toast({
          title: "Deadline Updated",
          description: deadline 
            ? `Deadline set to ${format(deadline, 'MMMM d, yyyy')}` 
            : "Deadline has been removed",
        });
      }
    }
  };

  const handleEditClick = (field: keyof BusinessIdeaData) => {
    if (businessData) {
      setEditingField(field);
      setEditValue(businessData[field] as string);
    }
  };

  const handleSaveEdit = () => {
    if (!editingField || !businessData) return;
    
    try {
      // Create updated business data
      const updatedBusinessData = {
        ...businessData,
        [editingField]: editValue
      };
      
      // Update in state
      setBusinessData(updatedBusinessData);
      
      // Save to localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.businessData = updatedBusinessData;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Update users array if needed
      if (user?.id) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].businessData = updatedBusinessData;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
      
      toast({
        title: "Update Successful",
        description: "Your business information has been updated."
      });
      
      // Reset editing state
      setEditingField(null);
    } catch (error) {
      console.error("Error updating business data:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const renderFieldContent = (field: keyof BusinessIdeaData, label: string) => {
    if (!businessData) return null;
    
    const displayValue = businessData[field] as string;
    const isEditing = editingField === field;
    
    return (
      <div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {!isEditing && (
            <Button 
              onClick={() => handleEditClick(field)}
              variant="ghost" 
              size="sm"
              icon={<PenLine size={14} />}
              aria-label={`Edit ${label.toLowerCase()}`}
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[80px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p>{displayValue}</p>
        )}
      </div>
    );
  };

  // Define step details that will appear in the dialog
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
        'Identify your product or service key benefits',
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
        'List all possible features for your product or service',
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
      detailedDescription: 'Your revenue model outlines how your business will generate income. It is essential to have a clear understanding of your pricing strategy, payment structure, and potential revenue streams.',
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

  // Create a mapping of next steps to their corresponding tabs
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
    // Scroll to tabs section
    const tabsElement = document.querySelector('.tabs-section');
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStepDetails = (stepId: string) => {
    const stepDetails = stepsDetailsMap[stepId];
    if (stepDetails) {
      setSelectedStep(stepDetails);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStep(null);
  };

  useEffect(() => {
    // If coming from journey-details URL, ensure we show the completed journey view
    if (location.pathname.includes('journey-details')) {
      // Redirect to /journey but show the completed journey content
      navigate('/journey', { replace: true });
      setHasCompletedInitialChat(true);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Start Your Entrepreneurial Journey</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Our AI assistant will guide you through a series of questions to create a personalized roadmap for your business.
            </p>
          </div>
          
          {hasCompletedInitialChat ? (
            <SubscriptionCheck>
              {/* This content is only shown to users with subscriptions */}
              <div className="max-w-5xl mx-auto">
                {businessData && (
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
                        {businessData.revenueModel && (
                          <div>
                            <h3 className="font-medium">Revenue Model</h3>
                            <p className="text-muted-foreground">{businessData.revenueModel}</p>
                          </div>
                        )}
                      </div>
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
                      {Object.keys(tasks).map((phaseId) => (
                        <TabsTrigger key={phaseId} value={phaseId}>
                          {phaseId === 'ideation' ? 'Idea Validation' : 
                           phaseId === 'business-model' ? 'Business Model' : 
                           phaseId === 'legal' ? 'Legal & Finance' : 
                           phaseId === 'marketing' ? 'Marketing & Launch' : phaseId}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {Object.entries(tasks).map(([phaseId, phaseTasks]) => (
                      <TabsContent key={phaseId} value={phaseId}>
                        <h2 className="text-2xl font-bold mb-6">
                          {phaseId === 'ideation' ? 'Idea Validation' : 
                           phaseId === 'business-model' ? 'Business Model' : 
                           phaseId === 'legal' ? 'Legal & Finance' : 
                           phaseId === 'marketing' ? 'Marketing & Launch' : phaseId} Phase
                        </h2>
                        <div className="space-y-6">
                          {phaseTasks.map((task, index) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={index}
                              onOpenDetails={() => handleOpenStepDetails(task.id)}
                              onTaskStatusChange={handleTaskStatusChange}
                              onSubtaskToggle={handleSubtaskToggle}
                              onCategoryToggle={handleCategoryToggle}
                              onDeadlineChange={handleDeadlineChange}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </SubscriptionCheck>
          ) : (
            /* This is shown to all users - the initial chat to get their business idea */
            <JourneyWizard onComplete={handleJourneyComplete} />
          )}
        </div>
      </main>
      <Footer />
      <StepDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        stepDetails={selectedStep} 
      />
    </div>
  );
};

export default Journey;
