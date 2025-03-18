
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhaseSection from './PhaseSection';
import { Task } from './TaskCard';

export interface JourneyPhase {
  id: string;
  title: string;
  description: string;
  steps: {
    id: string;
    title: string;
    description: string;
    status: string;
    hasActiveTasks?: boolean;
    allTasksCompleted?: boolean;
    resources: string[];
  }[];
}

interface JourneyProgressProps {
  phases: JourneyPhase[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  getTasksByStepId: (stepId: string) => Task[];
  onOpenTaskDetails: (task: Task) => void;
  journeyId?: string;
}

const JourneyProgress: React.FC<JourneyProgressProps> = ({
  phases,
  activeTab,
  setActiveTab,
  getTasksByStepId,
  onOpenTaskDetails,
  journeyId
}) => {
  // Calculate phase completion percentages
  const getPhaseCompletionPercentage = (phase: JourneyPhase) => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    phase.steps.forEach(step => {
      const stepTasks = getTasksByStepId(step.id);
      totalTasks += stepTasks.length;
      completedTasks += stepTasks.filter(task => task.status === 'completed').length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  return (
    <div className="tabs-section mb-16">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8" aria-label="Journey phases">
          {phases.map(phase => {
            const completion = getPhaseCompletionPercentage(phase);
            return (
              <TabsTrigger key={phase.id} value={phase.id} className="relative">
                <span>{phase.title}</span>
                <div className="absolute -bottom-1 left-0 w-full px-4">
                  <div className="h-1 bg-gray-200 rounded-full w-full">
                    <div 
                      className="h-1 bg-green-500 rounded-full" 
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>
                <span className="absolute -bottom-5 text-xs font-medium text-muted-foreground">
                  {completion}%
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {phases.map(phase => (
          <TabsContent key={phase.id} value={phase.id} className="space-y-8">
            <PhaseSection
              title={phase.title}
              steps={phase.steps}
              getTasksByStepId={getTasksByStepId}
              onOpenTaskDetails={onOpenTaskDetails}
              journeyId={journeyId}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default JourneyProgress;
