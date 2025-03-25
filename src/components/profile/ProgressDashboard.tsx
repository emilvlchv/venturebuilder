
import React from 'react';
import { ChartLineUp, ArrowUp, MoveRight, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';

export function ProgressDashboard() {
  const { user } = useAuth();
  const { 
    journeyPhases, 
    tasks = [], 
    getTasksByStepId 
  } = useJourneyDetails();

  // Calculate overall completion
  const calculateOverallProgress = () => {
    if (!journeyPhases || journeyPhases.length === 0) return 0;
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    journeyPhases.forEach(phase => {
      phase.steps.forEach(step => {
        totalSteps++;
        const stepTasks = getTasksByStepId(step.id);
        
        if (stepTasks.length === 0) {
          if (step.status === 'completed') completedSteps++;
          else if (step.status === 'in-progress') completedSteps += 0.5;
        } else {
          // Calculate based on tasks
          const totalSubtasks = stepTasks.flatMap(task => 
            task.categories?.flatMap(cat => cat.subtasks) || []
          );
          
          if (totalSubtasks.length > 0) {
            const completedSubtasks = totalSubtasks.filter(sub => sub.completed).length;
            completedSteps += (completedSubtasks / totalSubtasks.length);
          }
        }
      });
    });
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const overallProgress = calculateOverallProgress();
  
  // Generate phase progress data
  const phaseProgress = journeyPhases?.map(phase => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    phase.steps.forEach(step => {
      const stepTasks = getTasksByStepId(step.id);
      
      if (stepTasks.length === 0) {
        totalTasks++;
        if (step.status === 'completed') completedTasks++;
        else if (step.status === 'in-progress') completedTasks += 0.5;
      } else {
        const allSubtasks = stepTasks.flatMap(task => 
          task.categories?.flatMap(cat => cat.subtasks) || []
        );
        totalTasks += allSubtasks.length || 1;
        completedTasks += allSubtasks.filter(sub => sub.completed).length;
      }
    });
    
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      id: phase.id,
      title: phase.title,
      progress,
      steps: phase.steps.length,
      completedSteps: phase.steps.filter(s => s.status === 'completed').length
    };
  }) || [];

  // Get recently completed tasks
  const recentlyCompletedTasks = tasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Progress Dashboard</h2>
        <div className="text-sm font-medium text-muted-foreground">
          Business: {user?.businessIdea || "Not set"}
        </div>
      </div>

      {/* Overall Progress Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Overall Progress</h3>
            <div className="text-2xl font-bold">{overallProgress}%</div>
          </div>
          <Progress value={overallProgress} className="h-2 mb-2" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{journeyPhases?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {journeyPhases?.reduce((acc, phase) => acc + phase.steps.length, 0) || 0}
              </div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <div className="text-xs text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phaseProgress.map(phase => (
          <Card key={phase.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{phase.title}</h3>
                <div className="text-sm font-bold">{phase.progress}%</div>
              </div>
              <Progress value={phase.progress} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {phase.completedSteps}/{phase.steps} steps completed
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentlyCompletedTasks.length > 0 ? (
            <div className="space-y-3">
              {recentlyCompletedTasks.map(task => (
                <div key={task.id} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <ChartLineUp className="mx-auto h-10 w-10 opacity-20 mb-2" />
              <p>No completed tasks yet</p>
              <p className="text-sm">Start working on your journey to see progress here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
