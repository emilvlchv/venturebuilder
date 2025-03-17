
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessIdeaData } from '@/components/journey/JourneyWizard';
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import { Link } from 'react-router-dom';

const JourneyDetails = () => {
  const { user } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessIdeaData | null>(null);
  const [activeTab, setActiveTab] = useState('ideation');

  useEffect(() => {
    // Load business data from localStorage
    if (user?.id) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.businessData) {
          setBusinessData(currentUser.businessData);
        }
      } catch (error) {
        console.error("Error loading business data:", error);
      }
    }
  }, [user?.id]);

  // Define journey phases with steps
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

  // Create a mapping of steps to their corresponding tabs
  const stepToTabMapping = {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <SubscriptionCheck>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="h2 mb-4">Your Entrepreneurial Journey</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Follow this personalized roadmap to turn your business idea into reality. Each phase contains actionable steps and resources to help you succeed.
                </p>
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
                  </CardContent>
                </Card>
              )}

              <Card className="mb-10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Next steps for your entrepreneurial journey:</h3>
                  <ol className="list-decimal list-inside space-y-3 pl-2">
                    <li>
                      <button 
                        onClick={() => handleStepClick('ideation')}
                        className="text-left hover:text-primary inline-flex items-center"
                      >
                        Complete your business plan with our AI-powered templates
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleStepClick('ideation')}
                        className="text-left hover:text-primary inline-flex items-center"
                      >
                        Research your market and competitors
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleStepClick('ideation')}
                        className="text-left hover:text-primary inline-flex items-center"
                      >
                        Define your unique value proposition
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleStepClick('legal')}
                        className="text-left hover:text-primary inline-flex items-center"
                      >
                        Set up your legal structure and financial foundation
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleStepClick('marketing')}
                        className="text-left hover:text-primary inline-flex items-center"
                      >
                        Create your marketing strategy
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </li>
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
                                  
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Resources:</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                      {step.resources.map((resource, i) => (
                                        <li key={i}>{resource}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <Button size="sm">Start This Step</Button>
                                </div>
                              </div>
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
    </div>
  );
};

export default JourneyDetails;
