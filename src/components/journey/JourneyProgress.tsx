
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
  return (
    <div className="tabs-section mb-16">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8" aria-label="Journey phases">
          {phases.map(phase => (
            <TabsTrigger key={phase.id} value={phase.id}>
              {phase.title}
            </TabsTrigger>
          ))}
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
